import { Link } from "react-router-dom";
import CommentsSection from "./CommentsSection.jsx";
import LikeButton from "./LikeButton.jsx";

export default function BlogItem({
  blog,
  isLiked,
  isAnimating,
  comments,
  commentCount,
  currentUserId,
  toggleLike,
  toggleComments,
  handleDelete,
  setNewCommentText,
  newCommentText,
  addComment,
  editingCommentId,
  startEditComment,
  saveEditComment,
  editCommentText,
  setEditCommentText,
  deleteComment,
}) {
  return (
    <div className="p-5 bg-white rounded-lg shadow hover:shadow-xl transition border flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          <Link to={`/blog/${blog._id}`} className="hover:text-blue-600">
            {blog.title}
          </Link>
        </h2>
        <p className="text-sm text-blue-600 font-medium mb-2">{blog.category || "Uncategorized"}</p>
        <p className="text-gray-700 line-clamp-3 mb-3" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          <LikeButton blog={blog} isLiked={isLiked} isAnimating={isAnimating} toggleLike={toggleLike} />
          <button onClick={() => toggleComments(blog._id)} className="text-gray-600 font-semibold">
            💬 {commentCount} Comments
          </button>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/edit-blog/${blog._id}`}
            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(blog._id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Inline comments */}
      {comments && comments.length >= 0 && (
        <CommentsSection
          blogId={blog._id}
          comments={comments}
          open={comments.length > 0}
          isOpen={true}
          currentUserId={currentUserId}
          newCommentText={newCommentText}
          setNewCommentText={setNewCommentText}
          addComment={addComment}
          editingCommentId={editingCommentId}
          startEditComment={startEditComment}
          saveEditComment={saveEditComment}
          editCommentText={editCommentText}
          setEditCommentText={setEditCommentText}
          deleteComment={deleteComment}
          isVisible={true}
        />
      )}
    </div>
  );
}