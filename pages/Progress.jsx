import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ===============================
// CONFIGURAÇÃO DA SUA API
// ===============================
const apiClient = axios.create({
  baseURL: "https://api.hiperfocoplay.com",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
  }
});
  Trophy, 
  TrendingUp, 
  Target,
  Award,
  Calendar,
  BarChart3,
  Star,
  Flame,
  Zap,
  Medal,
  Rocket,
  Brain,
  Users,
  Lock,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BadgeShowcase } from "../components/BadgeDisplay";
import { SkillsOverview } from "../components/SkillProgressChart";
import { ModulePath } from "../components/LearningModuleCard";

export default function ProgressPage() {
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

  const { data: progress = [] } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: () => base44.entities.GameProgress.list('-last_played'),
    enabled: !!user,
    initialData: [],
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user,
    initialData: null,
  });

  const { data: badges = [] } = useQuery({
    queryKey: ['badges'],
    queryFn: () => base44.entities.Badge.filter({ is_active: true }),
    initialData: [],
  });

  const { data: userBadges = [] } = useQuery({
    queryKey: ['userBadges'],
    queryFn: () => base44.entities.UserBadge.filter({ created_by: user?.email }),
    enabled: !!user,
    initialData: [],
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skillProgress'],
    queryFn: () => base44.entities.SkillProgress.filter({ created_by: user?.email }),
    enabled: !!user,
    initialData: [],
  });

  const { data: modules = [] } = useQuery({
    queryKey: ['learningModules'],
    queryFn: () => base44.entities.LearningModule.filter({ is_active: true }),
    initialData: [],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['userProjects'],
    queryFn: () => base44.entities.Project.filter({ created_by: user?.email }),
    enabled: !!user,
    initialData: [],
  });

  const completedGames = progress.filter(p => p.completed).length;
  const totalScore = progress.reduce((sum, p) => sum + (p.score || 0), 0);
  const totalTime = progress.reduce((sum, p) => sum + (p.time_spent || 0), 0);
  const totalAttempts = progress.reduce((sum, p) => sum + (p.attempts || 0), 0);
  const averageScore = progress.length > 0 ? Math.round(totalScore / progress.length) : 0;
  
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-300" />
              Sua Jornada de Aprendizado
            </h1>
            <p className="text-indigo-100 text-lg">
              Transforme seu hiperfoco em conquistas reais
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold mb-1">{profile?.level || 1}</div>
            <p className="text-sm text-indigo-100">Nível Atual</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Medal className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
            <p className="text-2xl font-bold">{userBadges.length}</p>
            <p className="text-xs text-indigo-100">Badges</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Brain className="w-6 h-6 mx-auto mb-2 text-cyan-300" />
            <p className="text-2xl font-bold">{skills.length}</p>
            <p className="text-xs text-indigo-100">Habilidades</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Rocket className="w-6 h-6 mx-auto mb-2 text-green-300" />
            <p className="text-2xl font-bold">{projects.length}</p>
            <p className="text-xs text-indigo-100">Projetos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-amber-300" />
            <p className="text-2xl font-bold">{totalScore}</p>
            <p className="text-xs text-indigo-100">XP Total</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'skills', label: 'Habilidades', icon: Brain },
            { id: 'badges', label: 'Conquistas', icon: Medal },
            { id: 'modules', label: 'Módulos', icon: Rocket },
            { id: 'history', label: 'Histórico', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
          <Trophy className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-sm opacity-90 mb-1">Jogos Completos</p>
          <p className="text-3xl font-bold">{completedGames}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <Star className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-sm opacity-90 mb-1">Pontos Totais</p>
          <p className="text-3xl font-bold">{totalScore}</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <Target className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-sm opacity-90 mb-1">Média de Pontos</p>
          <p className="text-3xl font-bold">{averageScore}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl">
          <Flame className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-sm opacity-90 mb-1">Tempo Jogado</p>
          <p className="text-3xl font-bold">{Math.floor(totalTime)}m</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            Nível {profile?.level || 1}
          </h3>
          <span className="text-sm text-gray-500">
            {totalScore} / {(profile?.level || 1) * 1000} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalScore / ((profile?.level || 1) * 1000)) * 100, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {Math.max(0, ((profile?.level || 1) * 1000) - totalScore)} XP para o próximo nível
        </p>
      </div>

          {/* Career Path Recommendation */}
          {profile?.interests && profile.interests.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Seu Caminho de Carreira
              </h3>
              <p className="text-gray-700 mb-4">
                Baseado no seu progresso e interesses, recomendamos focar em:
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.slice(0, 3).map((interest, idx) => (
                  <span key={idx} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Brain className="w-7 h-7 text-indigo-600" />
              Desenvolvimento de Habilidades
            </h2>
            <p className="text-gray-600">
              Acompanhe seu progresso em cada área de conhecimento
            </p>
          </div>

          {skills.length > 0 ? (
            <SkillsOverview skills={skills} />
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Nenhuma habilidade desenvolvida ainda</p>
              <p className="text-sm text-gray-400">
                Complete jogos para começar a desenvolver suas habilidades!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Medal className="w-7 h-7 text-amber-600" />
              Conquistas e Badges
            </h2>
            <p className="text-gray-600">
              Colecione badges ao completar desafios e marcos de aprendizado
            </p>
          </div>

          {badges.length > 0 ? (
            <BadgeShowcase badges={badges} userBadges={userBadges} />
          ) : (
            <div className="text-center py-12">
              <Medal className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Sistema de badges em breve!</p>
            </div>
          )}
        </div>
      )}

      {/* Modules Tab */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Rocket className="w-7 h-7 text-purple-600" />
                Trilha de Aprendizado
              </h2>
              <p className="text-gray-600">
                Desbloqueie módulos avançados ao completar jogos e conquistar badges
              </p>
            </div>

            {modules.length > 0 ? (
              <ModulePath modules={modules} userProgress={[]} />
            ) : (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Módulos de aprendizado em breve!</p>
                <p className="text-sm text-gray-400">
                  Continue jogando para desbloquear conteúdo avançado
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Histórico de Atividades
        </h3>

        {progress.length > 0 ? (
          <div className="space-y-4">
            {progress.map((item) => (
              <div 
                key={item.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`p-3 rounded-xl ${
                  item.completed 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                } shadow-lg`}>
                  {item.completed ? (
                    <Trophy className="w-6 h-6 text-white" />
                  ) : (
                    <Target className="w-6 h-6 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.game_title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.last_played ? format(new Date(item.last_played), "dd MMM yyyy", { locale: ptBR }) : 'Recente'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.attempts} {item.attempts === 1 ? 'tentativa' : 'tentativas'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">{item.score}</p>
                      <p className="text-xs text-gray-500">pontos</p>
                    </div>
                  </div>

                  {item.achievements && item.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.achievements.map((achievement, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          {achievement}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.completed && (
                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <Trophy className="w-4 h-4" />
                      Jogo Completo!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">Nenhuma atividade ainda</p>
            <p className="text-sm text-gray-400">
              Comece a jogar para ver seu progresso aqui!
            </p>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
