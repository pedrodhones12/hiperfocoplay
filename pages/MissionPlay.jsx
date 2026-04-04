import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Pause,
  Play,
  Save,
  Clock,
  Heart,
  Brain,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function MissionPlayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  
  const searchParams = new URLSearchParams(location.search);
  const missionId = searchParams.get('id');
  const eraId = searchParams.get('eraId');

  const [currentStage, setCurrentStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [sessionStart, setSessionStart] = useState(new Date());
  const [choiceThinkingStart, setChoiceThinkingStart] = useState(null);
  const [sessionTimeMinutes, setSessionTimeMinutes] = useState(0);
  const [choicesMade, setChoicesMade] = useState([]);

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

  // Timer for session tracking
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((new Date() - sessionStart) / 1000 / 60);
        setSessionTimeMinutes(elapsed);
        
        // Detect hyperfocus (more than 45 minutes)
        if (elapsed > 0 && elapsed % 45 === 0) {
          handlePauseSuggestion("Você está em hiperfoco há mais de 45 minutos. Considere fazer uma pausa consciente.");
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [isPaused, sessionStart]);

  const { data: mission, isLoading } = useQuery({
    queryKey: ['mission', missionId],
    queryFn: async () => {
      const missions = await base44.entities.Mission.list();
      return missions.find(m => m.id === missionId);
    },
    enabled: !!missionId,
  });

  const { data: missionProgress } = useQuery({
    queryKey: ['missionProgress', missionId],
    queryFn: async () => {
      const progress = await base44.entities.MissionProgress.filter({
        created_by: user?.email,
        mission_id: missionId
      });
      return progress[0];
    },
    enabled: !!user && !!missionId,
  });

  // Initialize or update progress
  const progressMutation = useMutation({
    mutationFn: async (data) => {
      if (missionProgress?.id) {
        return await base44.entities.MissionProgress.update(missionProgress.id, data);
      } else {
        return await base44.entities.MissionProgress.create({
          mission_id: missionId,
          era_id: eraId,
          started_date: new Date().toISOString(),
          session_start: new Date().toISOString(),
          current_stage: 0,
          ...data
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missionProgress', missionId] });
      queryClient.invalidateQueries({ queryKey: ['eraProgress', eraId] });
    }
  });

  useEffect(() => {
    if (missionProgress && !isPaused) {
      setCurrentStage(missionProgress.current_stage || 0);
      setChoicesMade(missionProgress.choices_made || []);
    }
  }, [missionProgress]);

  const handlePauseSuggestion = (message) => {
    setShowPauseDialog(true);
    setIsPaused(true);
  };

  const handleChoice = (choice, stage) => {
    const thinkingTime = choiceThinkingStart 
      ? Math.floor((new Date() - choiceThinkingStart) / 1000)
      : 0;

    const newChoice = {
      stage: currentStage,
      choice_text: choice.text,
      skill_detected: choice.skill_detected,
      thinking_time_seconds: thinkingTime
    };

    const updatedChoices = [...choicesMade, newChoice];
    setChoicesMade(updatedChoices);

    // Auto-save progress
    progressMutation.mutate({
      current_stage: currentStage,
      last_interaction: new Date().toISOString(),
      time_spent_minutes: sessionTimeMinutes,
      choices_made: updatedChoices,
      hyperfocus_detected: sessionTimeMinutes > 45
    });

    // Check if there's a pause suggestion for this stage
    if (stage.pause_suggested) {
      setTimeout(() => {
        handlePauseSuggestion(stage.pause_message || "Grandes decisões pedem descanso. Quer fazer uma pausa?");
      }, 1500);
    } else {
      // Move to next stage after a brief delay
      setTimeout(() => {
        handleNextStage();
      }, 1500);
    }
  };

  const handleNextStage = () => {
    if (currentStage < (mission?.stages?.length || 0) - 1) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      setChoiceThinkingStart(new Date());
      
      progressMutation.mutate({
        current_stage: nextStage,
        last_interaction: new Date().toISOString(),
        time_spent_minutes: sessionTimeMinutes
      });
    } else {
      handleCompleteMission();
    }
  };

  const handleCompleteMission = () => {
    progressMutation.mutate({
      completed: true,
      completion_date: new Date().toISOString(),
      current_stage: currentStage,
      time_spent_minutes: sessionTimeMinutes,
      choices_made: choicesMade,
      hyperfocus_detected: sessionTimeMinutes > 30,
      focus_duration_minutes: sessionTimeMinutes
    });

    // Navigate back to era view
    setTimeout(() => {
      navigate(createPageUrl("EraView") + `?id=${eraId}`);
    }, 2000);
  };

  const handlePause = () => {
    setIsPaused(true);
    
    const pauseData = {
      timestamp: new Date().toISOString(),
      stage: currentStage,
      duration_minutes: 0
    };

    progressMutation.mutate({
      current_stage: currentStage,
      last_interaction: new Date().toISOString(),
      time_spent_minutes: sessionTimeMinutes,
      pauses_taken: [...(missionProgress?.pauses_taken || []), pauseData]
    });
  };

  const handleResume = () => {
    setIsPaused(false);
    setShowPauseDialog(false);
    setSessionStart(new Date());
  };

  if (isLoading || !mission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando missão...</p>
        </div>
      </div>
    );
  }

  const currentStageData = mission.stages?.[currentStage];
  const progressPercentage = ((currentStage + 1) / (mission.stages?.length || 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      {/* Header HUD */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-indigo-100 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate(createPageUrl("EraView") + `?id=${eraId}`)}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold">{sessionTimeMinutes}min</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold">{choicesMade.length} escolhas</span>
            </div>

            <Button
              onClick={handlePause}
              variant="outline"
              size="sm"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-5xl mx-auto mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">
              Etapa {currentStage + 1} de {mission.stages?.length || 0}
            </span>
            <span className="text-xs text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Pause Dialog */}
      <AnimatePresence>
        {(isPaused || showPauseDialog) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Pausa Consciente
                </h3>
                <p className="text-gray-600 mb-6">
                  {showPauseDialog 
                    ? "Você está em hiperfoco há um tempo. Seu cérebro merece um descanso. Quer pausar aqui?"
                    : "Seu progresso está salvo. Volte quando estiver pronto."}
                </p>

                {sessionTimeMinutes > 30 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-purple-800">
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      <strong>Hiperfoco detectado!</strong> Você demonstrou concentração profunda por {sessionTimeMinutes} minutos. Isso é um talento valioso.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleResume}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continuar Missão
                  </Button>
                  <Button
                    onClick={() => {
                      progressMutation.mutate({
                        current_stage: currentStage,
                        last_interaction: new Date().toISOString(),
                        time_spent_minutes: sessionTimeMinutes,
                        pauses_taken: [...(missionProgress?.pauses_taken || []), {
                          timestamp: new Date().toISOString(),
                          stage: currentStage
                        }]
                      });
                      navigate(createPageUrl("EraView") + `?id=${eraId}`);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar e Sair
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        {currentStageData && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              {/* Stage Title */}
              {currentStageData.title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentStageData.title}
                </h2>
              )}

              {/* Narrative Text */}
              {currentStageData.narrative_text && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-indigo-100">
                  <MessageCircle className="w-6 h-6 text-indigo-600 mb-3" />
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {currentStageData.narrative_text}
                  </p>
                </div>
              )}

              {/* Choices */}
              {currentStageData.stage_type === 'choice' && currentStageData.choices && (
                <div className="space-y-4">
                  <p className="text-gray-700 font-semibold mb-4">O que você decide fazer?</p>
                  {currentStageData.choices.map((choice, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!choiceThinkingStart) setChoiceThinkingStart(new Date());
                        handleChoice(choice, currentStageData);
                      }}
                      className="w-full text-left p-6 bg-gradient-to-r from-white to-indigo-50 border-2 border-indigo-200 rounded-xl hover:border-indigo-400 hover:shadow-lg transition-all"
                    >
                      <p className="text-gray-900 font-medium mb-2">{choice.text}</p>
                      {choice.skill_detected && (
                        <p className="text-xs text-indigo-600">
                          💡 Demonstra: {choice.skill_detected}
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Narration Continue */}
 
