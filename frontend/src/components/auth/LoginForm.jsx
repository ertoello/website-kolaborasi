import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { User, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";

import Input from "../Input";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);


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
    <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-[#D7D7D7] ">
      <h2 className="text-[#145C75] text-3xl font-bold text-center mb-4 uppercase tracking-wide">
        Masuk ke Dunia Kolaborasi
      </h2>
      <p className="text-center text-[#525252] mb-4">
        Bergabunglah dengan komunitas inovatif untuk membangun masa depan
        digital!
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          icon={User}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          icon={Lock}
          type="password"
          placeholder="Kata Sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-[#145C75] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 rounded-lg bg-gradient-to-r from-[#3FA3CE] to-[#2B7A98] hover:from-[#2B7A98] hover:to-[#145C75] text-white font-bold text-md tracking-wide uppercase shadow-lg transition duration-300 transform hover:scale-102"
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
