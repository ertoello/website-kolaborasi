export default function SidebarStats({ user }) {
  return (
    <div className="border-t border-base-100 p-4 text-center">
      <h3 className="text-lg font-semibold">Your Stats</h3>
      <div className="grid grid-cols-3 gap-3 mt-2">
        <div className="text-center">
          <p className="text-xl font-bold">{user.posts}</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{user.followers}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{user.views}</p>
          <p className="text-xs text-gray-500">Views</p>
        </div>
      </div>
    </div>
  );
}
