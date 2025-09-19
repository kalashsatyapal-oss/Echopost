import { useSelector } from "react-redux";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center gap-4">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
              {user?.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-lg font-semibold">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
            <div className="mt-1 text-xs text-gray-400">{user?.role}</div>
          </div>
        </div>

        <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600">Name</label>
            <input className="w-full p-2 border rounded mt-1" value={user?.name || ""} readOnly />
          </div>

          <div>
            <label className="text-xs text-gray-600">Email</label>
            <input className="w-full p-2 border rounded mt-1" value={user?.email || ""} readOnly />
          </div>

          <div>
            <label className="text-xs text-gray-600">Role</label>
            <input className="w-full p-2 border rounded mt-1" value={user?.role || ""} readOnly />
          </div>

          <div>
            <label className="text-xs text-gray-600">Joined</label>
            <input className="w-full p-2 border rounded mt-1" value={user?.createdAt ? new Date(user.createdAt).toLocaleString() : ""} readOnly />
          </div>
        </form>
      </div>
    </div>
  );
}
