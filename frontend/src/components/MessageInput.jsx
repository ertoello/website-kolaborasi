import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import "../index.css";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const sanitizedText = DOMPurify.sanitize(text); // Sanitize Quill HTML
    const plainText = sanitizedText.replace(/<(.|\n)*?>/g, "").trim();

    if (!plainText && !imagePreview) return;

    try {
      await sendMessage({
        text: sanitizedText,
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    const tooltips = {
      bold: "Tebal: Membuat teks jadi tebal",
      italic: "Miring: Membuat teks miring",
      underline: "Garis bawah: Memberi garis bawah",
      strike: "Coret: Menandai teks dengan coretan",
      link: "Tautan: Menyisipkan hyperlink",
      "code-block": "Blok kode: Format teks seperti kode",
      blockquote: "Kutipan: Menyorot kutipan",
      clean: "Bersihkan: Menghapus semua format teks",
      list: "Nomor: Buat daftar bernomor",
      bullet: "Poin: Buat daftar dengan poin",
      "indent-1": "Geser kiri: Mengurangi indentasi",
      "indent+1": "Geser kanan: Menambah indentasi",
      align: "Rata: Mengatur perataan teks",
      background: "Warna latar: Ganti warna latar belakang teks",
      color: "Warna teks: Ganti warna teks",
      script: "Sub/Superscript: Format pangkat bawah/atas",
      font: "Font: Pilih jenis huruf",
      size: "Ukuran: Atur besar kecil huruf",
      header: "Judul: Atur level heading",
      direction: "Arah tulisan: Kanan ke kiri / kiri ke kanan",
    };

    const buttons = document.querySelectorAll(
      ".ql-toolbar button, .ql-toolbar select"
    );
    buttons.forEach((btn) => {
      const className = Array.from(btn.classList).find((cls) =>
        cls.startsWith("ql-")
      );
      if (className) {
        const key = className.replace("ql-", "");
        if (!btn.hasAttribute("aria-label") && tooltips[key]) {
          btn.setAttribute("aria-label", tooltips[key]);
        }
      }
    });
  }, []);

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-white"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <ReactQuill
            theme="snow"
            value={text}
            onChange={setText}
            className="bg-white rounded-md w-full custom-editor"
            placeholder="Type a message..."
            modules={{
              toolbar: {
                container: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }, { size: [] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ script: "sub" }, { script: "super" }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["blockquote", "code-block"],
                  ["link"],
                  ["clean"],
                ],
              },
              clipboard: {
                matchVisual: false,
              },
            }}
            formats={[
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
              "bullet",
              "blockquote",
              "code-block",
              "link",
              "clean",
            ]}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
