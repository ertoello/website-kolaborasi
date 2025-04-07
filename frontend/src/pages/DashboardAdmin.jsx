import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const DashboardAdmin = () => {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    username: "",
    role: "",
  });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [confirmUserId, setConfirmUserId] = useState(null);

  // Fetch data users
  const { data: users, isLoading } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: () => axiosInstance.get("/messages/users"),
  });

  const confirmUser = useMutation({
    mutationFn: (userId) => axiosInstance.put(`/auth/users/${userId}/confirm`),
    onSuccess: () => {
      toast.success("User confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      setConfirmUserId(null);
    },
    onError: () => {
      toast.error("Failed to confirm user");
    },
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: (userId) => axiosInstance.delete(`/users/${userId}`),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  // Fungsi untuk mengonfirmasi penghapusan user
  const confirmDelete = () => {
    if (deleteUserId) {
      deleteUser.mutate(deleteUserId, {
        onSuccess: () => {
          setDeleteUserId(null); // Tutup modal setelah sukses
        },
      });
    }
  };

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: ({ userId, newData }) =>
      axiosInstance.put(`/users/${userId}`, newData),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      setEditingUser(null);
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const handleDelete = (userId) => {
    deleteUser.mutate(userId);
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditData({ name: user.name, username: user.username, role: user.role });
  };

  const handleSave = () => {
    updateUser.mutate({ userId: editingUser, newData: editData });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Manage Users
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.data?.map((user, index) => (
          <div key={user._id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold text-center mb-2">
              {editingUser === user._id ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border p-1"
                />
              ) : (
                user.name
              )}
            </h3>
            <img
              src={user.profilePicture || "/avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-3"
            />

            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="p-1 font-bold">ID</td>
                  <td className="p-1">{user._id}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-1 font-bold">NIK</td>
                  <td className="p-1">{user.nik}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-1 font-bold">Username</td>
                  <td className="p-1">
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        value={editData.username}
                        onChange={(e) =>
                          setEditData({ ...editData, username: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-1 font-bold">Email</td>
                  <td className="p-1">{user.email}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-1 font-bold">Verified</td>
                  <td className="p-1">{user.isVerified ? "Yes" : "No"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-1 font-bold">Verifikasi Akun</td>
                  <td className="p-1">{user.isApproved ? "Yes" : "No"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-1 font-bold">Last Login</td>
                  <td className="p-1">
                    {new Date(user.lastLogin).toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-1 font-bold">Jumlah Koneksi</td>
                  <td className="p-1">
                    {user.connections.length > 0 ? (
                      <span>{user.connections.length} Koneksi</span>
                    ) : (
                      <span className="text-gray-500">Belum Ada Koneksi</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-1 font-bold">Role</td>
                  <td className="p-1">
                    {editingUser === user._id ? (
                      <select
                        value={editData.role}
                        onChange={(e) =>
                          setEditData({ ...editData, role: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <div className="mt-2 text-left">
                        <span
                          className={`inline-block px-2 py-1 text-md rounded-md font-bold ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role || "Tidak Ada Role"}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Container khusus tombol dengan background */}
            <div className="bg-gray-100 rounded-lg shadow-md mt-2">
              {/* Baris pertama: Verifikasi */}
              <div className="flex justify-evenly items-center gap-2 p-1 bg-white rounded-md shadow-sm">
                {user.isApproved ? (
                  <span className="text-green-600 font-bold">
                    ✔ TERVERIFIKASI
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => setConfirmUserId(user._id)}
                      className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      ✔ Confirm
                    </button>
                    <button
                      onClick={() => setDeleteUserId(user._id)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      ✖ Tolak
                    </button>
                  </>
                )}
              </div>

              {/* Baris kedua: Edit dan Delete */}
              <div className="flex justify-evenly items-center gap-2 p-1 bg-white rounded-md shadow-sm mt-2">
                {editingUser === user._id ? (
                  <button
                    onClick={handleSave}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    💾 Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    ✏ Edit
                  </button>
                )}
                <button
                  onClick={() => setDeleteUserId(user._id)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* MODAL CONFIRMATION */}
      {confirmUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Akun</h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin mengonfirmasi user ini?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmUserId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmUser.mutate(confirmUserId);
                  setConfirmUserId(null); // Tutup modal setelah konfirmasi
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE CONFIRMATION */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus user ini?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
