import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sparkles,
  Trophy,
  Target,
  TrendingUp,
  Play,
  Zap,
  Star,
  Flame,
  Gamepad2,
  Brain,
  Rocket,
  Globe,
  Briefcase,
  Heart,
  Users,
  Award,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Dashboard() {
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

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user,
    initialData: null,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: () => base44.entities.GameProgress.list('-last_played', 10),
    initialData: [],
  });

  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list(),
    initialData: [],
  });

  // New query for hyperfocus discovery
  const { data: hyperfocusDiscovery } = useQuery({
    queryKey: ['hyperfocusDiscovery'],
    queryFn: async () => {
      const discoveries = await base44.entities.HyperfocusDiscovery.filter({ created_by: user?.email });
      return discoveries[0];
    },
    enabled: !!user,
  });

  const completedGames = progress.filter(p => p.completed).length;
  const totalPoints = progress.reduce((sum, p) => sum + (p.score || 0), 0);
  const totalTime = progress.reduce((sum, p) => sum + (p.time_spent || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section - Explicação da Plataforma */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Main Headline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 animate-pulse">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-bold">PLATAFORMA INCLUSIVA GLOBAL</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Transforme Seu Hiperfoco
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                Em Oportunidades Reais
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-6 max-w-3xl mx-auto">
              {profile?.display_name && `Olá, ${profile.display_name}! `}
              A primeira plataforma que conecta <strong>neurodivergentes</strong> a empregos, bolsas e projetos através de <strong>jogos históricos educativos</strong>
            </p>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/30 rounded-xl">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Aprenda Jogando</h3>
              </div>
              <p className="text-sm text-indigo-100">
                Jogos históricos adaptados para TDAH, autismo, dislexia e outras neurodivergências
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/30 rounded-xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Conecte-se ao Mundo</h3>
              </div>
              <p className="text-sm text-indigo-100">
                Acesso a vagas inclusivas, bolsas internacionais e editais brasileiros
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500/30 rounded-xl">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Mostre Seu Talento</h3>
              </div>
              <p className="text-sm text-indigo-100">
                Perfil público, portfólio de projetos e reconhecimento global
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link to={createPageUrl("Games")} className="w-full md:w-auto">
              <button className="w-full md:w-auto bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                <Play className="w-6 h-6" />
                Começar Agora - É Grátis
              </button>
            </Link>
            
            {!profile && (
              <Link to={createPageUrl("Onboarding")} className="w-full md:w-auto">
                <button className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg border-2 border-yellow-300">
                  <Brain className="w-6 h-6" />
                  Criar Meu Perfil
                </button>
              </Link>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>100% Gratuito para Jogar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Acessível para Todos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Comunidade Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Como Funciona Section */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            Como Funciona?
          </h2>
          <p className="text-gray-600 text-lg">
            Sua jornada do aprendizado até as oportunidades reais em 4 passos simples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <div className="mb-3">
                <Gamepad2 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg text-gray-900">Jogue e Aprenda</h3>
              </div>
              <p className="text-sm text-gray-600">
                Explore jogos históricos sobre tecnologia, sustentabilidade e inovação
              </p>
            </div>
            <div className="hidden md:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-indigo-300 to-transparent"></div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <div className="mb-3">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg text-gray-900">Descubra Seu Hiperfoco</h3>
              </div>
              <p className="text-sm text-gray-600">
                Faça o teste e encontre o setor que combina com você
              </p>
            </div>
            <div className="hidden md:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-purple-300 to-transparent"></div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <div className="mb-3">
                <Award className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg text-gray-900">Construa Seu Portfólio</h3>
              </div>
              <p className="text-sm text-gray-600">
                Crie projetos, compartilhe conquistas e mostre suas habilidades
              </p>
            </div>
            <div className="hidden md:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-pink-300 to-transparent"></div>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">4</span>
            </div>
            <div className="mb-3">
              <Rocket className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg text-gray-900">Conecte-se ao Mundo</h3>
            </div>
            <p className="text-sm text-gray-600">
              Acesse vagas, bolsas e oportunidades globais inclusivas
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to={createPageUrl("Games")}>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-2">
              Começar Minha Jornada
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Hyperfocus Discovery CTA */}
      {!hyperfocusDiscovery && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Rocket className="w-10 h-10 text-yellow-300 animate-bounce" />
                <h3 className="text-3xl font-bold">
                  🌟 Descubra Seu Hiperfoco!
                </h3>
              </div>
              <p className="text-lg text-purple-100 mb-4">
                Faça nosso teste interativo e descubra qual setor combina perfeitamente com você! Conecte-se com oportunidades reais e transforme seu talento em carreira.
              </p>
              <div className="flex gap-3">
                <Link to={createPageUrl("HyperfocusTest")}>
                  <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-lg">
                    <Target className="w-6 h-6" />
                    Começar Teste Agora
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-20 h-20 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hyperfocus Results (if completed) */}
      {hyperfocusDiscovery && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Seu Hiperfoco Descoberto
            </h3>
            <Link to={createPageUrl("TalentHub")}>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1">
                Ver Oportunidades
                <Globe className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Setor Principal</p>
                <h4 className="text-2xl font-bold text-gray-900 capitalize">
                  {hyperfocusDiscovery.primary_sector?.replace(/_/g, ' ')}
                </h4>
              </div>
            </div>

            {hyperfocusDiscovery.top_professions && hyperfocusDiscovery.top_professions.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Top Profissões:</p>
                <div className="flex flex-wrap gap-2">
                  {hyperfocusDiscovery.top_professions.slice(0, 3).map((prof, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {prof}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link to={createPageUrl("TalentHub")} className="block mt-4">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5" />
                Explorar Oportunidades
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Profile Alert (if not completed) */}
      {!profile && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                💡 Experimente os jogos primeiro!
              </h3>
              <p className="text-gray-700 mb-4">
                Explore nossa plataforma livremente. Depois que jogar um pouco, recomendamos completar seu perfil para uma experiência personalizada com jogos adaptados às suas habilidades!
              </p>
              <Link to={createPageUrl("Onboarding")}>
                <button className="bg-amber-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors">
                  Completar Perfil Mais Tarde
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Impacto Social */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-500 rounded-2xl">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Por Que Existimos?</h3>
            <p className="text-green-700 font-medium">Nossa missão é transformar vidas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-gray-900">Para Neurodivergentes</h4>
            </div>
            <p className="text-sm text-gray-600">
              Transformamos o hiperfoco em superpoder através de jogos adaptados e oportunidades reais
            </p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-gray-900">Conexão Global</h4>
            </div>
            <p className="text-sm text-gray-600">
              Conectamos talentos brasileiros a universidades, empresas e oportunidades no mundo todo
            </p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              <h4 className="font-bold text-gray-900">Mercado Inclusivo</h4>
            </div>
            <p className="text-sm text-gray-600">
              Ajudamos empresas a encontrarem talentos únicos e construírem times mais diversos
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Jogos Completos</p>
          <p className="text-3xl font-bold text-gray-900">{completedGames}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Star className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Pontos Totais</p>
          <p className="text-3xl font-bold text-gray-900">{totalPoints}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Nível Atual</p>
          <p className="text-3xl font-bold text-gray-900">{profile?.level || 1}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Flame className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Tempo Jogado</p>
          <p className="text-3xl font-bold text-gray-900">{Math.floor(totalTime)}m</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Atividade Recente
          </h3>
          <Link to={createPageUrl("Progress")}>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
              Ver tudo
            </button>
          </Link>
        </div>

        {progress.length > 0 ? (
          <div className="space-y-3">
            {progress.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.game_title}</p>
                    <p className="text-sm text-gray-500">
                      {item.attempts} {item.attempts === 1 ? 'tentativa' : 'tentativas'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600">{item.score} pts</p>
                  {item.completed && (
                    <p className="text-xs text-green-600 font-medium">✓ Completo</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">Você ainda não jogou nenhum jogo</p>
            <Link to={createPageUrl("Games")}>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                Começar a Jogar
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Games */}
      {games.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Jogos Disponíveis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {games.slice(0, 3).map((game) => (
              <Link key={game.id} to={`${createPageUrl("GamePlay")}?id=${game.id}`}>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-all border border-indigo-100 cursor-pointer transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 ${game.color || 'bg-indigo-500'} rounded-xl flex items-center justify-center`}>
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{game.title}</h4>
                      <p className="text-xs text-gray-500">{game.estimated_time || 10} min</p>
                    </div>
                  </div>
 <p className="text-sm text-gray-600 line-clamp-2">{game.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
