import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ username, password });
  };

  return (
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-[#D7D7D7]">
        <h2 className="text-[#145C75] text-3xl font-bold text-center mb-6 uppercase tracking-wide">
          Masuk ke Dunia Kolaborasi
        </h2>
        <p className="text-center text-[#525252] mb-6">
          Bergabunglah dengan komunitas inovatif untuk membangun masa depan
          digital!
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-4 focus:ring-[#66B2D6] border-[#A8A8A8] bg-[#F4F4F4] text-lg shadow-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-4 focus:ring-[#66B2D6] border-[#A8A8A8] bg-[#F4F4F4] text-lg shadow-md"
            required
          />
          <button
            type="submit"
            className="w-full p-4 rounded-xl bg-gradient-to-r from-[#3FA3CE] to-[#2B7A98] hover:from-[#2B7A98] hover:to-[#145C75] text-white font-extrabold text-lg tracking-wide uppercase shadow-lg transition duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <Loader className="size-6 animate-spin" />
            ) : (
              "Login Sekarang"
            )}
          </button>
        </form>
      </div>
  );
};

export default LoginForm;
