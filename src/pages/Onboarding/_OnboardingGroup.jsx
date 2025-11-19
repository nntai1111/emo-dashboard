import React from "react";
import Onboarding from "./Onboarding";
import OnboardFirst from "./OnboardFirst";
import OnboardSecond from "./OnboardSecond";
import OnboardThree from "./OnboardThree";

export default function OnboardingGroup({ page }) {
  switch (page) {
    case "first":
      return <OnboardFirst onNext={() => {}} />;
    case "second":
      return <OnboardSecond onNext={() => {}} />;
    case "three":
      return <OnboardThree />;
    default:
      return <Onboarding />;
  }
}
