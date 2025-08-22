import React, { useState } from 'react';
import { ChevronDown, Plus, ThumbsUp, MessageCircle, Bookmark, Share2, MoreHorizontal, Download, Upload, UserCircle, X } from 'lucide-react';

// New Observation Modal Component
export const NewObservationModal = ({ isOpen, onClose, selectedScene, sceneData }) => {
  const [formData, setFormData] = useState({
    content: '',
    categories: [],
    timestamp: ''
  });

  const categories = ['Cinematography', 'Animation', 'Symbolism', 'Visual Storytelling', 'Storytelling', 'Character Development'];

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = () => {
    // Here you would typically submit the data
    console.log('New observation:', formData);
    onClose();
    // Reset form
    setFormData({ content: '', categories: [], timestamp: '' });
  };

  if (!isOpen) return null;

  const currentScene = sceneData[selectedScene] || {};

  return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">New Observation</h2>
            <p className="text-sm text-gray-600">Scene {selectedScene} • {currentScene.startTime} - {currentScene.endTime}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Scene Context */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Scene Context</h3>
              <p className="text-sm text-gray-700">{currentScene.description}</p>
            </div>

            {/* Timestamp Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timestamp (optional)
              </label>
              <input
                type="text"
                value={formData.timestamp}
                onChange={(e) => setFormData(prev => ({ ...prev, timestamp: e.target.value }))}
                placeholder="e.g., 3:41, 00:03:41"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Specify the exact moment your observation refers to</p>
            </div>

            {/* Observation Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Observation *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your observation about this scene..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.content.length}/500 characters</p>
            </div>

            {/* Categories */}
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
                    disabled={!formData.categories.includes(category) && formData.categories.length >= 3}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.categories.includes(category)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {formData.categories.length}/3
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.content.trim() || formData.categories.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Post Observation
          </button>
        </div>
      </div>
    </div>
  );
};

// Upload Analysis Modal Component
export const UploadAnalysisModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null
  });
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file) => {
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, file }));
    } else {
      alert('Please upload a PDF file only.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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
    // Here you would typically submit the data
    console.log('New analysis:', formData);
    onClose();
    // Reset form
    setFormData({ title: '', description: '', file: null });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upload Analysis</h2>
            <p className="text-sm text-gray-600">Share your comprehensive film analysis</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Visual Storytelling Techniques in Taare Zameen Par"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide a brief description of your analysis..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/300 characters</p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF File *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formData.file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-red-600 font-semibold text-sm">PDF</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, file: null }))}
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
                        <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF files only, up to 10MB</p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Upload Guidelines</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• PDF files only, maximum size 10MB</li>
                <li>• Analysis should be original and well-researched</li>
                <li>• Include proper citations for any references</li>
                <li>• Focus on specific aspects like cinematography, narrative, etc.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.description.trim() || !formData.file}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            Upload Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

const MovieObservationsPage = () => {

  // Modal state
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Check URL params for user type (defaulting to unregistered for demo)
  const urlParams = new URLSearchParams(window.location.search);
  const isRegistered = urlParams.get('registered') === 'true';

  const [currentPage, setCurrentPage] = useState('observations');
  const [selectedScene, setSelectedScene] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Likes');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Data for all scenes, including images and other details
  const sceneData = {
    1: {
      description: 'The protagonist, Ishan Awasthi, is introduced as a creative and imaginative child who struggles with academics and is often misunderstood.',
      startTime: '00:03:41',
      endTime: '00:05:30',
      image1Url: './src/assets/tzp-1.png',
      image2Url: './src/assets/tzp-2.png',
    },
    2: {
      description: 'This scene shows Ishan struggling in the hostel, feeling isolated and homesick, which is reflected in the visual tone of the film.',
      startTime: '00:15:10',
      endTime: '00:22:45',
      image1Url: 'https://i.imgur.com/x0CgI0g.jpeg',
      image2Url: 'https://i.imgur.com/j43z3jB.jpeg',
    },
    3: {
      description: 'The art teacher, Ram Shankar Nikumbh, is introduced and begins to connect with Ishan, bringing color and hope back into his life.',
      startTime: '00:52:00',
      endTime: '01:00:15',
      image1Url: 'https://i.imgur.com/2X8pB3V.jpeg',
      image2Url: 'https://i.imgur.com/jFjF8vS.jpeg',
    },
    4: {
      description: 'Ram Nikumbh explains dyslexia to Ishan\'s parents using visual aids and empathy, helping them understand their son\'s condition.',
      startTime: '01:05:20',
      endTime: '01:10:40',
      image1Url: 'https://i.imgur.com/b54u4wZ.jpeg',
      image2Url: 'https://i.imgur.com/m2Xg5qX.jpeg',
    },
    5: {
      description: 'Ishan\'s creative expression begins to flourish as he starts painting and participating in school activities with renewed confidence.',
      startTime: '01:25:00',
      endTime: '01:32:00',
      image1Url: 'https://i.imgur.com/vH9Yv9C.jpeg',
      image2Url: 'https://i.imgur.com/A6j49a3.jpeg',
    },
    6: {
      description: 'A pivotal moment where Ishan and his father share a heartfelt moment of reconciliation, with his father finally accepting his son for who he is.',
      startTime: '01:40:00',
      endTime: '01:45:00',
      image1Url: 'https://i.imgur.com/p1N3k8E.jpeg',
      image2Url: 'https://i.imgur.com/r62s1wX.jpeg',
    },
    7: {
      description: 'The film\'s climax, the art competition, where Ishan\'s painting wins first prize and is celebrated by the entire school.',
      startTime: '02:00:00',
      endTime: '02:05:00',
      image1Url: 'https://i.imgur.com/gK9Q2fM.jpeg',
      image2Url: 'https://i.imgur.com/W2h0e3c.jpeg',
    },
    8: {
      description: 'Ram Nikumbh leaves the school, having fulfilled his purpose of guiding Ishan towards self-realization.',
      startTime: '02:10:00',
      endTime: '02:15:00',
      image1Url: 'https://i.imgur.com/mKj3D5d.jpeg',
      image2Url: 'https://i.imgur.com/s1K4dJ9.jpeg',
    },
    9: {
      description: 'The final scene where Ishan is shown happy and confident, having overcome his struggles and found his true potential.',
      startTime: '02:18:00',
      endTime: '02:22:32',
      image1Url: 'https://i.imgur.com/gN1rG4b.jpeg',
      image2Url: 'https://i.imgur.com/E8Y4P0l.jpeg',
    },
  };

  const scenes = Array.from({ length: 9 }, (_, i) => i + 1);
  const categories = ['All', 'Cinematography', 'Animation', 'Symbolism', 'Visual Storytelling', 'Storytelling', 'Character Development'];

  const analysisData = [
    {
      id: 1,
      username: 'filmcritic',
      timeAgo: '2 hours ago',
      title: 'Complete Cinematographic Analysis of Taare Zameen Par',
      description: 'An in-depth exploration of the visual storytelling techniques, camera movements, and lighting choices throughout the film.',
      fileSize: '2.4 MB',
      likes: 48,
      downloads: 156
    },
    {
      id: 2,
      username: 'academicfilmstudies',
      timeAgo: '1 day ago',
      title: 'Narrative Structure and Character Development Study',
      description: 'A comprehensive analysis of the three-act structure, character arcs, and thematic elements present in the film.',
      fileSize: '1.8 MB',
      likes: 32,
      downloads: 89
    }
  ];

  const allObservations = [
    {
      id: 1,
      username: 'shantanuk',
      timeAgo: '10 min ago',
      content: '3:41: Water body - symbolizing a space of comfort, an outlet of creative exploration throughout the film, for the protagonist (Ishan Awasthi).',
      likes: 24,
      replies: 5,
      categories: ['Cinematography', 'Symbolism'],
      sceneId: 1
    },
    {
      id: 2,
      username: 'jamesg',
      timeAgo: '40 min ago',
      content: '5:23: Visually representing the story setup- Protagonist in the foreground, sitting at a distance from rest of the pupils who are shown playing together in the background, signalling that the protagonist is different from rest of the crowd, and in his own world of thoughts.',
      likes: 18,
      replies: 3,
      categories: ['Visual Storytelling', 'Cinematography'],
      sceneId: 1
    },
    {
      id: 3,
      username: 'cinemaphile',
      timeAgo: '1 day ago',
      content: '15:10: The use of low-key lighting and cool colors in the hostel scene creates a sense of isolation and coldness, reflecting Ishan\'s emotional state.',
      likes: 56,
      replies: 12,
      categories: ['Cinematography', 'Visual Storytelling'],
      sceneId: 2
    },
    {
      id: 4,
      username: 'Aamirk',
      timeAgo: '5 min ago',
      content: '20:30: The scene where the teacher explains dyslexia using animation is a powerful and empathetic way to convey a complex topic to the audience.',
      likes: 35,
      replies: 7,
      categories: ['Animation', 'Storytelling'],
      sceneId: 2
    },
    {
      id: 5,
      username: 'cinemaphile',
      timeAgo: '5 min ago',
      content: '52:00: The visual shift from dark, muted colors to a vibrant and bright palette as the art teacher enters Ishan\'s life symbolizes the change in his world.',
      likes: 62,
      replies: 20,
      categories: ['Cinematography', 'Symbolism'],
      sceneId: 3
    }
  ];

  const handleSignIn = () => {
    // Demo: Toggle between registered/unregistered
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('registered', (!isRegistered).toString());
    window.history.pushState({}, '', newUrl);
    window.location.reload();
  };

  const AnalysisPost = ({ analysis }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">{analysis.username}</span>
            <span className="text-gray-500 text-sm">{analysis.timeAgo}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{analysis.title}</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">{analysis.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">PDF • {analysis.fileSize}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              <Download size={16} />
              <span className="text-sm">Download</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <ThumbsUp size={16} />
              <span className="text-sm">{analysis.likes}</span>
            </button>
            <span className="text-sm text-gray-500">{analysis.downloads} downloads</span>
            <button className="hover:text-blue-600 transition-colors">
              <Bookmark size={16} />
            </button>
            <button className="hover:text-blue-600 transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );

  const ObservationPost = ({ observation }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <UserCircle fill='gray' color='white' size={48}/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{observation.username}</span>
            <span className="text-gray-500 text-sm">{observation.timeAgo}</span>
          </div>
          <p className="text-gray-800 mb-3">{observation.content}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {observation.categories.map((category, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <ThumbsUp size={16} />
              <span className="text-sm">{observation.likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <MessageCircle size={16} />
              <span className="text-sm">{observation.replies}</span>
            </button>
            <button className="hover:text-blue-600 transition-colors">
              <Bookmark size={16} />
            </button>
            <button className="hover:text-blue-600 transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );

  const filteredObservations = allObservations
    .filter(obs => obs.sceneId === selectedScene)
    .filter(obs => selectedCategory === 'All' || obs.categories.includes(selectedCategory))
    .sort((a, b) => {
      if (sortBy === 'Likes') {
        return b.likes - a.likes;
      }
      if (sortBy === 'Date Posted') {
        // This is a simplified sorting logic, a real app would use timestamps
        return a.timeAgo.localeCompare(b.timeAgo);
      }
      if (sortBy === 'Replies') {
        return b.replies - a.replies;
      }
      return 0;
    });

  const currentScene = sceneData[selectedScene] || {};

  const renderObservationsPage = () => (
    <>
      {/* Navigation Row for Observations */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mode Selector */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>Observations</span>
                <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setCurrentPage('observations');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                  >
                    Observations
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('analysis');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors rounded-b-lg"
                  >
                    Analysis
                  </button>
                </div>
              )}
            </div>

            {/* Scene Tabs */}
            <div className="flex items-center">
              {scenes.map((scene) => (
                <button
                  key={scene}
                  onClick={() => setSelectedScene(scene)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedScene === scene
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${scene === 1 ? 'rounded-l' : ''} ${scene === scenes.length ? 'rounded-r' : ''}`}
                >
                  Scene {scene}
                </button>
              ))}
            </div>
          </div>

          {/* New Observation Button */}
          {isRegistered ? (
            <button 
              onClick={() => setShowObservationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              New Observation
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              New Observation
            </button>
          )}
        </div>
      </div>

      {/* Main Content for Observations */}
      <div className="flex">
        {/* Scene Details Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Scene {selectedScene}</h2>
            <p className="text-gray-600 text-sm mb-4">{currentScene.description}</p>
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Start Time</span>
                <span className="text-sm text-gray-900">{currentScene.startTime}</span>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                <img src={currentScene.image1Url} alt={`Scene ${selectedScene} Start Frame`} className='w-full h-auto object-cover' />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">End Time</span>
                <span className="text-sm text-gray-900">{currentScene.endTime}</span>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                <img src={currentScene.image2Url} alt={`Scene ${selectedScene} End Frame`} className='w-full h-auto object-cover' />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Links</h3>
            <div className="space-y-2">
              <a href="https://youtu.be/Stu2bawQ-wA?si=qRD7T9vGs7Z2WoiA" className="block text-blue-600 hover:text-blue-800 text-sm transition-colors">
                Behind The Pages - Taare Zameen Par | Amole Gupte | Darsheel Safary
              </a>
            </div>
          </div>
        </div>

        {/* Observations Feed */}
        <div className="flex-1 p-6">
          {/* Filters */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Category:</span>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Likes</option>
                  <option>Date Posted</option>
                  <option>Replies</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Observations List */}
          <div>
            {filteredObservations.length > 0 ? (
              filteredObservations.map((observation) => (
                <ObservationPost key={observation.id} observation={observation} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">No observations found for the selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderAnalysisPage = () => (
    <>
      {/* Navigation Row for Analysis */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Mode Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span>Analysis</span>
              <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setCurrentPage('observations');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                  Observations
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('analysis');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors rounded-b-lg"
                >
                  Analysis
                </button>
              </div>
            )}
          </div>

          {/* Upload Analysis Button */}
          {isRegistered ? (
            <button 
              onClick={() => setShowAnalysisModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Upload size={16} />
              Upload Analysis
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Upload size={16} />
              Upload Analysis
            </button>
          )}
        </div>
      </div>

      {/* Analysis Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-600">Sort By:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Date Posted</option>
              <option>Likes</option>
              <option>Downloads</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Analysis List */}
        <div>
          {analysisData.map((analysis) => (
            <AnalysisPost key={analysis.id} analysis={analysis} />
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8">
                <img src="./src/assets/logo.png" size="100%"/>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900"><strong>Taare Zameen Par (Like Stars On Earth) </strong> (Hindi - 2007)</h1>
                <p className="text-sm text-gray-600">Distribution: Official DVD Release | Runtime: 162 minutes and 32 seconds</p>
              </div>
            </div>
          </div>
          <div>
            {!isRegistered ? (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                SIGN IN
              </button>
            ) : (
              <button className="w-8 h-8 bg-gray-300 rounded-full"></button>
            )}
          </div>
        </div>
      </header>

      {/* Render Current Page */}
      {currentPage === 'observations' ? renderObservationsPage() : renderAnalysisPage()}

      {/* Modals */}
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