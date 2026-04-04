import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Sparkles,
  Save,
  User,
  Palette,
  Shirt,
  Glasses as GlassesIcon,
  Crown,
  Headphones,
  Target,
  Smile
} from "lucide-react";

const EMOJI_OPTIONS = ["😊", "🙂", "😎", "🤓", "😇", "🤗", "😺", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐸", "🦉", "🤖", "👽", "🎃", "🌟", "⭐"];

const SKIN_TONES = {
  light: { name: "Claro", color: "bg-amber-100" },
  "medium-light": { name: "Médio-Claro", color: "bg-amber-200" },
  medium: { name: "Médio", color: "bg-amber-300" },
  "medium-dark": { name: "Médio-Escuro", color: "bg-amber-500" },
  dark: { name: "Escuro", color: "bg-amber-700" }
};

const OUTFIT_COLORS = {
  red: { name: "Vermelho", color: "bg-red-500" },
  blue: { name: "Azul", color: "bg-blue-500" },
  green: { name: "Verde", color: "bg-green-500" },
  yellow: { name: "Amarelo", color: "bg-yellow-500" },
  purple: { name: "Roxo", color: "bg-purple-500" },
  pink: { name: "Rosa", color: "bg-pink-500" },
  orange: { name: "Laranja", color: "bg-orange-500" },
  black: { name: "Preto", color: "bg-gray-900" },
  white: { name: "Branco", color: "bg-gray-100 border-2 border-gray-300" }
};

const ACCESSORIES = {
  none: { name: "Nenhum", icon: null, emoji: "" },
  glasses: { name: "Óculos", icon: GlassesIcon, emoji: "👓" },
  hat: { name: "Chapéu", icon: Target, emoji: "🎩" },
  crown: { name: "Coroa", icon: Crown, emoji: "👑" },
  headphones: { name: "Fones", icon: Headphones, emoji: "🎧" },
  tie: { name: "Gravata", icon: Shirt, emoji: "👔" },
  scarf: { name: "Cachecol", icon: null, emoji: "🧣" }
};

const PERSONALITIES = {
  friendly: { name: "Amigável", emoji: "🤗", color: "bg-green-100 text-green-700" },
  serious: { name: "Sério", emoji: "🧐", color: "bg-gray-100 text-gray-700" },
  funny: { name: "Engraçado", emoji: "😄", color: "bg-yellow-100 text-yellow-700" },
  wise: { name: "Sábio", emoji: "🧙", color: "bg-purple-100 text-purple-700" },
  energetic: { name: "Energético", emoji: "⚡", color: "bg-orange-100 text-orange-700" }
};

export default function CharacterCreatorPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  const [character, setCharacter] = useState({
    name: "",
    avatar_emoji: "😊",
    skin_tone: "medium",
    outfit_color: "blue",
    accessory: "none",
    hair_style: "short",
    personality: "friendly",
    is_active: true,
    favorite_category: "tecnologia"
  });

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

  const { data: myCharacters = [] } = useQuery({
    queryKey: ['myCharacters'],
    queryFn: async () => {
      return await base44.entities.Character.filter({ created_by: user?.email });
    },
    enabled: !!user,
    initialData: [],
  });

  const createCharacterMutation = useMutation({
    mutationFn: async (characterData) => {
      // Desativar outros personagens se este for ativo
      if (characterData.is_active) {
        for (const char of myCharacters) {
          if (char.is_active) {
            await base44.entities.Character.update(char.id, { is_active: false });
          }
        }
      }
      return base44.entities.Character.create(characterData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCharacters'] });
      navigate(createPageUrl("Profile"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!character.name.trim()) {
      alert("Por favor, dê um nome ao seu personagem!");
      return;
    }
    createCharacterMutation.mutate(character);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(createPageUrl("Profile"))}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            Criador de Personagens
          </h1>
          <p className="text-gray-600">
            Crie seu personagem único para usar nos jogos!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Preview do Personagem
            </h3>
            
            <div className="relative">
              {/* Character Display */}
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-6">
                {/* Accessory Above */}
                {character.accessory !== 'none' && ['hat', 'crown', 'headphones'].includes(character.accessory) && (
                  <div className="text-6xl mb-2 animate-bounce">
                    {ACCESSORIES[character.accessory].emoji}
                  </div>
                )}

                {/* Main Avatar */}
                <div className={`w-48 h-48 rounded-full ${SKIN_TONES[character.skin_tone].color} flex items-center justify-center shadow-2xl mb-4 transform hover:scale-110 transition-all`}>
                  <span className="text-9xl">{character.avatar_emoji}</span>
                </div>

                {/* Accessory Below */}
                {character.accessory !== 'none' && ['glasses', 'tie', 'scarf'].includes(character.accessory) && (
                  <div className="text-5xl mt-2 animate-pulse">
                    {ACCESSORIES[character.accessory].emoji}
                  </div>
                )}

                {/* Outfit Color Indicator */}
                <div className={`w-32 h-8 ${OUTFIT_COLORS[character.outfit_color].color} rounded-full shadow-lg mt-4`} />

                {/* Name */}
                <div className="mt-6 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {character.name || "Seu Personagem"}
                  </h2>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${PERSONALITIES[character.personality].color}`}>
                    <span className="text-2xl">{PERSONALITIES[character.personality].emoji}</span>
                    <span className="font-semibold">{PERSONALITIES[character.personality].name}</span>
                  </div>
                </div>
              </div>

              {/* Character Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Tom de Pele</p>
                  <p className="font-semibold">{SKIN_TONES[character.skin_tone].name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Roupa</p>
                  <p className="font-semibold">{OUTFIT_COLORS[character.outfit_color].name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Acessório</p>
                  <p className="font-semibold">{ACCESSORIES[character.accessory].name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Personalidade</p>
                  <p className="font-semibold">{PERSONALITIES[character.personality].name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Nome do Personagem *
                </Label>
                <Input
                  id="name"
                  value={character.name}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  placeholder="Ex: Super Jogador"
                  className="mt-2 text-lg"
                  maxLength={20}
                />
              </div>

              {/* Avatar Selection */}
              <div>
                <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Smile className="w-5 h-5 text-indigo-600" />
                  Escolha seu Avatar
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCharacter({ ...character, avatar_emoji: emoji })}
                      className={`p-3 text-3xl rounded-xl transition-all transform hover:scale-110 ${
                        character.avatar_emoji === emoji
                          ? 'bg-indigo-500 shadow-lg scale-110'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <Label className="text-lg font-semibold mb-3">Tom de Pele</Label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(SKIN_TONES).map(([key, { name, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCharacter({ ...character, skin_tone: key })}
                      className={`p-4 rounded-xl transition-all ${color} ${
                        character.skin_tone === key
                          ? 'ring-4 ring-indigo-500 scale-110'
                          : 'hover:scale-105'
                      }`}
                      title={name}
                    />
                  ))}
                </div>
              </div>

              {/* Outfit Color */}
              <div>
                <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-indigo-600" />
                  Cor da Roupa
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(OUTFIT_COLORS).map(([key, { name, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCharacter({ ...character, outfit_color: key })}
                      className={`p-4 rounded-xl transition-all ${color} ${
                        character.outfit_color === key
                          ? 'ring-4 ring-indigo-500 scale-110'
                          : 'hover:scale-105'
                      }`}
                      title={name}
                    >
                      <span className={key === 'black' ? 'text-white' : 'text-gray-900'}>
                        {name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-600" />
                  Acessórios
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(ACCESSORIES).map(([key, { name, emoji }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCharacter({ ...character, accessory: key })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        character.accessory === key
                          ? 'border-indigo-500 bg-indigo-50 scale-105'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{emoji || "➖"}</span>
                        <span className="font-medium">{name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personality */}
              <div>
                <Label className="text-lg font-semibold mb-3">Personalidade</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(PERSONALITIES).map(([key, { name, emoji, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCharacter({ ...character, personality: key })}
                      className={`p-4 rounded-xl transition-all ${color} ${
                        character.personality === key
                          ? 'ring-4 ring-indigo-500 scale-105'
                          : 'hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{emoji}</span>
                        <span className="font-semibold">{name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Profile"))}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!character.name || createCharacterMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {createCharacterMutation.isPending ? "Salvando..." : "Criar Personagem"}
                </Button>
              </div>
            </form>

            {/* My Characters */}
            {myCharacters.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Meus Personagens ({myCharacters.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {myCharacters.map((char) => (
                    <div
                      key={char.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        char.is_active ? 'bg-indigo-50 border-2 border-indigo-500' : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-3xl">{char.avatar_emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{char.name}</p>
                        {char.is_active && (
                          <p className="text-xs text-indigo-600 font-medium">✓ Ativo</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}
