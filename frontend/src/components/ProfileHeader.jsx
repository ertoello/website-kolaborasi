import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

import {
  Camera,
  Clock,
  MapPin,
  UserCheck,
  UserPlus,
  X,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleGoToMessages = () => {
    navigate(`/messages/${userData._id}`);
  };

	const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
  });

	const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
		queryKey: ["connectionStatus", userData._id],
		queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
		enabled: !isOwnProfile,
	});

	const isConnected = userData.connections.some((connection) => connection === authUser._id);

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: removeConnection } = useMutation({
		mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
		onSuccess: () => {
			toast.success("Connection removed");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const getConnectionStatus = useMemo(() => {
		if (isConnected) return "connected";
		if (!isConnected) return "not_connected";
		return connectionStatus?.data?.status;
	}, [isConnected, connectionStatus]);

	const renderConnectionButton = () => {
    const baseClass =
      "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";

    // Jika role adalah "admin", tampilkan tombol disabled
    if (userData.role === "admin") {
      return (
        <div className={`${baseClass} bg-green-700 cursor-not-allowed`}>
          <UserCheck size={20} className="mr-2" />
          Terkoneksi Otomatis
        </div>
      );
    }

    switch (getConnectionStatus) {
      case "connected":
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className="mr-2" />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={() => removeConnection(userData._id)}
            >
              <X size={20} className="mr-2" />
              Remove Connection
            </button>
          </div>
        );
      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className="mr-2" />
            Pending
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => acceptRequest(connectionStatus.data.requestId)}
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.data.requestId)}
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
            >
              Reject
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={() => sendConnectionRequest(userData._id)}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            <UserPlus size={20} className="mr-2" />
            Connect
          </button>
        );
    }
  };

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

	return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2 bg-gray-100 shadow-2xl">
      {/* Bagian Kiri - Profile */}
      <div className="md:col-span-2 bg-white shadow-lg rounded-lg space-y-3 flex flex-col items-center">
        <div className="bg-white w-full">
          <div
            className="relative h-32 md:h-48 rounded-t-lg bg-contain bg-center bg-no-repeat bg-gray-200"
            style={{
              backgroundImage: `url('${
                editedData.bannerImg || userData.bannerImg || "/banner.png"
              }')`,
            }}
          >
            {isEditing && (
              <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
                <Camera size={20} />
                <input
                  type="file"
                  className="hidden"
                  name="bannerImg"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            )}
          </div>

          <div className="p-4">
            <div className="relative -mt-20 mb-4">
              <img
                className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover"
                src={
                  editedData.profilePicture ||
                  userData.profilePicture ||
                  "/avatar.png"
                }
                alt={userData.name}
              />

              {isEditing && (
                <label className="absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer">
                  <Camera size={20} />
                  <input
                    type="file"
                    className="hidden"
                    name="profilePicture"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            <div className="text-center mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name ?? userData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                  className="text-2xl font-bold mb-2 text-center w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={editedData.headline ?? userData.headline}
                  onChange={(e) =>
                    setEditedData({ ...editedData, headline: e.target.value })
                  }
                  className="text-gray-600 text-center w-full"
                />
              ) : (
                <p className="text-gray-600">{userData.headline}</p>
              )}

              <div className="flex justify-center items-center mt-2">
                <MapPin size={16} className="text-gray-500 mr-1" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.location ?? userData.location}
                    onChange={(e) =>
                      setEditedData({ ...editedData, location: e.target.value })
                    }
                    className="text-gray-600 text-center"
                  />
                ) : (
                  <span className="text-gray-600">{userData.location}</span>
                )}
              </div>
            </div>

            {isOwnProfile ? (
              isEditing ? (
                <button
                  className="w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300"
                  onClick={handleSave}
                >
                  Save Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300"
                >
                  Edit Profile
                </button>
              )
            ) : (
              <div className="flex justify-center">
                {renderConnectionButton()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bagian Kanan - Konten Tambahan */}
      <div className="md:col-span-1 bg-white shadow-lg rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">User Stats</h2>
        <div className="flex justify-between items-center p-3 border rounded-md shadow-sm">
          <span className="text-gray-600">Connections</span>
          <span className="font-semibold text-blue-500">
            {userData?.connections?.length ?? 0}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 border rounded-md shadow-sm">
          <span className="text-gray-600">Posts</span>
          <span className="font-semibold text-blue-500">
            {userData?.posts?.length ?? 0}
          </span>
        </div>
        {!isOwnProfile && (
          <button
            onClick={handleGoToMessages}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Chat dengan {userData.name}
          </button>
        )}
      </div>
    </div>
  );
};
export default ProfileHeader;
