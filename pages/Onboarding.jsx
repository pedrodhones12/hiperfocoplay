import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Brain, 
  User, 
  Globe, 
  Eye,
  BookOpen,
  Headphones,
  Zap,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const COUNTRIES = [
  { value: "brasil", label: "🇧🇷 Brasil" },
  { value: "portugal", label: "🇵🇹 Portugal" },
  { value: "franca", label: "🇫🇷 França" },
  { value: "italia", label: "🇮🇹 Itália" },
  { value: "japao", label: "🇯🇵 Japão" },
  { value: "eua", label: "🇺🇸 EUA" },
  { value: "egito", label: "🇪🇬 Egito" },
  { value: "india", label: "🇮🇳 Índia" },
  { value: "china", label: "🇨🇳 China" },
  { value: "mexico", label: "🇲🇽 México" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    // Step 1: Informações Básicas
    display_name: "",
    country: "brasil",
    
    // Step 2: Diagnóstico
    diagnosis: [],
    diagnosis_date: "",
    
    // Step 3: Avaliação Cognitiva
    attention_level: "",
    memory_level: "",
    reading_level: "",
    visual_thinking: "",
    
    // Step 4: Estilo de Aprendizagem
    learning_style: "",
    preferred_content: [],
    
    // Step 5: Personalidade e Interesses
    personality_traits: [],
    interests: [],
    risk_tolerance: "",
    
    // Configurações
    accessibility_settings: {
      dyslexia_font: false,
      high_contrast: false,
      text_to_speech: false,
      font_size: "media"
    }
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData(prev => ({
          ...prev,
          display_name: currentUser.full_name || ""
        }));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    loadUser();
  }, []);

  const createProfileMutation = useMutation({
    mutationFn: (profileData) => base44.entities.UserProfile.create(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      // Redirecionar para a jornada das eras (começando pela Era 0 - O Despertar)
      navigate(createPageUrl("ErasJourney"));
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const cognitiveProfile = {
      attention: formData.attention_level,
      memory: formData.memory_level,
      reading: formData.reading_level,
      visual_thinking: formData.visual_thinking
    };

    const profileData = {
      display_name: formData.display_name,
      country: formData.country,
      diagnosis: formData.diagnosis,
      cognitive_profile: cognitiveProfile,
      interests: formData.interests,
      accessibility_settings: formData.accessibility_settings,
      total_points: 0,
      level: 1
    };

    createProfileMutation.mutate(profileData);
  };

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Passo {currentStep} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
 
