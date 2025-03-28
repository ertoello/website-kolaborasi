import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import VerifiedUsers from "../components/VerifiedUsers";

const HomePage = () => {
  const [page, setPage] = useState(1); // State untuk halaman saat ini
  const limit = 7; // Jumlah pengguna per halaman

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
    initialData: null,
  });

  // Ambil daftar pengguna hanya jika username adalah 'pengurusdesa'
  const { data: allUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get("/messages/users");
      return response.data;
    },
    enabled: authUser?.username === "pengurusdesa", // Hanya fetch data jika username cocok
  });

  const { data: recommendedData } = useQuery({
    queryKey: ["recommendedUsers", page], // Query akan diperbarui setiap kali `page` berubah
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/users/suggestions?page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  const recommendedUsers = recommendedData?.users || [];
  const totalPages = recommendedData?.totalPages || 1; // Ambil total halaman dari API

  console.log("posts", posts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />

        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No Posts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>

      {recommendedUsers?.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUsers.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}

            <div className="flex justify-center mt-6 gap-x-1">
              <button
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  page === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                ← Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 text-sm rounded-md transition-all shadow-sm ${
                    page === index + 1
                      ? "bg-blue-700 text-white font-semibold"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  page === totalPages
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
      <VerifiedUsers authUser={authUser} allUsers={allUsers} />
    </div>
  );
};
export default HomePage;
