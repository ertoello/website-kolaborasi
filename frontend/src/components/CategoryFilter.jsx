import React from "react";

const CategoryFilter = ({
  category,
  setCategory,
  unreadCounts,
  markCategoryAsRead,
}) => {
  return (
    <div className="flex justify-start gap-4 mb-4">
      <button
        onClick={() => setCategory("all")}
        className={`px-4 py-2 rounded ${
          category === "all"
            ? "bg-[#3FA3CE] text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        Semua
      </button>

      <button
        onClick={async () => {
          await markCategoryAsRead("penting");
          setCategory("penting");
        }}
        className={`relative px-4 py-2 rounded flex items-center gap-2 ${
          category === "penting"
            ? "bg-[#3FA3CE] text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        Info Dari Admin
        {unreadCounts?.penting > 0 && (
          <span className="ml-1 inline-flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full w-5 h-5">
            {unreadCounts.penting}
          </span>
        )}
      </button>
    </div>
  );
};

export default CategoryFilter;
