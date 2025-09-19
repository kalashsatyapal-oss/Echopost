import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/authSlice";

export default function Settings() {
  const { user, loading } = useSelector(s => s.auth);
  const [name, setName] = useState(user?.name || "");
  const [preview, setPreview] = useState(user?.profileImage || null);
  const [fileError, setFileError] = useState(null);
  const dispatch = useDispatch();

  // convert file to base64 data url
  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

  const handleFile = async (e) => {
    setFileError(null);
    const file = e.target.files[0];
    if (!file) return;
    // small validation
    if (!file.type.startsWith("image/")) {
      setFileError("Please upload an image file");
      return;
    }
    if (file.size > 2_000_000) {
      setFileError("Image too large (max 2MB)");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setPreview(dataUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name };
      if (preview !== user?.profileImage) payload.profileImage = preview; // can be null or dataUrl
      const res = await dispatch(updateUser(payload));
      if (res.error) {
        alert(res.error.message || "Update failed");
        return;
      }
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleClearImage = () => {
    setPreview(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mt-1" />
          </div>

          <div>
            <label className="block text-xs text-gray-600">Profile image (optional)</label>
            <div className="flex items-center gap-3 mt-2">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="preview" className="w-20 h-20 rounded object-cover" />
                  <button type="button" onClick={handleClearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-sm text-gray-400">No image</div>
              )}

              <div>
                <input type="file" accept="image/*" onChange={handleFile} />
                {fileError && <div className="text-xs text-red-500 mt-1">{fileError}</div>}
                <div className="text-xs text-gray-500 mt-2">Max 2MB. Will be saved as base64 (dev-friendly).</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => { setName(user?.name || ""); setPreview(user?.profileImage || null); }} className="px-4 py-2 border rounded">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
