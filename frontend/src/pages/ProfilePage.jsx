import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import UserPosts from "../components/UserPosts";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${username}`);
      return response.data;
    },
  });

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError,
  } = useQuery({
    queryKey: ["userPosts", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/user/${username}`);
      return response.data;
    },
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  if (isAuthLoading || isUserProfileLoading) {
    return <p>Loading profile...</p>;
  }

  if (!authUser || !userProfile) {
    return <p>Failed to load profile</p>;
  }

  const isOwnProfile = authUser?.username === userProfile?.username;
  const userData = isOwnProfile ? authUser : userProfile;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Profile Header di Tengah */}
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={updateProfile}
      />

      {/* Grid Layout untuk membagi halaman */}
      <div className="grid grid-cols-12 gap-4 mt-6 shadow-2xl">
        {/* Kolom Kiri - Posts */}
        <div className="col-span-8 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Posts</h2>
          {isPostsLoading && <p>Loading posts...</p>}
          {isError && <p>Failed to load posts</p>}
          {!posts || posts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            posts.map((post) => <UserPosts key={post._id} post={post} />)
          )}
        </div>

        {/* Kolom Kanan - About, Experience, Education, Skills */}
        <div className="col-span-4 bg-white p-4 rounded-lg shadow-2xl">
          <AboutSection
            userData={userData}
            isOwnProfile={isOwnProfile}
            onSave={updateProfile}
          />
          <ExperienceSection
            userData={userData}
            isOwnProfile={isOwnProfile}
            onSave={updateProfile}
          />
          <EducationSection
            userData={userData}
            isOwnProfile={isOwnProfile}
            onSave={updateProfile}
          />
          <SkillsSection
            userData={userData}
            isOwnProfile={isOwnProfile}
            onSave={updateProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
