export default function RecentActivities({ user }) {
  return (
    <div className="border-t border-base-100 p-4">
      <h3 className="text-lg font-semibold">Recent Activities</h3>
      <ul className="mt-2 space-y-2">
        {(user.activities || []).slice(0, 3).map((activity, index) => (
          <li key={index} className="text-sm text-gray-600">
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}
