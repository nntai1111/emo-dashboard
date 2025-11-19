// src/services/realtime.ts
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import tokenManager from "./tokenManager";

let connection: HubConnection | null = null;
let currentAliasId: string | null = null;

export const connectSignalR = async (aliasId: string, token: string) => {
  if (connection?.state === "Connected") {
    console.log("SignalR: Already connected");
    if (currentAliasId !== aliasId) {
      await joinGroup(aliasId);
    }
    return;
  }

  const url = `wss://api.emoease.vn/realtimehub-service/hubs/notifications?aliasId=${aliasId}`;
  console.log("SignalR: Connecting (skip negotiate) to", url);

  connection = new HubConnectionBuilder()
    .withUrl(url, {
      accessTokenFactory: () => token,
      skipNegotiation: true,
      transport: 1, // WebSockets
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(LogLevel.Information)
    .build();

  // === EVENT LISTENERS ===
  connection.on("ReceiveProgressUpdate", (data) => {
    console.log("SignalR: ReceiveProgressUpdate", data);
    window.dispatchEvent(new CustomEvent("progressUpdate", { detail: data }));
  });

  connection.on("ReceiveRewardNotification", (data) => {
    console.log("SignalR: ReceiveRewardNotification", data);
    window.dispatchEvent(
      new CustomEvent("rewardNotification", { detail: data })
    );
  });

  // Reward failed but with rendered sticker available
  connection.on("ReceiveRewardFailedNotification", (data) => {
    console.log("SignalR: ReceiveRewardFailedNotification", data);
    window.dispatchEvent(
      new CustomEvent("rewardFailedNotification", { detail: data })
    );
  });

  connection.on("ReceiveNotification", (data) => {
    console.log("SignalR: ReceiveNotification", data);
  });

  connection.onclose(async (err) => {
    if (err?.message?.includes("401")) {
      const newToken = await tokenManager.ensureValidToken();
      await connectSignalR(currentAliasId!, newToken);
    }
  });

  connection.onreconnecting((err) => {
    console.warn("SignalR: Reconnecting...", err);
  });

  connection.onreconnected(() => {
    console.log("SignalR: Reconnected! Rejoining group...");
    if (currentAliasId) joinGroup(currentAliasId);
  });

  try {
    await connection.start();
    console.log("SignalR: Connected! Joining group...");
    currentAliasId = aliasId;
    await joinGroup(aliasId);
  } catch (err) {
    console.error("SignalR: Connection failed", err);
  }
};

const joinGroup = async (aliasId: string) => {
  if (!connection || connection.state !== "Connected") {
    console.warn("SignalR: Cannot join group - not connected");
    return;
  }
  try {
    await connection.invoke("JoinUserGroup", aliasId);
    console.log("SignalR: Joined group:", aliasId);
  } catch (err) {
    console.error("SignalR: JoinUserGroup failed", err);
  }
};

export const disconnectSignalR = () => {
  if (connection) {
    console.log("SignalR: Disconnecting...");
    connection.stop();
    connection = null;
    currentAliasId = null;
  }
};
