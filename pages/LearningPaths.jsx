import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Map,
  Search,
  Filter,
  Clock,
  Award,
  Users,
  CheckCircle,
  ChevronRight,
  Star,
  TrendingUp,
  Target,
  Sparkles,
  BookOpen
} from "lucide-react";
import { Input } from "@/components/ui/input";

const DIFFICULTY_CONFIG = {
  iniciante: { label: "Iniciante", color: "bg-green-100 text-green-700", icon: "🌱" },
  intermediario: { label: "Intermediário", color: "bg-blue-100 text-blue-700", icon: "🚀" },
  avancado: { label: "Avançado", color: "bg-purple-100 text-purple-700", icon: "⚡" }
};

const CATEGORIES = [
  { value: "todos", label: "Todos" },
  { value: "tecnologia", label: "Tecnologia", emoji: "💻" },
  { value: "sustentabilidade", label: "Sustentabilidade", emoji: "🌱" },
  { value: "cultura_criativo", label: "Cultura & Criativo", emoji: "🎨" },
  { value: "politica_juridico", label: "Política & Jurídico", emoji: "⚖️" },
  { value: "genia_ciencia", label: "Ciência", emoji: "🔬" },
  { value: "agronegocio", label: "Agronegócio", emoji: "🌾" },
  { value: "turismo", label: "Turismo", emoji: "✈️" },
  { value: "healthtech", label: "HealthTech", emoji: "🏥" }
];

export default function LearningPathsPage() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedDifficulty, setSelectedDifficulty] = useState("todos");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro:", error);
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

  const { data: learningPaths = [], isLoading } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: () => base44.entities.LearningPath.filter({ is_active: true }),
    initialData: [],
  });

  const { data: myProgress = [] } = useQuery({
    queryKey: ['myLearningPathProgress'],
    queryFn: () => base44.entities.LearningPathProgress.filter({ created_by: user?.email }),
    enabled: !!user,
    initialData: [],
  });

  const { data: hyperfocus } = useQuery({
    queryKey: ['hyperfocusDiscovery'],
    queryFn: async () => {
      const discoveries = await base44.entities.HyperfocusDiscovery.filter({ created_by: user?.email });
      return discoveries[0];
    },
    enabled: !!user,
  });

  // Get recommendations based on user profile
  const getRecommendedPaths = () => {
    if (!profile || !hyperfocus) return [];

    const userInterests = profile.interests || [];
    const primarySector = hyperfocus.primary_sector;
    const secondarySectors = hyperfocus.secondary_sectors || [];

    return learningPaths
      .filter(path => {
        const matchesPrimary = path.category === primarySector;
        const matchesSecondary = secondarySectors.includes(path.category);
        const matchesInterest = userInterests.some(interest => 
          path.title.toLowerCase().includes(interest.toLowerCase()) ||
          path.description.toLowerCase().includes(interest.toLowerCase())
        );
        return matchesPrimary || matchesSecondary || matchesInterest;
      })
      .sort((a, b) => {
        // Priority: primary sector > secondary > interests
        const aScore = (a.category === primarySector ? 3 : 0) + 
                       (secondarySectors.includes(a.category) ? 2 : 0);
        const bScore = (b.category === primarySector ? 3 : 0) + 
                       (secondarySectors.includes(b.category) ? 2 : 0);
        return bScore - aScore;
      })
      .slice(0, 3);
  };

  const recommendedPaths = getRecommendedPaths();

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || path.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "todos" || path.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getPathProgress = (pathId) => {
    return myProgress.find(p => p.learning_path_id === pathId);
  };

  const continuingPaths = myProgress.filter(p => !p.completed);
  const completedPaths = myProgress.filter(p => p.completed);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Map className="w-12 h-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">Trilhas de Aprendizagem</h1>
            <p className="text-lg text-indigo-100">
              Jornadas completas de conhecimento com certificados e badges! 🎓
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6" />
              <h3 className="font-bold text-lg">Aprenda com Propósito</h3>
            </div>
            <p className="text-sm text-indigo-100">
              Trilhas estruturadas que levam você do zero ao domínio
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6" />
              <h3 className="font-bold text-lg">Certificados Reais</h3>
            </div>
            <p className="text-sm text-indigo-100">
              Ganhe certificados ao completar cada trilha
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6" />
              <h3 className="font-bold text-lg">Progresso Visível</h3>
            </div>
            <p className="text-sm text-indigo-100">
              Acompanhe seu avanço em cada etapa
            </p>
          </div>
        </div>
      </div>

      {/* Continuing Paths */}
      {continuingPaths.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Continue de Onde Parou
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {continuingPaths.map((progress) => {
              const path = learningPaths.find(p => p.id === progress.learning_path_id);
              if (!path) return null;

              const progressPercent = Math.round((progress.completed_steps?.length || 0) / path.steps.length * 100);

              return (
                <Link key={progress.id} to={`${createPageUrl("LearningPathView")}?id=${path.id}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{path.icon}</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                        {progressPercent}% concluído
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Etapa {progress.current_step + 1} de {path.steps.length}
                    </p>
                    <Button className="w-full bg-indigo-600">
                      Continuar Trilha
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Paths */}
      {recommendedPaths.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Recomendado Para Você
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedPaths.map((path) => {
              const progress = getPathProgress(path.id);
              const difficulty = DIFFICULTY_CONFIG[path.difficulty];

              return (
                <Link key={path.id} to={`${createPageUrl("LearningPathView")}?id=${path.id}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1 h-full">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{path.icon}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficulty.color}`}>
                        {difficulty.icon} {difficulty.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{path.description}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{path.estimated_duration}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{path.enrollment_count || 0}</span>
                      </div>
                    </div>
                    {progress ? (
                      <div className="text-sm text-indigo-600 font-semibold">
                        ✓ Em andamento
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {path.steps.length} etapas
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar trilhas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todos">Todas Dificuldades</option>
            <option value="iniciante">🌱 Iniciante</option>
            <option value="intermediario">🚀 Intermediário</option>
            <option value="avancado">⚡ Avançado</option>
          </select>
        </div>
      </div>

      {/* All Paths */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Todas as Trilhas ({filteredPaths.length})
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPaths.map((path) => {
              const progress = getPathProgress(path.id);
              const difficulty = DIFFICULTY_CONFIG[path.difficulty];
              const isCompleted = progress?.completed;

              return (
                <Link key={path.id} to={`${createPageUrl("LearningPathView")}?id=${path.id}`}>
                  <div className={`bg-white rounded-2xl p-6 shadow-lg border hover:shadow-2xl transition-all transform hover:-translate-y-1 h-full ${
                    isCompleted ? 'border-2 border-green-500' : 'border-gray-100'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{path.icon}</span>
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficulty.color}`}>
                          {difficulty.icon} {difficulty.label}
                        </span>
                        {isCompleted && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completo
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{path.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{path.estimated_duration}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{path.steps.length} etapas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{path.enrollment_count || 0}</span>
                        </div>
                      </div>

                      {path.certificate && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                          <Award className="w-4 h-4" />
                          <span className="font-semibold">Certificado incluído</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma trilha encontrada</h3>
            <p className="text-gray-600">Tente ajustar seus filtros de busca</p>
          </div>
        )}
      </div>

      {/* Completed Paths */}
      {completedPaths.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Trilhas Concluídas ({completedPaths.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {completedPaths.map((progress) => {
              const path = learningPaths.find(p => p.id === progress.learning_path_id);
              if (!path) return null;

              return (
                <Link key={progress.id} to={`${createPageUrl("LearningPathView")}?id=${path.id}`}>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-500 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{path.icon}</span>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{path.title}</h3>
                    <p className="text-xs text-gray-600">
                      {path.certificate?.badge_emoji} {path.certificate?.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
