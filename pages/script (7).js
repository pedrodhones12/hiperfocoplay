import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Clock,
  Target,
  Brain,
  Pause,
  CheckCircle,
  Lock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function EraViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  
  const searchParams = new URLSearchParams(location.search);
  const eraId = searchParams.get('id');

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

  const { data: era, isLoading } = useQuery({
    queryKey: ['gameEra', eraId],
    queryFn: async () => {
      const eras = await base44.entities.GameEra.list();
      return eras.find(e => e.id === eraId);
    },
    enabled: !!eraId,
  });

  const { data: missions = [] } = useQuery({
    queryKey: ['missions', eraId],
    queryFn: async () => {
      const allMissions = await base44.entities.Mission.filter({ era_id: eraId });
      return allMissions.sort((a, b) => a.order - b.order);
    },
    enabled: !!eraId,
  });

  const { data: eraProgress } = useQuery({
    queryKey: ['eraProgress', eraId],
    queryFn: async () => {
      const progress = await base44.entities.EraProgress.filter({ 
        created_by: user?.email,
        era_id: eraId
      });
      return progress[0];
    },
    enabled: !!user && !!eraId,
  });

  const { data: missionProgress = [] } = useQuery({
    queryKey: ['missionProgress', eraId],
    queryFn: async () => {
      return await base44.entities.MissionProgress.filter({ 
        created_by: user?.email,
        era_id: eraId
      });
    },
    enabled: !!user && !!eraId,
  });

  const startEraMutation = useMutation({
    mutationFn: async () => {
      if (!eraProgress) {
        return await base44.entities.EraProgress.create({
          era_id: eraId,
          era_title: era.title,
          started_date: new Date().toISOString(),
          current_mission_index: 0,
          missions_completed: []
        });
      }
      return eraProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eraProgress', eraId] });
      // Navigate to first mission
      if (missions.length > 0) {
        navigate(createPageUrl("MissionPlay") + `?id=${missions[0].id}&eraId=${eraId}`);
      }
    }
  });

  const getMissionStatus = (mission) => {
    const progress = missionProgress.find(p => p.mission_id === mission.id);
    
    if (progress?.completed) return 'completed';
    if (progress && !progress.completed) return 'in_progress';
    
    // Check if previous mission is completed
    if (mission.order === 0) return 'unlocked';
    
    const previousMission = missions.find(m => m.order === mission.order - 1);
    if (previousMission) {
      const prevProgress = missionProgress.find(p => p.mission_id === previousMission.id);
      if (prevProgress?.completed) return 'unlocked';
    }
    
    return 'locked';
  };

  const handleMissionClick = (mission, status) => {
    if (status === 'locked') return;
    navigate(createPageUrl("MissionPlay") + `?id=${mission.id}&eraId=${eraId}`);
  };

  if (isLoading || !era) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando era...</p>
        </div>
      </div>
    );
  }

  const completedMissions = missionProgress.filter(p => p.completed).length;
  const totalMissions = missions.length;
  const progressPercentage = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(createPageUrl("ErasJourney"))}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar às Eras
          </Button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-gradient-to-br ${era.color || 'from-indigo-500 to-purple-600'}`}>
                {era.icon || '⏳'}
              </div>
              
              <div className="flex-1">
                <div className="text-sm font-semibold text-indigo-600 mb-1">
                  ERA {era.order}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {era.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {era.subtitle}
                </p>
                
                {/* Progress */}
                {eraProgress && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Progresso: {completedMissions} de {totalMissions} missões
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{era.estimated_duration_days} dias</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{totalMissions} missões</span>
                  </div>
                  {eraProgress && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Brain className="w-4 h-4" />
                      <span>{eraProgress.skills_discovered?.length || 0} habilidades</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Intro Narrative */}
            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
              <p className="text-gray-800 leading-relaxed italic">
                {era.intro_narrative}
              </p>
            </div>

            {/* Start Button */}
            {!eraProgress && (
              <Button
                onClick={() => startEraMutation.mutate()}
                disabled={startEraMutation.isPending}
                className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-lg py-6"
              >
                <Play className="w-5 h-5 mr-2" />
                {startEraMutation.isPending ? 'Iniciando...' : 'Iniciar Esta Era'}
              </Button>
            )}
          </motion.div>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Missões</h2>
          
          {missions.map((mission, index) => {
            const status = getMissionStatus(mission);
            const progress = missionProgress.find(p => p.mission_id === mission.id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress';

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleMissionClick(mission, status)}
                className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
                  isLocked 
                    ? 'opacity-60 cursor-not-allowed border-gray-200' 
                    : 'cursor-pointer hover:shadow-xl hover:-translate-y-0.5 border-indigo-200'
                }`}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center">
                    <Lock className="w-8 h-8 text-gray-500" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    isCompleted ? 'bg-green-100' :
                    isInProgress ? 'bg-indigo-100' :
                    isLocked ? 'bg-gray-100' : 'bg-purple-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : isInProgress ? (
                      <Pause className="w-6 h-6 text-indigo-600" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Play className="w-6 h-6 text-purple-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-indigo-600 mb-1">
                          MISSÃO {mission.order + 1}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {mission.title}
                        </h3>
                      </div>
                      {isCompleted && (
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          Completa
                        </div>
                      )}
                      {isInProgress && (
                        <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                          Em Progresso
                        </div>
  )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {mission.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold capitalize">
                        {mission.mission_type}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                        {mission.estimated_duration_minutes} min
                      </span>
                      {mission.can_span_days && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                          Pode durar dias
                        </span>
                      )}
                    </div>

                    {isInProgress && progress && (
                      <div className="mt-3">
                        <Progress 
                          value={((progress.current_stage + 1) / (mission.stages?.length || 1)) * 100} 
                          className="h-1.5" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {missions.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Missões em Preparação
            </h3>
            <p className="text-gray-600">
              As missões desta era estão sendo criadas. Em breve você poderá começar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}