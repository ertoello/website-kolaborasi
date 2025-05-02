import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? // ? "https://w3lc3pgc-5000.asse.devtunnels.ms/api/v1" // kalau lagi testing online (DevTunnel)
        "http://localhost:5000/api/v1" // atau ini kalau lokal
      : "https://website-kolaborasi-production.up.railway.app/api/v1",
  withCredentials: true,
});

