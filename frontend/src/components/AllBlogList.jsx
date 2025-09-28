import { Link } from "react-router-dom";

export default function AllBlogList({ blogs }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {blogs.length > 0 ? (
        blogs.map((b) => (
          <div
            key={b._id}
            className="p-5 bg-white rounded-lg shadow hover:shadow-xl transition border"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              <Link to={`/blog/${b._id}`} className="hover:text-blue-600">
                {b.title}
              </Link>
            </h2>
            <p className="text-sm text-blue-600 font-medium mb-2">
              {b.category || "Uncategorized"}
            </p>
            <p
              className="text-gray-700 line-clamp-3 mb-3"
              dangerouslySetInnerHTML={{ __html: b.content }}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>👍 {b.likes?.length || 0} Likes</span>
              <span>💬 {b.comments?.length || 0} Comments</span>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-lg shadow-inner">
          No blogs found. Start by creating one!
        </div>
      )}
    </div>
  );
}
