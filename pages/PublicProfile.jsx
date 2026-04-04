import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  User,
  MapPin,
  Award,
  Briefcase,
  Star,
  TrendingUp,
  Globe,
  ExternalLink,
  Share2,
  ArrowLeft,
  Trophy,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicProfilePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userEmail = searchParams.get('user');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', userEmail],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: userEmail });
      return profiles[0];
    },
    enabled: !!userEmail,
  });

  const { data: gameProgress = [] } = useQuery({
    queryKey: ['publicGameProgress', userEmail],
    queryFn: () => base44.entities.GameProgress.filter({ created_by: userEmail }),
    enabled: !!userEmail,
    initialData: [],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['publicProjects', userEmail],
    queryFn: () => base44.entities.Project.filter({ created_by: userEmail, is_public: true }),
    enabled: !!userEmail,
    initialData: [],
  });

  const { data: hyperfocus } = useQuery({
    queryKey: ['publicHyperfocus', userEmail],
    queryFn: async () => {
      const discoveries = await base44.entities.HyperfocusDiscovery.filter({ created_by: userEmail });
      return discoveries[0];
    },
    enabled: !!userEmail,
  });

  const { data: talentProfile } = useQuery({
    queryKey: ['publicTalentProfile', userEmail],
    queryFn: async () => {
      const talents = await base44.entities.TalentProfile.filter({ created_by: userEmail, is_public: true });
      return talents[0];
    },
    enabled: !!userEmail,
  });

  const completedGames = gameProgress.filter(g => g.completed).length;
  const totalPoints = gameProgress.reduce((sum, g) => sum + (g.score || 0), 0);
  const totalTime = gameProgress.reduce((sum, g) => sum + (g.time_spent || 0), 0);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${profile?.display_name}`,
        text: `Confira o perfil de ${profile?.display_name} na plataforma Hiperfoco!`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copiado para área de transferência!");
    }
  };

  const getCountryFlag = (country) => {
    const flags = {
      brasil: "🇧🇷", portugal: "🇵🇹", franca: "🇫🇷", italia: "🇮🇹",
      japao: "🇯🇵", eua: "🇺🇸", egito: "🇪🇬", india: "🇮🇳",
      china: "🇨🇳", mexico: "🇲🇽"
    };
    return flags[country] || "🌍";
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil não encontrado</h2>
          <p className="text-gray-600 mb-6">Este usuário ainda não criou seu perfil público.</p>
          <Link to={createPageUrl("Dashboard")}>
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Link to={createPageUrl("Feed")}>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </Link>
        <Button onClick={handleShare} variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar Perfil
        </Button>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl flex-shrink-0">
            {profile.avatar_url || "👤"}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{profile.display_name}</h1>
            <div className="flex items-center gap-2 text-lg mb-3">
              <MapPin className="w-5 h-5" />
              <span>{getCountryFlag(profile.country)} {profile.country}</span>
            </div>
            {hyperfocus && (
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold">
                  🎯 {hyperfocus.primary_sector}
                </span>
                {hyperfocus.secondary_sectors?.slice(0, 2).map((sector, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                    {sector}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{completedGames}</p>
            <p className="text-sm text-indigo-100">Jogos Completados</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-sm text-indigo-100">Pontos Totais</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <Briefcase className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{projects.length}</p>
            <p className="text-sm text-indigo-100">Projetos Públicos</p>
          </div>
        </div>
      </div>

      {/* Interests & Skills */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            Interesses
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, idx) => (
              <span key={idx} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Professions */}
      {hyperfocus?.top_professions && hyperfocus.top_professions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Profissões Recomendadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hyperfocus.top_professions.map((profession, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-2xl">💼</span>
                <span className="font-semibold text-gray-900">{profession}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Public Projects */}
      {projects.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600" />
            Projetos Públicos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                    {project.category}
                  </span>
                  {project.website && (
                    <a href={project.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Talent Profile */}
      {talentProfile && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            Portfólio Profissional
          </h2>
          <p className="text-gray-700 mb-4">{talentProfile.bio}</p>
          
          {talentProfile.skills && talentProfile.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-2">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {talentProfile.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {talentProfile.linkedin_url && (
              <a href={talentProfile.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </a>
            )}
            {talentProfile.portfolio_url && (
              <a href={talentProfile.portfolio_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Portfólio
                </Button>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Game Progress Summary */}
      {gameProgress.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Conquistas nos Jogos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-indigo-600">{completedGames}</p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{totalPoints}</p>
              <p className="text-sm text-gray-600">Pontos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{Math.round(totalTime / 60)}h</p>
              <p className="text-sm text-gray-600">Tempo Jogado</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{profile.level || 1}</p>
              <p className="text-sm text-gray-600">Nível</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
