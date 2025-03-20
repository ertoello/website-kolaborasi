import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const useAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me"); // Pastikan backend punya endpoint ini
      return res.data;
    },
    staleTime: Infinity, // Cache tidak akan di-refresh otomatis
    cacheTime: Infinity, // Data tetap tersimpan di cache
    retry: false, // Jangan coba ulang jika gagal
  });
};

export default useAuthUser;
