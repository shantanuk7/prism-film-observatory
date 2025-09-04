import React, { useState } from "react";
import {
  ChevronDown,
  Plus,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Download,
  Upload,
  UserCircle,
  X,
  Film,
  FileText,
  Search, 
  Settings,
} from "lucide-react";
import Header from "../components/Header";

// A placeholder for the logo asset
const prismLogoUrl = '../src/assets/logo.png';

// MODAL: For creating a new observation
const NewObservationModal = ({ isOpen, onClose, selectedScene, sceneData }) => {
  const [formData, setFormData] = useState({
    content: "",
    categories: [],
    timestamp: "",
  });
  const categories = [
    "Cinematography",
    "Animation",
    "Symbolism",
    "Visual Storytelling",
    "Storytelling",
    "Character Development",
  ];
  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };
  const handleSubmit = () => {
    console.log("New observation:", formData);
    onClose();
    setFormData({ content: "", categories: [], timestamp: "" });
  };
  if (!isOpen) return null;
  const currentScene = sceneData[selectedScene] || {};
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 p-6 flex items-start justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            New Observation
          </h2>
          <p className="text-sm text-gray-600">
            Scene {selectedScene} • {currentScene.startTime} -{" "}
            {currentScene.endTime}
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Scene Context</h3>
              <p className="text-sm text-gray-700">
                {currentScene.description}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timestamp (optional)
              </label>
              <input
                type="text"
                value={formData.timestamp}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    timestamp: e.target.value,
                  }))
                }
                placeholder="e.g., 3:41, 00:03:41"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                Specify the exact moment your observation refers to.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Observation *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Share your observation about this scene..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {formData.content.length}/500
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories (select up to 3)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    disabled={
                      !formData.categories.includes(category) &&
                      formData.categories.length >= 3
                    }
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                      formData.categories.includes(category)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selected: {formData.categories.length}/3
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !formData.content.trim() || formData.categories.length === 0
            }
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Post Observation
          </button>
        </div>
      </div>
    </div>
  );
};

// MODAL: For uploading a new analysis PDF
const UploadAnalysisModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);
  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, file }));
    } else {
      console.error("Please upload a PDF file only.");
    }
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  const handleSubmit = () => {
    console.log("New analysis:", formData);
    onClose();
    setFormData({ title: "", description: "", file: null });
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upload Analysis
            </h2>
            <p className="text-sm text-gray-600">
              Share your comprehensive film analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Visual Storytelling in Taare Zameen Par"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="A brief summary of your analysis..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {formData.description.length}/300
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF File *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-red-600 font-semibold text-sm">
                        PDF
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({ ...prev, file: null }));
                      }}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF files only, up to 10MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    e.target.files && handleFileChange(e.target.files[0])
                  }
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !formData.title.trim() ||
              !formData.description.trim() ||
              !formData.file
            }
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            Upload Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

// COMPONENT: Renders a single Observation post
const ObservationPost = ({ observation }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 transition-shadow hover:shadow-md">
    <div className="flex items-start gap-4">
      <UserCircle className="text-gray-400 flex-shrink-0" size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900">
            {observation.username}
          </span>
          <span className="text-gray-500 text-sm font-light">
            • {observation.timeAgo}
          </span>
        </div>
        <p className="text-gray-800 mb-3 leading-relaxed">
          {observation.content}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {observation.categories.map((category) => (
            <span
              key={category}
              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-5 text-gray-500">
          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group">
            <ThumbsUp
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">{observation.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group">
            <MessageCircle
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">{observation.replies}</span>
          </button>
          <button className="hover:text-indigo-600 transition-colors group">
            <Bookmark
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
          <button className="hover:text-indigo-600 transition-colors group">
            <Share2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600 transition-colors ml-auto">
        <MoreHorizontal size={20} />
      </button>
    </div>
  </div>
);
// COMPONENT: Renders a single Analysis post
const AnalysisPost = ({ analysis }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 transition-shadow hover:shadow-md">
    <div className="flex items-start gap-4">
      <UserCircle className="text-gray-400 flex-shrink-0" size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900">
            {analysis.username}
          </span>
          <span className="text-gray-500 text-sm font-light">
            • {analysis.timeAgo}
          </span>
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {analysis.title}
        </h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {analysis.description}
        </p>
        <div className="bg-gray-50 border rounded-lg p-3 flex items-center justify-between mb-4">
          <div>
            <p className="font-medium text-gray-800">Complete Analysis</p>
            <span className="text-sm text-gray-500">
              PDF • {analysis.fileSize}
            </span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
        <div className="flex items-center gap-5 text-gray-500">
          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group">
            <ThumbsUp
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">{analysis.likes}</span>
          </button>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-500">
            {analysis.downloads} downloads
          </span>
          <button className="hover:text-indigo-600 transition-colors group ml-auto">
            <Bookmark
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
          <button className="hover:text-indigo-600 transition-colors group">
            <Share2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600 transition-colors">
        <MoreHorizontal size={20} />
      </button>
    </div>
  </div>
);

// MAIN PAGE COMPONENT
const MovieObservationsPage = () => {
  // State Management
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("observations"); // 'observations' or 'analysis'
  const [selectedScene, setSelectedScene] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Likes");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Demo user state
  const isRegistered =
    new URLSearchParams(window.location.search).get("registered") === "true";

  // --- MOCK DATA ---
  const sceneData = {
    1: {
      description:
        "Protagonist, Ishan, is introduced as a creative child struggling with academics and often misunderstood.",
      startTime: "00:03:41",
      endTime: "00:05:30",
      image1Url: "https://i.imgur.com/8z21mde.jpeg",
      image2Url: "https://i.imgur.com/GjN8yLg.jpeg",
    },
    2: {
      description:
        "Ishan struggles in the hostel, feeling isolated and homesick, reflected in the visual tone.",
      startTime: "00:15:10",
      endTime: "00:22:45",
      image1Url: "https://i.imgur.com/x0CgI0g.jpeg",
      image2Url: "https://i.imgur.com/j43z3jB.jpeg",
    },
    3: {
      description:
        "Art teacher, Ram, connects with Ishan, bringing color and hope back into his life.",
      startTime: "00:52:00",
      endTime: "01:00:15",
      image1Url: "https://i.imgur.com/2X8pB3V.jpeg",
      image2Url: "https://i.imgur.com/jFjF8vS.jpeg",
    },
    4: {
      description:
        "Ram explains dyslexia to Ishan's parents using visual aids and empathy.",
      startTime: "01:05:20",
      endTime: "01:10:40",
      image1Url: "https://i.imgur.com/b54u4wZ.jpeg",
      image2Url: "https://i.imgur.com/m2Xg5qX.jpeg",
    },
    5: {
      description:
        "Ishan's creative expression flourishes as he starts painting with renewed confidence.",
      startTime: "01:25:00",
      endTime: "01:32:00",
      image1Url: "https://i.imgur.com/vH9Yv9C.jpeg",
      image2Url: "https://i.imgur.com/A6j49a3.jpeg",
    },
    6: {
      description:
        "A heartfelt moment of reconciliation between Ishan and his father.",
      startTime: "01:40:00",
      endTime: "01:45:00",
      image1Url: "https://i.imgur.com/p1N3k8E.jpeg",
      image2Url: "https://i.imgur.com/r62s1wX.jpeg",
    },
    7: {
      description:
        "The climax: Ishan's painting wins first prize in the art competition.",
      startTime: "02:00:00",
      endTime: "02:05:00",
      image1Url: "https://i.imgur.com/gK9Q2fM.jpeg",
      image2Url: "https://i.imgur.com/W2h0e3c.jpeg",
    },
    8: {
      description:
        "Ram leaves the school, having fulfilled his purpose of guiding Ishan.",
      startTime: "02:10:00",
      endTime: "02:15:00",
      image1Url: "https://i.imgur.com/mKj3D5d.jpeg",
      image2Url: "https://i.imgur.com/s1K4dJ9.jpeg",
    },
    9: {
      description:
        "The final scene shows Ishan happy and confident, having found his true potential.",
      startTime: "02:18:00",
      endTime: "02:22:32",
      image1Url: "https://i.imgur.com/gN1rG4b.jpeg",
      image2Url: "https://i.imgur.com/E8Y4P0l.jpeg",
    },
  };
  const categories = [
    "All",
    "Cinematography",
    "Animation",
    "Symbolism",
    "Visual Storytelling",
    "Storytelling",
    "Character Development",
  ];
  const analysisData = [
    {
      id: 1,
      username: "filmcritic",
      timeAgo: "2 hours ago",
      title: "Complete Cinematographic Analysis of Taare Zameen Par",
      description:
        "An in-depth exploration of the visual storytelling techniques, camera movements, and lighting choices throughout the film.",
      fileSize: "2.4 MB",
      likes: 48,
      downloads: 156,
    },
    {
      id: 2,
      username: "academicfilmstudies",
      timeAgo: "1 day ago",
      title: "Narrative Structure and Character Development Study",
      description:
        "A comprehensive analysis of the three-act structure, character arcs, and thematic elements present in the film.",
      fileSize: "1.8 MB",
      likes: 32,
      downloads: 89,
    },
  ];
  const allObservations = [
    {
      id: 1,
      username: "shantanuk",
      timeAgo: "10 min ago",
      content:
        "3:41: Water body - symbolizing a space of comfort, an outlet of creative exploration throughout the film, for the protagonist (Ishan Awasthi).",
      likes: 24,
      replies: 5,
      categories: ["Cinematography", "Symbolism"],
      sceneId: 1,
    },
    {
      id: 2,
      username: "jamesg",
      timeAgo: "40 min ago",
      content:
        "5:23: Visually representing the story setup- Protagonist in the foreground, at a distance from rest of the pupils, signalling that he is different and in his own world.",
      likes: 18,
      replies: 3,
      categories: ["Visual Storytelling", "Cinematography"],
      sceneId: 1,
    },
    {
      id: 3,
      username: "cinemaphile",
      timeAgo: "1 day ago",
      content:
        "15:10: The use of low-key lighting and cool colors in the hostel scene creates a sense of isolation and coldness, reflecting Ishan's emotional state.",
      likes: 56,
      replies: 12,
      categories: ["Cinematography", "Visual Storytelling"],
      sceneId: 2,
    },
    {
      id: 4,
      username: "Aamirk",
      timeAgo: "5 min ago",
      content:
        "20:30: The scene where the teacher explains dyslexia using animation is a powerful and empathetic way to convey a complex topic to the audience.",
      likes: 35,
      replies: 7,
      categories: ["Animation", "Storytelling"],
      sceneId: 2,
    },
    {
      id: 5,
      username: "cinemaphile",
      timeAgo: "5 min ago",
      content:
        "52:00: The visual shift from dark, muted colors to a vibrant and bright palette as the art teacher enters Ishan's life symbolizes the change in his world.",
      likes: 62,
      replies: 20,
      categories: ["Cinematography", "Symbolism"],
      sceneId: 3,
    },
  ];
  // --- END MOCK DATA ---

  const handleSignIn = () => {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("registered", (!isRegistered).toString());
    window.history.pushState({}, "", newUrl);
    window.location.reload();
  };

  // Derived State with Search
  const filteredObservations = allObservations
    .filter((obs) => obs.sceneId === selectedScene)
    .filter(
      (obs) =>
        selectedCategory === "All" || obs.categories.includes(selectedCategory)
    )
    .filter((obs) =>
      obs.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Likes") return b.likes - a.likes;
      if (sortBy === "Replies") return b.replies - a.replies;
      if (sortBy === "Date Posted") return a.id - b.id;
      return 0;
    });

  const filteredAnalysisData = analysisData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentScene = sceneData[selectedScene] || {};

  return (
    <div className="bg-gray-100 text-gray-800 font-sans">

      <Header/>
      
      {/* Main layout container (below the fixed header) */}
      <div className="flex pt-16">
        {/* --- LEFT SIDEBAR (Fixed Position) --- */}
        <aside className="w-80 bg-white border-r border-gray-200 flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] z-10 hidden lg:flex">
          <nav className="flex-grow p-4 overflow-y-auto">
            <h3 className="px-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Scenes
            </h3>
            <ul>
              {Object.entries(sceneData).map(([sceneId, data]) => (
                <li key={sceneId}>
                  <button
                    onClick={() => setSelectedScene(Number(sceneId))}
                    className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-sm flex flex-col ${
                      selectedScene === Number(sceneId)
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">Scene {sceneId}</span>
                    <span
                      className={`transition-opacity duration-300 ${
                        selectedScene === Number(sceneId)
                          ? "opacity-70"
                          : "opacity-100"
                      }`}
                    >
                      {data.description.substring(0, 40)}...
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <a
              href="#"
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings size={16} /> Settings
            </a>
          </div>
        </aside>

        {/* --- MAIN CONTENT (Scrollable Area) --- */}
        <main className="flex-1 lg:ml-80 flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Taare Zameen Par (2007)
                </h1>
                <p className="text-sm text-gray-500">
                  Distribution: Official DVD Release | Runtime: 162m 32s
                </p>
              </div>

              {/* Toggles, Filters, and Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center bg-gray-200 p-1 rounded-lg">
                  <button
                    onClick={() => setCurrentPage("observations")}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                      currentPage === "observations"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Film className="inline-block mr-2 -mt-1" size={16} />{" "}
                    Observations
                  </button>
                  <button
                    onClick={() => setCurrentPage("analysis")}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                      currentPage === "analysis"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FileText className="inline-block mr-2 -mt-1" size={16} />{" "}
                    Analysis
                  </button>
                </div>
                {isRegistered && currentPage === "observations" && (
                  <button
                    onClick={() => setShowObservationModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} /> New Observation
                  </button>
                )}
                {isRegistered && currentPage === "analysis" && (
                  <button
                    onClick={() => setShowAnalysisModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    <Upload size={16} /> Upload Analysis
                  </button>
                )}
              </div>

              {/* Conditional Content */}
              {currentPage === "observations" ? (
                <div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Scene {selectedScene}: Context
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {currentScene.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-semibold text-gray-500">
                          START • {currentScene.startTime}
                        </span>
                        <img
                          src={currentScene.image1Url}
                          alt={`Scene ${selectedScene} Start`}
                          className="mt-1 w-full h-40 object-cover rounded-md border"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-500">
                          END • {currentScene.endTime}
                        </span>
                        <img
                          src={currentScene.image2Url}
                          alt={`Scene ${selectedScene} End`}
                          className="mt-1 w-full h-40 object-cover rounded-md border"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-600">
                        Category:
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {categories.map((cat) => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-600">
                        Sort By:
                      </label>
                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option>Likes</option>
                          <option>Date Posted</option>
                          <option>Replies</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                  {filteredObservations.length > 0 ? (
                    filteredObservations.map((obs) => (
                      <ObservationPost key={obs.id} observation={obs} />
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Search
                        size={40}
                        className="mx-auto mb-2 text-gray-400"
                      />{" "}
                      <h3 className="font-semibold">No results found</h3>{" "}
                      <p className="text-sm">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {filteredAnalysisData.length > 0 ? (
                    filteredAnalysisData.map((analysis) => (
                      <AnalysisPost key={analysis.id} analysis={analysis} />
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Search
                        size={40}
                        className="mx-auto mb-2 text-gray-400"
                      />{" "}
                      <h3 className="font-semibold">No results found</h3>{" "}
                      <p className="text-sm">
                        Try adjusting your search query.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <NewObservationModal
        isOpen={showObservationModal}
        onClose={() => setShowObservationModal(false)}
        selectedScene={selectedScene}
        sceneData={sceneData}
      />
      <UploadAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
      />
    </div>
  );
};

export default MovieObservationsPage;
