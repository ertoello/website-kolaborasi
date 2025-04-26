import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import Messages from "./pages/Messages";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import WaitingApprovalPage from "./pages/WaitingApprovalPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardAdmin from "./pages/DashboardAdmin";
import MessagesProfil from "./pages/MessagesProfil";

import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import { SocketProvider } from "./SocketProvider";

// Import Context Loading
import { LoadingProvider, useLoading } from "./components/loading/LoadingContext";
import LoadingModal from "./components/loading/LoadingModal";
import {Footer} from "./components/dashboard";

function AppContent() {
  const { showLoading, hideLoading } = useLoading();
  const location = useLocation();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response?.data?.message || "Something went wrong");
        return null;
      }
    },
  });

  // Tampilkan loading saat berpindah halaman
  useEffect(() => {
    showLoading();
    const timer = setTimeout(() => hideLoading(), 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) return <LoadingModal />;

  return (
    <SocketProvider userId={authUser?._id}>
      <Layout>
        <LoadingModal />
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={!authUser ? <DashboardPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/waiting-approval" element={<WaitingApprovalPage />} />
          <Route
            path="/forgot-password"
            element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />}
          />
          <Route
            path="/reset-password/:token"
            element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={
              authUser ? <NotificationsPage /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/network"
            element={authUser ? <NetworkPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/post/:postId"
            element={authUser ? <PostPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/messages"
            element={authUser ? <Messages /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/messages/:id"
            element={authUser ? <MessagesProfil /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboardadmin"
            element={
              authUser?.role === "admin" ? (
                <DashboardAdmin />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
        </Routes>
        <Toaster />
      </Layout>
      {/* Footer tanpa padding dari container utama */}
      <div className="w-full mt-6">
        <Footer />
      </div>
    </SocketProvider>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;
