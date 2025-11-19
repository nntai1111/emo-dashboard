import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Edit2,
  Settings,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Smile,
} from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import Feed from "./Feed";
import RenameAliasModal from "../molecules/RenameAliasModal";
import { postService } from "../../services/postService";
import MoodInsights from "../../pages/MoodInsights.jsx";

const DesktopProfile = ({ onNavigateToChat }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const [error, setError] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [currentAlias, setCurrentAlias] = useState("");

  // Lấy auth_user từ localStorage
  const [auth_user, setAuthUser] = useState(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to parse auth_user from localStorage", error);
      return null;
    }
  });

  // Listen for auth changes to refresh local user info
  useEffect(() => {
    const onAuthChanged = () => {
      try {
        const stored = localStorage.getItem("auth_user");
        const parsed = stored ? JSON.parse(stored) : null;
        setAuthUser(parsed);
        if (parsed?.aliasLabel) setCurrentAlias(parsed.aliasLabel);
      } catch {
        setAuthUser(null);
      }
    };
    window.addEventListener("app:auth-changed", onAuthChanged);
    return () => window.removeEventListener("app:auth-changed", onAuthChanged);
  }, []);

  // Update currentAlias when auth_user changes
  useEffect(() => {
    if (auth_user?.aliasLabel) {
      setCurrentAlias(auth_user.aliasLabel);
    }
  }, [auth_user]);

  // Handle successful rename
  const handleRenameSuccess = (newAlias) => {
    // Force re-render by updating the component state
    setCurrentAlias(newAlias);
    // The localStorage is already updated in the modal
    // We can also trigger a page refresh or update Redux store if needed
    // Removed full page reload; UI is updated via state/localStorage
  };

  // Tạo object user để hiển thị
  const user = useMemo(() => {
    if (!auth_user) return null;

    const displayName = auth_user.aliasLabel || auth_user.fullName || auth_user.username || "Anonymous";
    const joinedAt = auth_user.aliasCreatedAt
      ? new Date(auth_user.aliasCreatedAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "Không xác định";

    return {
      id: auth_user.id || auth_user.aliasId,
      name: displayName,
      // username: auth_user.aliasLabel ? `@${auth_user.aliasLabel.split("#")[0].trim()}` : `@user`,
      // bio: auth_user.bio || "No bio yet.",
      avatar: auth_user.avatarUrl && auth_user.avatarUrl !== "" ? auth_user.avatarUrl : undefined,
      location: auth_user.location || "",
      website: auth_user.website || "",
      joinDate: joinedAt,
      stats: {
        posts: auth_user.postsCount || 0,
        // followers: auth_user.followers || 0,
        // following: auth_user.followings || 0,
        likes: auth_user.reactionReceivedCount || 0,
        likesGiven: auth_user.reactionGivenCount || 0,
      },
    };
  }, [auth_user]);

  // Lấy posts của user từ API
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!auth_user?.aliasId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await postService.getPostsByAliasIds([auth_user.aliasId], 1, 20);
        const posts = response.posts?.data || [];

        // Transform posts để phù hợp với Feed component
        const transformedPosts = posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: {
            id: post.author.aliasId,
            username: post.author.displayName,
            avatar: post.author.avatarUrl,
            isOnline: false,
          },
          createdAt: post.publishedAt,
          editedAt: post.editedAt,
          likesCount: post.reactionCount,
          commentCount: post.commentCount,
          commentsCount: post.commentCount,
          liked: post.isReactedByCurrentUser,
          comments: [],
          images: post.medias || [],
          hasMedia: post.hasMedia,
          viewCount: post.viewCount,
          visibility: post.visibility,
          categoryTagIds: post.categoryTagIds || [],
          emotionTagIds: post.emotionTagIds || [],
        }));

        setUserPosts(transformedPosts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError(t("profile.loadingPosts"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [auth_user?.aliasId]);

  // Fetch liked posts when likes tab is active
  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!auth_user?.aliasId || activeTab !== "likes") return;

      setLoadingLiked(true);
      setError(null);

      try {
        const response = await postService.getReactedPosts(auth_user.aliasId, 1, 20, "Like", true);
        const posts = response.posts?.data || [];

        // Transform posts để phù hợp với Feed component
        const transformedPosts = posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: {
            id: post.author.aliasId,
            username: post.author.displayName,
            avatar: post.author.avatarUrl,
            isOnline: false,
          },
          createdAt: post.publishedAt,
          editedAt: post.editedAt,
          likesCount: post.reactionCount,
          commentCount: post.commentCount,
          commentsCount: post.commentCount,
          liked: post.isReactedByCurrentUser,
          comments: [],
          images: post.medias || [],
          hasMedia: post.hasMedia,
          viewCount: post.viewCount,
          visibility: post.visibility,
          categoryTagIds: post.categoryTagIds || [],
          emotionTagIds: post.emotionTagIds || [],
        }));

        setLikedPosts(transformedPosts);
      } catch (err) {
        console.error("Error fetching liked posts:", err);
        setError("Failed to load liked posts");
      } finally {
        setLoadingLiked(false);
      }
    };

    fetchLikedPosts();
  }, [auth_user?.aliasId, activeTab]);

  const tabs = [

    { id: "posts", label: t("profile.posts"), icon: MessageCircle },
    { id: "likes", label: t("profile.likes"), icon: Heart },
    { id: "mood", label: "Cảm xúc", icon: Smile },

    // { id: "followers", label: t("profile.followers"), icon: Users },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t("profile.noUserData")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 relative mb-8">
          <div className="absolute inset-0 bg-black/20"></div>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 dark:text-white hover:bg-white/20"
            onClick={() => setShowRenameModal(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {t("profile.edit")}
          </Button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-16 mb-4">
            <div className="relative">
              <Avatar
                src={user.avatar}
                username={user.name}
                size="xl"
                rounded={false}
                className=" border-2 border-white dark:border-gray-800"
              />
              {/* <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => alert("Change avatar")}
              >
                <Edit2 className="w-3 h-3" />
              </Button> */}
            </div>
            {/* <div className="flex space-x-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button>
                <LinkIcon className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div> */}
          </div>

          {/* User Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <button
                onClick={() => setShowRenameModal(true)}
                className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title={t("profile.changeName")}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-3">{user.username}</p>

            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 mb-4">
              {user.bio}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {user.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center space-x-1">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{t("profile.joined")} {user.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 mb-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">{user.stats.posts}</div>
              <div className="text-gray-500 dark:text-gray-400">{t("profile.posts")}</div>
            </div>
            {/* <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">{user.stats.followers}</div>
              <div className="text-gray-500 dark:text-gray-400">{t("profile.followers")}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">{user.stats.following}</div>
              <div className="text-gray-500 dark:text-gray-400">{t("profile.followers")}</div>
            </div> */}
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">{user.stats.likes}</div>
              <div className="text-gray-500 dark:text-gray-400">{t("profile.likesReceived")}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">{user.stats.likesGiven}</div>
              <div className="text-gray-500 dark:text-gray-400">{t("profile.likesGiven")}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "posts" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 mt-2">{t("profile.loadingPosts")}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      {t("profile.tryAgain")}
                    </button>
                  </div>
                ) : userPosts.length > 0 ? (
                  <Feed
                    posts={userPosts}
                    onNavigateToChat={onNavigateToChat}
                    selectedTab="mine"
                  />
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t("profile.noPostsYet")}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("profile.noPostsDesc")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "likes" && (
              <div className="space-y-6">
                {loadingLiked ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 mt-2">{t("profile.loadingPosts")}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      {t("profile.tryAgain")}
                    </button>
                  </div>
                ) : likedPosts.length > 0 ? (
                  <Feed
                    posts={likedPosts}
                    onNavigateToChat={onNavigateToChat}
                    selectedTab="liked"
                  />
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t("profile.likedPosts")}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("profile.likedPostsDesc")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "mood" && (
              <div className="space-y-6">
                <MoodInsights title="Nhật ký cảm xúc" showLegend={true} />
              </div>
            )}

            {/* {activeTab === "followers" && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t("profile.followers")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("profile.followersDesc")}
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Rename Alias Modal */}
      <RenameAliasModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        currentAlias={currentAlias}
        onSuccess={handleRenameSuccess}
      />
    </div>
  );
};

export default DesktopProfile;