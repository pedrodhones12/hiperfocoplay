
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  Filter,
  Play,
  Clock,
  Brain,
  Sparkles,
  ChevronRight,
  Zap,
  BookOpen,
  History,
  Trophy
} from "lucide-react";

const CATEGORIES = [
  { value: "todos", label: "Todos", color: "bg-gray-500" },
  { value: "tecnologia", label: "Tecnologia", color: "bg-blue-500", emoji: "💻" },
  { value: "sustentabilidade", label: "Sustentabilidade", color: "bg-green-500", emoji: "🌱" },
  { value: "cultura_criativo", label: "Cultura & Criativo", color: "bg-purple-500", emoji: "🎨" },
  { value: "politica_juridico", label: "Política & Jurídico", color: "bg-amber-500", emoji: "⚖️" },
  { value: "genia_ciencia", label: "Ciência", color: "bg-indigo-500", emoji: "🔬" },
  { value: "agronegocio", label: "Agronegócio", color: "bg-lime-500", emoji: "🌾" },
  { value: "turismo", label: "Turismo", color: "bg-sky-500", emoji: "✈️" },
  { value: "economia_mar", label: "Economia do Mar", color: "bg-teal-500", emoji: "🌊" },
  { value: "moda_design", label: "Moda & Design", color: "bg-pink-500", emoji: "👗" },
  { value: "cidades_inteligentes", label: "Cidades Inteligentes", color: "bg-slate-500", emoji: "🏙️" },
  { value: "healthtech", label: "HealthTech", color: "bg-red-500", emoji: "🏥" },
];

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [user, setUser] = useState(null);

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

  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list(),
    initialData: [],
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: () => base44.entities.GameProgress.list(),
    enabled: !!user,
    initialData: [],
  });

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getGameProgress = (gameId) => {
    return progress.find(p => p.game_id === gameId);
  };

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat?.color || "bg-gray-500";
  };

  const getCategoryEmoji = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat?.emoji || "🎮";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          Jogos Históricos Educativos
        </h1>
        <p className="text-gray-600">
          Aprenda história do mundo de forma interativa! 🌍✨
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Jogos com História Real! 📚</h3>
            <p className="text-indigo-100">
              Cada jogo ensina sobre invenções e descobertas que mudaram o mundo. 
              Recursos de acessibilidade incluem: leitura em voz alta, legendas, alto contraste e ritmo ajustável.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-2 ${
                selectedCategory === category.value
                  ? `${category.color} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.emoji && <span>{category.emoji}</span>}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const gameProgress = getGameProgress(game.id);
            const categoryColor = getCategoryColor(game.category);
            const categoryEmoji = getCategoryEmoji(game.category);

            return (
              <div key={game.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 transform hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${categoryColor} rounded-2xl flex items-center justify-center shadow-lg relative`}>
                    <span className="text-3xl">{categoryEmoji}</span>
                    {gameProgress && !gameProgress.completed && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {gameProgress?.completed && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Completo
                      </span>
                    )}
                    {game.historical_context && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <History className="w-3 h-3" />
                        História Real
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{game.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{game.description}</p>

                {/* Historical Context Preview */}
                {game.historical_context && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 mb-4 border border-amber-200">
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-semibold">Período:</span> {game.historical_context.period}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Figura:</span> {game.historical_context.key_figure}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{game.estimated_time || 10} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Brain className="w-4 h-4" />
                      <span className="capitalize">{game.difficulty || 'Médio'}</span>
                    </div>
                  </div>

                  {game.learning_objectives && game.learning_objectives.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Educativo
                      </span>
                      {game.cognitive_focus?.slice(0, 2).map((focus, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium capitalize"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  )}

                  {gameProgress && !gameProgress.completed && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-semibold text-indigo-600">{gameProgress.score} pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${Math.min(gameProgress.score / 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Link to={`${createPageUrl("GamePlayEducational")}?id=${game.id}`} className="mt-4">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    {gameProgress?.completed ? 'Jogar Novamente' : 'Começar Aventura'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum jogo encontrado</h3>
          <p className="text-gray-600 mb-6">
            Tente ajustar sua busca ou filtros
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("todos");
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
