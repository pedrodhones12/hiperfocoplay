import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Lock,
  CheckCircle,
  Play,
  Clock,
  Target,
  Brain,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ErasJourneyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const { data: eras = [], isLoading } = useQuery({
    queryKey: ['gameEras'],
    queryFn: async () => {
      const allEras = await base44.entities.GameEra.list();
      return allEras.sort((a, b) => a.order - b.order);
    },
  });

  const { data: eraProgress = [] } = useQuery({
    queryKey: ['eraProgress'],
    queryFn: async () => {
      return await base44.entities.EraProgress.filter({ created_by: user?.email });
    },
    enabled: !!user,
  });

  const getEraStatus = (era) => {
    const progress = eraProgress.find(p => p.era_id === era.id);
    
    if (progress?.completed) return 'completed';
    if (progress && !progress.completed) return 'in_progress';
    
    // Check if previous era is completed
    if (era.order === 0) return 'unlocked'; // Era 0 sempre desbloqueada
    
    const previousEra = eras.find(e => e.order === era.order - 1);
    if (previousEra) {
      const prevProgress = eraProgress.find(p => p.era_id === previousEra.id);
      if (prevProgress?.completed) return 'unlocked';
    }
    
    return 'locked';
  };

  const getEraProgressPercentage = (era) => {
    const progress = eraProgress.find(p => p.era_id === era.id);
    if (!progress) return 0;
    
    const totalMissions = progress.missions_completed?.length || 0;
    // Assumindo que cada era tem cerca de 5-10 missões
    const estimatedTotal = 7;
    return Math.min((totalMissions / estimatedTotal) * 100, 100);
  };

  const handleEraClick = (era, status) => {
    if (status === 'locked') return;
    navigate(createPageUrl("EraView") + `?id=${era.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sua jornada...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <div className="text-6xl mb-4">⏳</div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Ecos do Tempo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            Descubra seu talento vivendo a história
          </p>
          <p className="text-sm text-gray-500 italic">
            "Nem todo talento nasce para provas. Alguns nascem para histórias."
          </p>
        </div>

        {/* Stats Overview */}
        {eraProgress.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
              <Target className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {eraProgress.filter(p => p.completed).length}
              </p>
              <p className="text-sm text-gray-600">Eras Completas</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(eraProgress.reduce((sum, p) => sum + (p.total_time_spent_minutes || 0), 0) / 60)}h
              </p>
              <p className="text-sm text-gray-600">Tempo Jogado</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
              <Brain className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {eraProgress.reduce((sum, p) => sum + (p.skills_discovered?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Habilidades</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {eraProgress.reduce((sum, p) => sum + (p.pause_count || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Pausas Conscientes</p>
            </div>
          </div>
        )}

        {/* Eras Timeline */}
        <div className="space-y-6">
          {eras.map((era, index) => {
            const status = getEraStatus(era);
            const progressPercentage = getEraProgressPercentage(era);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress';

            return (
              <motion.div
                key={era.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleEraClick(era, status)}
                className={`relative bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 transition-all ${
                  isLocked 
                    ? 'opacity-60 cursor-not-allowed border-gray-200' 
                    : 'cursor-pointer hover:shadow-2xl hover:-translate-y-1 border-indigo-200'
                }`}
              >
                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-700">
                        Complete a era anterior
                      </p>
                    </div>
                  </div>
                )}

                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-6 right-6 bg-green-500 rounded-full p-3 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Era Icon */}
                  <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${
                    isLocked ? 'bg-gray-100' : `bg-gradient-to-br ${era.color || 'from-indigo-500 to-purple-600'}`
                  }`}>
                    {isLocked ? '🔒' : era.icon || '⏳'}
                  </div>

                  {/* Era Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold text-indigo-600 mb-1">
                          ERA {era.order} {isInProgress && '• Em Andamento'}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {era.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{era.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {era.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        {era.theme}
                      </span>
                      {era.estimated_duration_days && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {era.estimated_duration_days} dias
                        </span>
                      )}
                      {era.cognitive_focus?.slice(0, 2).map(skill => (
                        <span key={skill} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold capitalize">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    {isInProgress && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-700">Progresso</span>
                          <span className="text-xs text-gray-500">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    )}

                    {/* Action Button */}
                    {!isLocked && (
                      <Button
                        className={`${
                          isCompleted 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Revisar Era
                          </>
                        ) : isInProgress ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continuar Jornada
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Começar Era
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {eras.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xl">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Sua Jornada Está Pronta
            </h3>
            <p className="text-gray-600 mb-6">
              As eras históricas estão sendo preparadas. Em breve você poderá começar sua aventura!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
