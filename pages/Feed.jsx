import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Globe,
  Send,
  Image as ImageIcon,
  Video,
  Link2,
  Smile,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  TrendingUp,
  Award,
  Search,
  X,
  Upload,
  Paperclip,
  ExternalLink,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import AIOpportunityBot from "../components/AIOpportunityBot";

const POST_TYPES = [
  { value: "achievement", label: "Conquista", icon: Award, color: "bg-yellow-100 text-yellow-700" },
  { value: "project", label: "Projeto", icon: TrendingUp, color: "bg-blue-100 text-blue-700" },
  { value: "looking_for", label: "Procurando", icon: Search, color: "bg-purple-100 text-purple-700" },
  { value: "question", label: "Pergunta", icon: MessageCircle, color: "bg-green-100 text-green-700" },
  { value: "announcement", label: "Anúncio", icon: Globe, color: "bg-red-100 text-red-700" },
];

const EMOJIS = ["😊", "❤️", "👏", "🎉", "🚀", "💡", "🔥", "⭐", "👍", "🎯", "💪", "🌟", "✨", "🙌", "👌", "🎊"];

export default function FeedPage() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState({
    content: "",
    post_type: "announcement",
    images: [],
    videos: [],
    links: [],
    documents: []
  });
  const [filterType, setFilterType] = useState("all");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    loadUser();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user,
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date', 50),
    initialData: [],
  });

  const createPostMutation = useMutation({
    mutationFn: (postData) => base44.entities.Post.create(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewPost({ content: "", post_type: "announcement", images: [], videos: [], links: [], documents: [] });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: ({ postId, currentLikes, likedBy }) => {
      const userEmail = user?.email;
      const hasLiked = likedBy?.includes(userEmail);
      
      return base44.entities.Post.update(postId, {
        likes: hasLiked ? currentLikes - 1 : currentLikes + 1,
        liked_by: hasLiked 
          ? likedBy.filter(email => email !== userEmail)
          : [...(likedBy || []), userEmail]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const commentPostMutation = useMutation({
    mutationFn: ({ postId, comment, currentComments }) => {
      return base44.entities.Post.update(postId, {
        comments: [
          ...(currentComments || []),
          {
            author: profile?.display_name || user?.full_name || "Usuário",
            author_email: user?.email,
            content: comment,
            date: new Date().toISOString()
          }
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const sharePostMutation = useMutation({
    mutationFn: ({ postId, currentShares }) => {
      return base44.entities.Post.update(postId, {
        shares: currentShares + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleMediaUpload = async (files, type) => {
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    const uploadedUrls = [];

    try {
      for (const file of Array.from(files)) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
      }

      if (type === 'image') {
        setNewPost(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      } else if (type === 'video') {
        setNewPost(prev => ({ ...prev, videos: [...prev.videos, ...uploadedUrls] }));
      } else if (type === 'document') {
        setNewPost(prev => ({ ...prev, documents: [...prev.documents, ...uploadedUrls] }));
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload dos arquivos. Tente novamente.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleAddLink = () => {
    const url = prompt("Cole a URL do link:");
    const title = prompt("Título do link (opcional):");
    
    if (url) {
      setNewPost(prev => ({
        ...prev,
        links: [...prev.links, { url, title: title || url }]
      }));
    }
  };

  const handleRemoveMedia = (type, index) => {
    setNewPost(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      alert("Por favor, escreva algo antes de publicar!");
      return;
    }

    const postData = {
      content: newPost.content,
      author_name: profile?.display_name || user?.full_name || "Usuário",
      author_avatar: profile?.avatar_url || "",
      author_country: profile?.country || "brasil",
      post_type: newPost.post_type,
      images: newPost.images,
      videos: newPost.videos,
      links: newPost.links,
      documents: newPost.documents,
      tags: [],
      likes: 0,
      liked_by: [],
      comments: [],
      shares: 0
    };

    createPostMutation.mutate(postData);
  };

  const handleLikePost = (post) => {
    likePostMutation.mutate({
      postId: post.id,
      currentLikes: post.likes || 0,
      likedBy: post.liked_by || []
    });
  };

  const handleCommentPost = (postId) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;

    const post = posts.find(p => p.id === postId);
    commentPostMutation.mutate({
      postId,
      comment,
      currentComments: post.comments || []
    });

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const handleSharePost = (post) => {
    sharePostMutation.mutate({
      postId: post.id,
      currentShares: post.shares || 0
    });

    if (navigator.share) {
      navigator.share({
        title: `Post de ${post.author_name}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      alert("Link copiado! (Funcionalidade de compartilhamento)");
    }
  };

  const addEmoji = (emoji) => {
    setNewPost(prev => ({ ...prev, content: prev.content + emoji }));
    setShowEmojiPicker(false);
  };

  const filteredPosts = filterType === "all" 
    ? posts 
    : posts.filter(post => post.post_type === filterType);

  const getCountryFlag = (country) => {
    const flags = {
      brasil: "🇧🇷", portugal: "🇵🇹", franca: "🇫🇷", italia: "🇮🇹",
      japao: "🇯🇵", eua: "🇺🇸", egito: "🇪🇬", india: "🇮🇳",
      china: "🇨🇳", mexico: "🇲🇽"
    };
    return flags[country] || "🌍";
  };

  const hasUserLiked = (post) => {
    return post.liked_by?.includes(user?.email);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <AIOpportunityBot />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Feed Internacional</h1>
        </div>
        <p className="text-indigo-100">
          Conecte-se com pessoas neurodivergentes do mundo todo! 🌍✨
        </p>
      </div>

      {/* Create Post */}
      {profile && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">
                {profile.avatar_url ? "🖼️" : "👤"}
              </span>
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="Compartilhe suas conquistas, projetos ou perguntas..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="min-h-[100px] mb-3"
              />

              {/* Media Preview */}
              {(newPost.images.length > 0 || newPost.videos.length > 0 || newPost.links.length > 0 || newPost.documents.length > 0) && (
                <div className="mb-3 space-y-2">
                  {/* Images */}
                  {newPost.images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newPost.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                          <button
                            onClick={() => handleRemoveMedia('images', idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Videos */}
                  {newPost.videos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newPost.videos.map((vid, idx) => (
                        <div key={idx} className="relative">
                          <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-500" />
                          </div>
                          <button
                            onClick={() => handleRemoveMedia('videos', idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  {newPost.links.length > 0 && (
                    <div className="space-y-2">
                      {newPost.links.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                          <Link2 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 flex-1 truncate">{link.title}</span>
                          <button
                            onClick={() => handleRemoveMedia('links', idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Documents */}
                  {newPost.documents.length > 0 && (
                    <div className="space-y-2">
                      {newPost.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Documento {idx + 1}</p>
                            <p className="text-xs text-gray-500 truncate">{doc}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveMedia('documents', idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Post Type Selection */}
              <div className="flex flex-wrap gap-2 mb-4">
                {POST_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setNewPost({ ...newPost, post_type: type.value })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        newPost.post_type === type.value
                          ? type.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 inline mr-1" />
                      {type.label}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e.target.files, 'image')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Imagens</span>
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleMediaUpload(e.target.files, 'video')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Video className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Vídeos</span>
                  </div>
                </label>

                <button
                  onClick={handleAddLink}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Link2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Link</span>
                </button>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                    onChange={(e) => handleMediaUpload(e.target.files, 'document')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Documentos</span>
                  </div>
                </label>

                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Smile className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Emoji</span>
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-10 grid grid-cols-8 gap-2">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCreatePost}
                  disabled={createPostMutation.isPending || uploadingMedia}
                  className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  {uploadingMedia ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : createPostMutation.isPending ? (
                    "Publicando..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publicar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              filterType === "all"
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {POST_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  filterType === type.value
                    ? type.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Carregando posts...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const postType = POST_TYPES.find(t => t.value === post.post_type);
            const PostIcon = postType?.icon || Globe;

            return (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Post Header */}
                <div className="p-6 pb-4">
                <div className="flex items-start gap-3 mb-4">
                  <Link to={`${createPageUrl("PublicProfile")}?user=${post.created_by}`}>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-110 transition-transform">
                      <span className="text-2xl">{post.author_avatar || "👤"}</span>
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link to={`${createPageUrl("PublicProfile")}?user=${post.created_by}`}>
                        <h3 className="font-bold text-gray-900 hover:text-indigo-600 cursor-pointer">{post.author_name}</h3>
                      </Link>
                      <span className="text-xl">{getCountryFlag(post.author_country)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${postType?.color || 'bg-gray-100 text-gray-700'} flex items-center gap-1`}>
                      <PostIcon className="w-3 h-3" />
                      {postType?.label || post.post_type}
                    </span>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                  {/* Post Media */}
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {post.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt=""
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {post.videos && post.videos.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {post.videos.map((vid, idx) => (
                        <video
                          key={idx}
                          src={vid}
                          controls
                          className="w-full rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {post.links && post.links.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {post.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                        >
                          <ExternalLink className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{link.title}</p>
                            <p className="text-sm text-gray-500 truncate">{link.url}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {post.documents && post.documents.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {post.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                        >
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">Documento Anexado</p>
                            <p className="text-sm text-blue-600 truncate">{doc}</p>
                          </div>
                          <Upload className="w-4 h-4 text-blue-600" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="border-t border-gray-200 px-6 py-3 flex items-center gap-6">
                  <button
                    onClick={() => handleLikePost(post)}
                    className={`flex items-center gap-2 transition-colors ${
                      hasUserLiked(post) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${hasUserLiked(post) ? 'fill-current' : ''}`} />
                    <span className="font-semibold">{post.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">{post.comments?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => handleSharePost(post)}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-semibold">{post.shares || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    {/* Existing Comments */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👤</span>
                            </div>
                            <div className="flex-1 bg-white rounded-lg p-3">
                              <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                              <p className="text-gray-700 text-sm">{comment.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(comment.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-3">
                      <Input
                        placeholder="Escreva um comentário..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && handleCommentPost(post.id)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleCommentPost(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        size="sm"
                        className="bg-indigo-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-600">
              Seja o primeiro a compartilhar algo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
