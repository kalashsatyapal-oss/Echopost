import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import {FontSize} from "@tiptap/extension-text-style"; // We'll control fontSize via TextStyle

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

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, FontFamily],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-2 border rounded",
        placeholder: "Write your blog content here...",
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !mainCategory || !content) {
      alert("Please fill in all required fields");
      return;
    }

    const category = subCategory ? `${mainCategory} > ${subCategory}` : mainCategory;

    try {
      await axios.post(
        "http://localhost:5000/api/blogs",
        { title, category, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Blog published successfully!");
      setTimeout(() => {
        setTitle(""); setMainCategory(""); setSubCategory(""); setContent(""); editor.commands.setContent(""); setMessage("");
      }, 2000);
    } catch (err) {
      console.error("Failed to create blog:", err);
      alert("Error creating blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          onChange={(e) => { setMainCategory(e.target.value); setSubCategory(""); }}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.name} value={`${c.icon} ${c.name}`}>{c.icon} {c.name}</option>
          ))}
        </select>

        {/* Subcategory */}
        {mainCategory && categories.find(c => `${c.icon} ${c.name}` === mainCategory)?.subcategories.length > 0 && (
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Subcategory</option>
            {categories.find(c => `${c.icon} ${c.name}` === mainCategory).subcategories.map(sc => (
              <option key={sc} value={sc}>{sc}</option>
            ))}
          </select>
        )}

        {/* Rich Text Editor Toolbar */}
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
          <select onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()} className="border rounded px-2 py-1">
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

        <EditorContent editor={editor} />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Publish</button>
      </form>

      {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
    </div>
  );
}
