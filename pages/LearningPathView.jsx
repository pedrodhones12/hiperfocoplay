import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Lock,
  Play,
  Clock,
  Award,
  Download,
  Share2,
  BookOpen,
  FileText,
  HelpCircle,
  Zap,
  Video,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const STEP_TYPE_CONFIG = {
  game: { icon: Play, color: "bg-purple-100 text-purple-700", label: "Jogo" },
  article: { icon: FileText, color: "bg-blue-100 text-blue-700", label: "Artigo" },
  quiz: { icon: HelpCircle, color: "bg-green-100 text-green-700", label: "Quiz" },
  challenge: { icon: Zap, color: "bg-orange-100 text-orange-700", label: "Desafio" },
  video: { icon: Video, color: "bg-red-100 text-red-700", label: "Vídeo" }
};

export default function LearningPathViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const pathId = searchParams.get('id');

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

  const { data: learningPath, isLoading } = useQuery({
    queryKey: ['learningPath', pathId],
    queryFn: async () => {
      const paths = await base44.entities.LearningPath.list();
      return paths.find(p => p.id === pathId);
    },
    enabled: !!pathId,
  });

  const { data: progress } = useQuery({
    queryKey: ['learningPathProgress', pathId],
    queryFn: async () => {
      const progressList = await base44.entities.LearningPathProgress.filter({
        created_by: user?.email,
        learning_path_id: pathId
      });
      return progressList[0];
    },
    enabled: !!user && !!pathId,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.LearningPathProgress.create({
        learning_path_id: learningPath.id,
        learning_path_title: learningPath.title,
        enrolled_date: new Date().toISOString(),
        current_step: 0,
        completed_steps: []
      });
      
      await base44.entities.LearningPath.update(learningPath.id, {
        enrollment_count: (learningPath.enrollment_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPathProgress'] });
      queryClient.invalidateQueries({ queryKey: ['learningPath'] });
    },
  });

  const completeStepMutation = useMutation({
    mutationFn: async (stepIndex) => {
      const completedSteps = [...(progress.completed_steps || []), stepIndex];
      const isLastStep = stepIndex === learningPath.steps.length - 1;
      const isFullyCompleted = completedSteps.length === learningPath.steps.length;

      const updateData = {
        completed_steps: completedSteps,
        current_step: Math.min(stepIndex + 1, learningPath.steps.length - 1),
        ...(isFullyCompleted && {
          completed: true,
          completion_date: new Date().toISOString(),
          certificate_earned: true
        })
      };

      await base44.entities.LearningPathProgress.update(progress.id, updateData);

      if (isFullyCompleted) {
        await base44.entities.LearningPath.update(learningPath.id, {
          completion_count: (learningPath.completion_count || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPathProgress'] });
      queryClient.invalidateQueries({ queryKey: ['learningPath'] });
    },
  });

  const downloadCertificate = () => {
    // Placeholder para geração futura de certificado
    alert(`Parabéns! 🎉\n\nCertificado: ${learningPath.certificate.title}\n\n${learningPath.certificate.description}\n\nFuncionalidade de download em desenvolvimento.`);
  };

  if (isLoading || !learningPath) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando trilha...</p>
        </div>
      </div>
    );
  }

  const isEnrolled = !!progress;
  const completedSteps = progress?.completed_steps || [];
  const progressPercent = Math.round((completedSteps.length / learningPath.steps.length) * 100);
  const isCompleted = progress?.completed;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(createPageUrl("LearningPaths"))}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Path Info */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{learningPath.icon}</span>
            <div>
              <h1 className="text-4xl font-bold mb-2">{learningPath.title}</h1>
              <p className="text-lg text-indigo-100">{learningPath.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-semibold">
            <Clock className="w-4 h-4 inline mr-2" />
            {learningPath.estimated_duration} horas
          </span>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-semibold">
            <BookOpen className="w-4 h-4 inline mr-2" />
            {learningPath.steps.length} etapas
          </span>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-semibold capitalize">
            {learningPath.difficulty}
          </span>
          {learningPath.certificate && (
            <span className="px-4 py-2 bg-amber-500/30 backdrop-blur-sm rounded-xl font-semibold">
              <Award className="w-4 h-4 inline mr-2" />
              Certificado incluído
            </span>
          )}
        </div>

        {isEnrolled && !isCompleted && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Seu Progresso</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3 bg-white/20" />
            <p className="text-sm text-indigo-100 mt-2">
              {completedSteps.length} de {learningPath.steps.length} etapas concluídas
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="bg-green-500/30 backdrop-blur-sm rounded-xl p-6 border-2 border-green-300">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Trilha Concluída! 🎉</h3>
                <p className="text-indigo-100">Você ganhou o certificado: {learningPath.certificate.title}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={downloadCertificate} className="bg-white text-indigo-600 hover:bg-indigo-50">
                <Download className="w-4 h-4 mr-2" />
                Baixar Certificado
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Objectives */}
      {learningPath.objectives && learningPath.objectives.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            O Que Você Vai Aprender
          </h2>
          <ul className="space-y-3">
            {learningPath.objectives.map((objective, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Etapas da Trilha</h2>

        <div className="space-y-4">
          {learningPath.steps.map((step, idx) => {
            const isStepCompleted = completedSteps.includes(idx);
            const isCurrentStep = progress?.current_step === idx && !isStepCompleted;
            const isLocked = !isEnrolled || (idx > 0 && !completedSteps.includes(idx - 1));
            const stepType = STEP_TYPE_CONFIG[step.type];
            const StepIcon = stepType.icon;

            return (
              <div
                key={idx}
                className={`rounded-xl p-6 border-2 transition-all ${
                  isStepCompleted
                    ? 'bg-green-50 border-green-500'
                    : isCurrentStep
                    ? 'bg-indigo-50 border-indigo-500 shadow-md'
                    : isLocked
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number/Status */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isStepCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrentStep
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isStepCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <span className="text-lg font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stepType.color}`}>
                        <StepIcon className="w-3 h-3 inline mr-1" />
                        {stepType.label}
                      </span>
                      {isCurrentStep && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                          ▶ Atual
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{step.estimated_time} min</span>
                      </div>
                      {step.required && (
                        <span className="text-red-600 font-semibold">* Obrigatório</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {isStepCompleted ? (
                      <Button variant="outline" size="sm" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Concluído
                      </Button>
                    ) : isLocked ? (
                      <Button variant="outline" size="sm" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        Bloqueado
                      </Button>
                    ) : step.type === 'game' && step.content_id ? (
                      <Link to={`${createPageUrl("GamePlayEducational")}?id=${step.content_id}`}>
                        <Button
                          onClick={() => completeStepMutation.mutate(idx)}
                          className="bg-indigo-600"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Começar
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => completeStepMutation.mutate(idx)}
                        className="bg-indigo-600"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills & Certificate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPath.skills_gained && learningPath.skills_gained.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Habilidades Adquiridas</h3>
            <div className="flex flex-wrap gap-2">
              {learningPath.skills_gained.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {learningPath.certificate && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-8 h-8 text-amber-600" />
              <h3 className="text-lg font-bold text-gray-900">Certificado</h3>
            </div>
            <p className="text-2xl mb-2">{learningPath.certificate.badge_emoji}</p>
            <p className="font-bold text-gray-900 mb-1">{learningPath.certificate.title}</p>
            <p className="text-sm text-gray-600">{learningPath.certificate.description}</p>
          </div>
        )}
      </div>

      {/* Enroll Button */}
      {!isEnrolled && (
        <div className="sticky bottom-4 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
          <Button
            onClick={() => enrollMutation.mutate()}
            disabled={enrollMutation.isPending}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-lg py-6"
          >
            {enrollMutation.isPending ? (
              "Inscrevendo..."
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                Começar Esta Trilha
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
