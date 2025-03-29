const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-[#3FA3CE]" /> {/* Biru Muda */}
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-[#ffffff] bg-opacity-50 rounded-lg border border-[#525252] 
				focus:border-[#EF8B8B] focus:ring-2 focus:ring-[#EF8B8B] text-gray-800 placeholder-[#A8A8A8] transition duration-200"
      />
    </div>
  );
};

export default Input;
