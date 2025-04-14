import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import "../index.css";

const PostCreation = ({ user }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("kolaborasi");
  const queryClient = useQueryClient();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "blockquote",
    "code-block",
    "link",
  ];

  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder: "Bagikan sesuatu yang menarik dan inspiratif...",
    modules,
    formats,
  });

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create post");
    },
  });

  const handlePostCreation = async () => {
    try {
      const rawHTML = quill?.root.innerHTML || "";
      const cleanHTML = DOMPurify.sanitize(rawHTML);
      const plainText = cleanHTML.replace(/<[^>]+>/g, "").trim();

      const postData = { content: cleanHTML, plainText, category };
      if (image) postData.image = await readFileAsDataURL(image);

      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };

  const resetForm = () => {
    if (quill) quill.setText("");
    setImage(null);
    setImagePreview(null);
    setCategory("kolaborasi");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!quill) return;
    // Tooltip manual (opsional)
    const tooltips = {
      bold: "Tebal",
      italic: "Miring",
      underline: "Garis bawah",
      strike: "Coret",
      link: "Tautan",
      "code-block": "Kode",
      blockquote: "Kutipan",
      clean: "Bersihkan",
    };
    const buttons = quillRef.current?.querySelectorAll("button, select");
    buttons?.forEach((btn) => {
      const className = Array.from(btn.classList).find((cls) =>
        cls.startsWith("ql-")
      );
      const key = className?.replace("ql-", "");
      if (key && tooltips[key]) {
        btn.setAttribute("aria-label", tooltips[key]);
      }
    });
  }, [quill]);

  return (
    <div className="bg-secondary rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="size-12 rounded-full"
        />
        <article className="mt-2 w-full max-w-[65vw] md:max-w-[35vw]">
          <label className="block mb-2 text-md font-bold text-gray-700">
            Kirim Postingan
          </label>
          <div className="rounded-xl overflow-hidden shadow-sm border border-gray-300 bg-white">
            <div
              ref={quillRef}
              className="custom-editor"
              style={{ minHeight: "55px" }}
            />
          </div>
        </article>
      </div>

      {user?.role === "admin" && (
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="kolaborasi">Kolaborasi</option>
            <option value="penting">Penting</option>
          </select>
        </div>
      )}

      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-info hover:text-info-dark cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
