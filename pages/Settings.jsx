import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Eye,
  Volume2,
  Type,
  Palette,
  BookOpen,
  Zap,
  Save,
  CheckCircle
} from "lucide-react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);

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

  const [settings, setSettings] = useState({
    accessibility_settings: {
      dyslexia_font: false,
      high_contrast: false,
      contrast_mode: "normal",
      text_to_speech: false,
      audio_feedback: true,
      audio_feedback_volume: 0.7,
      font_size: "media",
      animation_speed: "normal"
    },
    learning_preferences: {
      preferred_style: "mixed",
      content_depth: "balanceado",
      pause_frequency: "moderado",
      show_progress_indicators: true,
      enable_gamification: true,
      prefer_step_by_step: false
    }
  });

  useEffect(() => {
    if (profile) {
      setSettings({
        accessibility_settings: {
          dyslexia_font: profile.accessibility_settings?.dyslexia_font || false,
          high_contrast: profile.accessibility_settings?.high_contrast || false,
          contrast_mode: profile.accessibility_settings?.contrast_mode || "normal",
          text_to_speech: profile.accessibility_settings?.text_to_speech || false,
          audio_feedback: profile.accessibility_settings?.audio_feedback !== undefined ? profile.accessibility_settings.audio_feedback : true,
          audio_feedback_volume: profile.accessibility_settings?.audio_feedback_volume || 0.7,
          font_size: profile.accessibility_settings?.font_size || "media",
          animation_speed: profile.accessibility_settings?.animation_speed || "normal"
        },
        learning_preferences: {
          preferred_style: profile.learning_preferences?.preferred_style || "mixed",
          content_depth: profile.learning_preferences?.content_depth || "balanceado",
          pause_frequency: profile.learning_preferences?.pause_frequency || "moderado",
          show_progress_indicators: profile.learning_preferences?.show_progress_indicators !== undefined ? profile.learning_preferences.show_progress_indicators : true,
          enable_gamification: profile.learning_preferences?.enable_gamification !== undefined ? profile.learning_preferences.enable_gamification : true,
          prefer_step_by_step: profile.learning_preferences?.prefer_step_by_step || false
        }
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(settings);
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-indigo-100">Personalize sua experiência de aprendizado</p>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Acessibilidade Visual</h2>
            <p className="text-sm text-gray-600">Ajuste a apresentação visual do conteúdo</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Tamanho da Fonte
            </Label>
            <Select
              value={settings.accessibility_settings.font_size}
              onValueChange={(value) => setSettings({
                ...settings,
                accessibility_settings: { ...settings.accessibility_settings, font_size: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pequena">Pequena</SelectItem>
                <SelectItem value="media">Média (Padrão)</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
                <SelectItem value="extra_grande">Extra Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contrast Mode */}
          <div>
            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Modo de Contraste
            </Label>
            <Select
              value={settings.accessibility_settings.contrast_mode}
              onValueChange={(value) => setSettings({
                ...settings,
                accessibility_settings: { ...settings.accessibility_settings, contrast_mode: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="dark">Alto Contraste Escuro</SelectItem>
                <SelectItem value="light">Alto Contraste Claro</SelectItem>
                <SelectItem value="blue_yellow">Azul e Amarelo</SelectItem>
                <SelectItem value="yellow_black">Amarelo e Preto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dyslexia Font */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Fonte para Dislexia</Label>
              <p className="text-sm text-gray-600">Usa fonte OpenDyslexic para facilitar leitura</p>
            </div>
            <Switch
              checked={settings.accessibility_settings.dyslexia_font}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                accessibility_settings: { ...settings.accessibility_settings, dyslexia_font: checked }
              })}
            />
          </div>

          {/* Animation Speed */}
          <div>
            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Velocidade de Animações
            </Label>
            <Select
              value={settings.accessibility_settings.animation_speed}
              onValueChange={(value) => setSettings({
                ...settings,
                accessibility_settings: { ...settings.accessibility_settings, animation_speed: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lenta">Lenta</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="rapida">Rápida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Configurações de Áudio</h2>
            <p className="text-sm text-gray-600">Ajuste feedback sonoro e narração</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Text to Speech */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Leitura em Voz Alta</Label>
              <p className="text-sm text-gray-600">Narração automática dos textos</p>
            </div>
            <Switch
              checked={settings.accessibility_settings.text_to_speech}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                accessibility_settings: { ...settings.accessibility_settings, text_to_speech: checked }
              })}
            />
          </div>

          {/* Audio Feedback */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Feedback Sonoro</Label>
              <p className="text-sm text-gray-600">Sons para ações e interações</p>
            </div>
            <Switch
              checked={settings.accessibility_settings.audio_feedback}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                accessibility_settings: { ...settings.accessibility_settings, audio_feedback: checked }
              })}
            />
          </div>

          {/* Audio Volume */}
          {settings.accessibility_settings.audio_feedback && (
            <div>
              <Label className="text-base font-semibold mb-3">
                Volume do Feedback: {Math.round(settings.accessibility_settings.audio_feedback_volume * 100)}%
              </Label>
              <Slider
                value={[settings.accessibility_settings.audio_feedback_volume * 100]}
                onValueChange={(value) => setSettings({
                  ...settings,
                  accessibility_settings: { 
                    ...settings.accessibility_settings, 
                    audio_feedback_volume: value[0] / 100 
                  }
                })}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Preferências de Aprendizagem</h2>
            <p className="text-sm text-gray-600">Personalize como você aprende melhor</p>
          </div>
        </div>

 
