import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { FontSize } from "@tiptap/extension-text-style";

const categories = [
  {
    icon: "📝",
    name: "General & Lifestyle",
    subcategories: [
      "Personal Development",
      "Productivity & Time Management",
      "Minimalism",
      "Life Hacks",
      "Wellness & Mental Health",
    ],
  },
  {
    icon: "🌍",
    name: "Travel & Culture",
    subcategories: [
      "Travel Guides",
      "Backpacking & Budget Travel",
      "Cultural Experiences",
      "Local Cuisine",
      "Travel Photography",
    ],
  },
  {
    icon: "🍳",
    name: "Food & Drink",
    subcategories: [
      "Recipes",
      "Restaurant Reviews",
      "Vegan & Vegetarian Living",
      "Baking & Desserts",
      "Wine & Spirits",
    ],
  },
  {
    icon: "💼",
    name: "Business & Finance",
    subcategories: [
      "Entrepreneurship",
      "Freelancing & Side Hustles",
      "Marketing & Branding",
      "Investing & Personal Finance",
      "E-commerce & Dropshipping",
    ],
  },
  {
    icon: "🧠",
    name: "Education & Learning",
    subcategories: [
      "Study Tips",
      "Language Learning",
      "Online Courses & MOOCs",
      "Academic Research",
      "Homeschooling",
    ],
  },
  {
    icon: "💻",
    name: "Tech & Digital Life",
    subcategories: [
      "Software Reviews",
      "Coding & Programming",
      "AI & Machine Learning",
      "Cybersecurity",
      "Gadgets & Gear",
    ],
  },
  {
    icon: "🎨",
    name: "Creative Arts",
    subcategories: [
      "Writing & Storytelling",
      "Photography",
      "Graphic Design",
      "DIY & Crafts",
      "Music & Performance",
    ],
  },
  {
    icon: "🧘",
    name: "Health & Fitness",
    subcategories: [
      "Workout Routines",
      "Nutrition & Diets",
      "Yoga & Meditation",
      "Health Conditions & Recovery",
      "Sports & Athletics",
    ],
  },
  {
    icon: "🏡",
    name: "Home & Living",
    subcategories: [
      "Interior Design",
      "Gardening",
      "Home Improvement",
      "Sustainable Living",
      "Parenting & Family Life",
    ],
  },
  {
    icon: "🎮",
    name: "Entertainment & Media",
    subcategories: [
      "Movie & TV Reviews",
      "Book Recommendations",
      "Celebrity News",
      "Gaming",
      "Pop Culture Commentary",
    ],
  },
  {
    icon: "🗳️",
    name: "Society & Opinion",
    subcategories: [
      "Politics & Current Events",
      "Environmental Issues",
      "Human Rights",
      "Philosophy & Ethics",
      "Social Commentary",
    ],
  },
];

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  // Fetch tags from backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tags");
        setTags(res.data);
      } catch (err) {
        console.error("Error fetching tags", err);
      }
    };
    fetchTags();
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, FontFamily],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-2 border rounded",
        placeholder: "Write your blog content here...",
      },
    },
  });

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else if (prev.length < 5) {
        return [...prev, tagId];
      } else {
        alert("You can select up to 5 tags only");
        return prev;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !mainCategory || !content) {
      alert("Please fill in all required fields");
      return;
    }
    if (selectedTags.length < 1) {
      alert("Please select at least 1 tag");
      return;
    }

    const category = subCategory
      ? `${mainCategory} > ${subCategory}`
      : mainCategory;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    if (image) formData.append("image", image);
    selectedTags.forEach((tagId) => formData.append("tags[]", tagId));

    try {
      await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Blog published successfully!");
      setTimeout(() => {
        setTitle("");
        setMainCategory("");
        setSubCategory("");
        setContent("");
        editor.commands.setContent("");
        setImage(null);
        setSelectedTags([]);
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Error creating blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded"
        />

        {/* Tag Selection */}
        <div className="border p-3 rounded">
          <h2 className="font-semibold mb-2">
            Select Tags (1–5 allowed):
          </h2>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <label
                key={tag._id}
                className={`flex items-center gap-2 border px-3 py-1 rounded cursor-pointer ${
                  selectedTags.includes(tag._id)
                    ? "bg-blue-100 border-blue-400"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => handleTagChange(tag._id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        {/* Editor Toolbar */}
        <div className="flex gap-2 flex-wrap mb-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="px-2 py-1 border rounded"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="px-2 py-1 border rounded"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="px-2 py-1 border rounded"
          >
            Underline
          </button>
          <select
            onChange={(e) =>
              editor.chain().focus().setFontFamily(e.target.value).run()
            }
            className="border rounded px-2 py-1"
          >
            <option value="">Font Family</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
          <input
            type="color"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="w-10 h-8 p-0 border rounded"
          />
          <select
            onChange={(e) =>
              editor.chain().focus().setFontSize(e.target.value).run()
            }
            className="border rounded px-2 py-1"
          >
            <option value="">Font Size</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="30px">30px</option>
          </select>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Publish
        </button>
      </form>

      {message && (
        <div className="mt-4 text-green-600 font-semibold">{message}</div>
      )}
    </div>
  );
}
