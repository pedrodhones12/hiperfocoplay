import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Rocket, 
  Volume2, 
  VolumeX, 
  Eye, 
  ImagePlus, 
  Video, 
  Bot,
  X,
  Upload,
  Sparkles
} from "lucide-react";

const CATEGORIES = [
  "tecnologia", "saude", "educacao", "agricultura", "alimentacao", "energia",
  "financas", "comercio", "logistica", "turismo", "moda", "construcao",
  "entretenimento", "meio_ambiente", "midia", "servicos", "imobiliario", "seguranca"
];

const STAGES = [
  { value: "ideia", label: "Ideia" },
  { value: "validacao", label: "Validação" },
  { value: "mvp", label: "MVP" },
  { value: "lancamento", label: "Lançamento" },
  { value: "crescimento", label: "Crescimento" }
];

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tecnologia",
    stage: "ideia",
    seeking_investment: false,
    investment_amount: 0,
    website: "",
    is_public: true,
    team_members: [],
    skills_needed: [],
    images: [],
    pitch_video_url: ""
  });

  // Accessibility states
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

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

  const createProjectMutation = useMutation({
    mutationFn: (projectData) => base44.entities.Project.create(projectData),
    onSuccess: () => {
      navigate(createPageUrl("MyProjects"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createProjectMutation.mutate(formData);
  };

  const speakText = (text) => {
    if (!textToSpeech || !text) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploadingMedia(true);
    try {
      const uploadedUrls = [];
      for (const file of Array.from(files)) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
      }
      setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
    } catch (error) {
      alert("Erro ao fazer upload das imagens");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;
    
    setUploadingMedia(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, pitch_video_url: file_url });
    } catch (error) {
      alert("Erro ao fazer upload do vídeo");
    } finally {
      setUploadingMedia(false);
    }
  };

  const getAIAssistance = async (field) => {
    setLoadingAI(true);
    try {
      const prompts = {
        title: `Baseado nesta categoria: ${formData.category} e estágio: ${formData.stage}, sugira 5 títulos criativos e impactantes para um projeto inovador.`,
        description: `Crie uma descrição detalhada e persuasiva para um projeto de ${formData.category} com o título "${formData.title}". Inclua: problema que resolve, solução proposta, diferenciais e impacto social.`
      };

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompts[field],
        add_context_from_internet: false
      });

      setAiSuggestion(response);
    } catch (error) {
      alert("Erro ao buscar sugestão da IA");
    } finally {
      setLoadingAI(false);
    }
  };

  const applyAISuggestion = (field) => {
    setFormData({ ...formData, [field]: aiSuggestion });
    setAiSuggestion("");
    setShowAIAssistant(false);
  };

  const getFontSizeClass = () => {
    const sizes = { small: "text-sm", medium: "text-base", large: "text-lg", xlarge: "text-xl" };
    return sizes[fontSize] || "text-base";
  };

  return (
    <div className={`max-w-3xl mx-auto px-4 py-8 ${getFontSizeClass()} ${highContrast ? 'contrast-high' : ''}`}>
      {/* Accessibility Bar */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-indigo-200 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            ♿ Recursos de Acessibilidade
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setTextToSpeech(!textToSpeech);
                if (!textToSpeech) {
                  speakText("Leitura em voz alta ativada");
                }
              }}
              className={`p-2 rounded-lg transition-all ${textToSpeech ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              title="Leitura em voz alta"
            >
              {textToSpeech ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2 rounded-lg transition-all ${highContrast ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              title="Alto contraste"
            >
              <Eye className="w-5 h-5" />
            </button>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="p-2 rounded-lg bg-gray-100 border-none text-sm"
              title="Tamanho da fonte"
            >
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
              <option value="xlarge">Extra Grande</option>
            </select>

            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showAIAssistant ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}
              title="Assistente IA"
            >
              <Bot className="w-5 h-5" />
              <span className="text-sm font-medium">Assistente IA</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={() => navigate(createPageUrl("MyProjects"))}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Rocket className="w-8 h-8 text-indigo-600" />
          Criar Novo Projeto
        </h1>
        <p className="text-gray-600">
          Transforme seu hiperfoco em um projeto real
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-6">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="title" onMouseEnter={() => speakText("Título do Projeto")}>
              Título do Projeto *
            </Label>
            {showAIAssistant && (
              <button
                type="button"
                onClick={() => getAIAssistance('title')}
                className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700"
              >
                <Sparkles className="w-3 h-3" />
                IA Sugerir
              </button>
            )}
          </div>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onFocus={() => speakText("Campo título do projeto")}
            placeholder="Ex: App de Gerenciamento de Tarefas para TDAH"
            required
            className="mt-2"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="description" onMouseEnter={() => speakText("Descrição do projeto")}>
              Descrição *
            </Label>
            {showAIAssistant && (
              <button
                type="button"
                onClick={() => getAIAssistance('description')}
                disabled={!formData.title}
                className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                IA Sugerir
              </button>
            )}
          </div>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            onFocus={() => speakText("Campo descrição do projeto")}
            placeholder="Descreva seu projeto, problema que resolve, solução proposta..."
            required
            className="mt-2 min-h-[150px]"
          />
        </div>

        {/* AI Suggestion Box */}
        {aiSuggestion && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-purple-900 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Sugestão da IA
              </h4>
              <button onClick={() => setAiSuggestion("")} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap mb-3">{aiSuggestion}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => applyAISuggestion('description')}
                className="bg-purple-600"
              >
                Usar Esta Sugestão
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAiSuggestion("")}
              >
                Descartar
              </Button>
            </div>
          </div>
        )}

        {loadingAI && (
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <Bot className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-purple-700 font-medium">Gerando sugestão...</p>
          </div>
        )}

        {/* Category and Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="stage">Estágio do Projeto *</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => setFormData({ ...formData, stage: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Investment */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="seeking_investment"
              checked={formData.seeking_investment}
              onChange={(e) => setFormData({ ...formData, seeking_investment: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300"
            />
            <Label htmlFor="seeking_investment" className="cursor-pointer">
              Busco investimento para este projeto
            </Label>
          </div>

          {formData.seeking_investment && (
            <div>
              <Label htmlFor="investment_amount">Valor Buscado (USD)</Label>
              <Input
                id="investment_amount"
                type="number"
                value={formData.investment_amount}
                onChange={(e) => setFormData({ ...formData, investment_amount: parseFloat(e.target.value) })}
                placeholder="Ex: 50000"
                className="mt-2"
              />
            </div>
          )}
        </div>

        {/* Images Upload */}
        <div>
          <Label onMouseEnter={() => speakText("Imagens do projeto")}>
            Imagens do Projeto (opcional)
          </Label>
          <div className="mt-2 space-y-3">
            <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 cursor-pointer transition-all bg-gray-50 hover:bg-indigo-50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
              />
              <ImagePlus className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-700">
                {uploadingMedia ? "Enviando..." : "Clique para adicionar imagens"}
              </span>
            </label>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <Label onMouseEnter={() => speakText("Vídeo pitch do projeto")}>
            Vídeo Pitch (opcional)
          </Label>
          <div className="mt-2">
            {!formData.pitch_video_url ? (
              <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 cursor-pointer transition-all bg-gray-50 hover:bg-indigo-50">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoUpload(e.target.files[0])}
                  className="hidden"
                />
                <Video className="w-6 h-6 text-gray-600" />
                <span className="font-medium text-gray-700">
                  {uploadingMedia ? "Enviando..." : "Clique para adicionar vídeo"}
                </span>
              </label>
            ) : (
              <div className="relative">
                <video src={formData.pitch_video_url} controls className="w-full rounded-xl" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pitch_video_url: "" })}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="website" onMouseEnter={() => speakText("Website ou link do projeto")}>
            Website/Link (opcional)
          </Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            onFocus={() => speakText("Campo website")}
            placeholder="https://..."
            className="mt-2"
          />
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <input
            type="checkbox"
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300"
          />
          <Label htmlFor="is_public" className="cursor-pointer">
            Tornar projeto público no feed internacional
          </Label>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(createPageUrl("MyProjects"))}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createProjectMutation.isPending || !formData.title || !formData.description}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            {createProjectMutation.isPending ? "Criando..." : "Criar Projeto"}
          </Button>
        </div>
      </form>

      <style>{`
        .contrast-high {
          filter: contrast(1.5) brightness(1.1);
        }
        .contrast-high input,
        .contrast-high textarea,
        .contrast-high select {
          border: 2px solid #000 !important;
          background: #fff !important;
          color: #000 !important;
        }
        .contrast-high label {
          font-weight: bold !important;
          color: #000 !important;
        }
      `}</style>
    </div>
  );
}