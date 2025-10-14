import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";

const categories = [
  { icon: "📝", name: "General & Lifestyle", subcategories: ["Personal Development","Productivity & Time Management","Minimalism","Life Hacks","Wellness & Mental Health"] },
  { icon: "🌍", name: "Travel & Culture", subcategories: ["Travel Guides","Backpacking & Budget Travel","Cultural Experiences","Local Cuisine","Travel Photography"] },
  { icon: "🍳", name: "Food & Drink", subcategories: ["Recipes","Restaurant Reviews","Vegan & Vegetarian Living","Baking & Desserts","Wine & Spirits"] },
  { icon: "💼", name: "Business & Finance", subcategories: ["Entrepreneurship","Freelancing & Side Hustles","Marketing & Branding","Investing & Personal Finance","E-commerce & Dropshipping"] },
  { icon: "🧠", name: "Education & Learning", subcategories: ["Study Tips","Language Learning","Online Courses & MOOCs","Academic Research","Homeschooling"] },
  { icon: "💻", name: "Tech & Digital Life", subcategories: ["Software Reviews","Coding & Programming","AI & Machine Learning","Cybersecurity","Gadgets & Gear"] },
  { icon: "🎨", name: "Creative Arts", subcategories: ["Writing & Storytelling","Photography","Graphic Design","DIY & Crafts","Music & Performance"] },
  { icon: "🧘", name: "Health & Fitness", subcategories: ["Workout Routines","Nutrition & Diets","Yoga & Meditation","Health Conditions & Recovery","Sports & Athletics"] },
  { icon: "🏡", name: "Home & Living", subcategories: ["Interior Design","Gardening","Home Improvement","Sustainable Living","Parenting & Family Life"] },
  { icon: "🎮", name: "Entertainment & Media", subcategories: ["Movie & TV Reviews","Book Recommendations","Celebrity News","Gaming","Pop Culture Commentary"] },
  { icon: "🗳️", name: "Society & Opinion", subcategories: ["Politics & Current Events","Environmental Issues","Human Rights","Philosophy & Ethics","Social Commentary"] },
];

export default function EditBlog() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [allTags, setAllTags] = useState([]); // ✅ available tags list
  const [selectedTags, setSelectedTags] = useState([]); // ✅ selected tags

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, FontFamily],
    content: "",
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-2 border rounded",
        placeholder: "Edit your blog content here...",
      },
    },
  });

  // Fetch all tags for checkbox list
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tags");
        setAllTags(res.data);
      } catch (err) {
        console.error("Failed to load tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setTitle(res.data.title);

        const [main, sub] = res.data.category.split(" > ");
        setMainCategory(main);
        setSubCategory(sub || "");
        setContent(res.data.content);
        setExistingImage(res.data.image || null);
        setSelectedTags(res.data.tags?.map((t) => t._id) || []);

        if (editor) editor.commands.setContent(res.data.content);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        alert("Failed to load blog.");
      }
    };
    fetchBlog();
  }, [id, editor]);

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !mainCategory || !content) {
      alert("Please fill in all required fields");
      return;
    }

    const category = subCategory ? `${mainCategory} > ${subCategory}` : mainCategory;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(selectedTags));
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`http://localhost:5000/api/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog updated successfully!");
      navigate("/my-blogs");
    } catch (err) {
      console.error("Failed to update blog:", err);
      alert("Failed to update blog.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Main Category */}
        <select
          value={mainCategory}
          onChange={(e) => {
            setMainCategory(e.target.value);
            setSubCategory("");
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.name} value={`${c.icon} ${c.name}`}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        {/* Subcategory */}
        {mainCategory &&
          categories.find((c) => `${c.icon} ${c.name}` === mainCategory)
            ?.subcategories.length > 0 && (
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Subcategory</option>
              {categories
                .find((c) => `${c.icon} ${c.name}` === mainCategory)
                .subcategories.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
            </select>
          )}

        {/* Tags Section ✅ */}
        <div>
          <h2 className="font-semibold mb-2">Select Tags (1–5)</h2>
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <label
                key={tag._id}
                className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => handleTagToggle(tag._id)}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Existing Image */}
        <div className="flex flex-col gap-2">
          {existingImage ? (
            <img
              src={existingImage}
              alt="Blog"
              className="w-48 h-48 object-cover rounded"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center border rounded text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* New Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {/* Toolbar */}
        <div className="flex gap-2 flex-wrap mb-2">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">Bold</button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">Italic</button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded">Underline</button>
          <select onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()} className="border rounded px-2 py-1">
            <option value="">Font Family</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
          <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} className="w-10 h-8 p-0 border rounded"/>
        </div>

        <EditorContent editor={editor} />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}
