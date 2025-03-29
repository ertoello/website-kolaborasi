import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";

import Input from "../Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import PasswordStrengthMeter from "../PasswordStrengthMeter";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nik, setNik] = useState("");
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    try {
      signUpMutation({ name, username, email, password, nik });
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-1">
      <Input
        icon={User}
        type="text"
        placeholder="Nama Lengkap"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        icon={User}
        type="text"
        placeholder="NIK Kamu"
        value={nik}
        onChange={(e) => setNik(e.target.value)}
        required
      />

      <Input
        icon={User}
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        icon={Mail}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        icon={Lock}
        type="password"
        placeholder="Kata Sandi (6+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
      <PasswordStrengthMeter password={password} />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-2 rounded-lg bg-gradient-to-r from-[#3FA3CE] to-[#2B7A98] hover:from-[#2B7A98] hover:to-[#145C75] text-white font-bold text-md tracking-wide uppercase shadow-lg transition duration-300 transform hover:scale-102"
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
};
export default SignUpForm;
