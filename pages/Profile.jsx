import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  User, 
  Mail, 
  MapPin,
  Settings,
  LogOut,
  Edit,
  Save,
  Globe,
  Brain,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Users,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);

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

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles.length > 0 ? profiles[0] : null;
    },
    enabled: !!user,
  });

  const { data: myCharacters = [] } = useQuery({
    queryKey: ['myCharacters'],
    queryFn: async () => {
      return await base44.entities.Character.filter({ created_by: user?.email });
    },
    enabled: !!user,
    initialData: [],
  });

  const activeCharacter = myCharacters.find(c => c.is_active);

  const setActiveCharacterMutation = useMutation({
    mutationFn: async (characterId) => {
      // Desativar todos
      for (const char of myCharacters) {
        if (char.is_active) {
          await base44.entities.Character.update(char.id, { is_active: false });
        }
      }
      // Ativar o selecionado
      await base44.entities.Character.update(characterId, { is_active: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCharacters'] });
    },
  });

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const handleRetakeAssessment = () => {
    navigate(createPageUrl("Onboarding"));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
          <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete seu Perfil
          </h2>
          <p className="text-gray-600 mb-6">
            Responda algumas perguntas para personalizar sua experiência e receber jogos recomendados!
          </p>
          <Link to={createPageUrl("Onboarding")}>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <Sparkles className="w-5 h-5 mr-2" />
              Começar Avaliação
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getCountryFlag = (country) => {
    const flags = {
      brasil: "🇧🇷",
      portugal: "🇵🇹",
      franca: "🇫🇷",
      italia: "🇮🇹",
      japao: "🇯🇵",
      eua: "🇺🇸",
      egito: "🇪🇬",
      india: "🇮🇳",
      china: "🇨🇳",
      mexico: "🇲🇽"
    };
    return flags[country] || "🌍";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          {activeCharacter ? (
            <>
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30 animate-bounce-slow">
                <span className="text-7xl">{activeCharacter.avatar_emoji}</span>
              </div>
              <p className="text-sm text-indigo-600 font-medium mb-2">
                Personagem Ativo: {activeCharacter.name}
              </p>
            </>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.display_name || user?.full_name || "Usuário"}
          </h2>
          <p className="text-gray-500 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            {user?.email}
          </p>
          <p className="text-2xl mt-2">
            {getCountryFlag(profile.country)}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-indigo-50 rounded-xl">
            <p className="text-2xl font-bold text-indigo-600">{profile.level || 1}</p>
            <p className="text-sm text-gray-600">Nível</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">{profile.total_points || 0}</p>
            <p className="text-sm text-gray-600">Pontos</p>
          </div>
          <div className="text-center p-4 bg-pink-50 rounded-xl">
            <p className="text-2xl font-bold text-pink-600">
              {myCharacters.length}
            </p>
            <p className="text-sm text-gray-600">Personagens</p>
          </div>
        </div>

        {/* Cognitive Profile */}
        {profile.cognitive_profile && (
          <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Perfil Cognitivo
              </h3>
              <button
                onClick={() => setShowDiagnosis(!showDiagnosis)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                {showDiagnosis ? (
                  <EyeOff className="w-4 h-4 text-gray-600" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            
            {showDiagnosis ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Atenção</p>
                    <p className="font-semibold capitalize">{profile.cognitive_profile.attention || 'N/A'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Memória</p>
                    <p className="font-semibold capitalize">{profile.cognitive_profile.memory || 'N/A'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Leitura</p>
                    <p className="font-semibold capitalize">{profile.cognitive_profile.reading || 'N/A'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Visual</p>
                    <p className="font-semibold capitalize">{profile.cognitive_profile.visual_thinking || 'N/A'}</p>
                  </div>
                </div>
                
                {profile.diagnosis && profile.diagnosis.length > 0 && !profile.diagnosis.includes("nenhum") && (
                  <div className="bg-white p-3 rounded-lg mt-3">
                    <p className="text-xs text-gray-500 mb-1">Diagnósticos</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.diagnosis.map((diag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium capitalize">
                          {diag === "dificuldade_fala" ? "Dificuldade de Fala" : diag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Clique no ícone para visualizar informações sensíveis 🔒
              </p>
            )}
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Accessibility Settings */}
        {profile.accessibility_settings && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">Recursos de Acessibilidade</h3>
            <div className="flex flex-wrap gap-2">
              {profile.accessibility_settings.dyslexia_font && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  ✓ Fonte para dislexia
                </span>
              )}
              {profile.accessibility_settings.high_contrast && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  ✓ Alto contraste
                </span>
              )}
              {profile.accessibility_settings.text_to_speech && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  ✓ Leitura em voz alta
                </span>
              )}
              {!profile.accessibility_settings.dyslexia_font && 
               !profile.accessibility_settings.high_contrast && 
               !profile.accessibility_settings.text_to_speech && (
                <span className="text-sm text-gray-500">Nenhum recurso ativado</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* My Characters Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Meus Personagens
          </h3>
          <Link to={createPageUrl("CharacterCreator")}>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo
            </Button>
          </Link>
        </div>

        {myCharacters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCharacters.map((char) => (
              <div
                key={char.id}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  char.is_active
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300 bg-gray-50'
                }`}
                onClick={() => !char.is_active && setActiveCharacterMutation.mutate(char.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    char.is_active ? 'bg-indigo-500 shadow-lg' : 'bg-gray-200'
                  }`}>
                    <span className="text-5xl">{char.avatar_emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{char.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{char.personality}</p>
                    {char.is_active && (
                      <span className="inline-block mt-2 px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-semibold">
                        ✓ Ativo nos Jogos
                      </span>
                    )}
                    {!char.is_active && (
                      <p className="text-xs text-gray-500 mt-2">
                        Clique para ativar
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Nenhum personagem criado
            </h3>
            <p className="text-gray-600 mb-6">
              Crie seu primeiro personagem para usar nos jogos!
            </p>
            <Link to={createPageUrl("CharacterCreator")}>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <Plus className="w-5 h-5 mr-2" />
                Criar Personagem
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-3">
        <h3 className="font-bold text-gray-900 mb-4">Ações Rápidas</h3>
        
        {/* Share Profile */}
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            🔗 Compartilhe Seu Perfil
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Compartilhe seu perfil público com recrutadores e parceiros!
          </p>
          <div className="flex gap-2">
            <Link to={`${createPageUrl("PublicProfile")}?user=${user?.email}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Ver Perfil Público
              </Button>
            </Link>
            <Button
              onClick={() => {
                const url = `${window.location.origin}${createPageUrl("PublicProfile")}?user=${user?.email}`;
                if (navigator.share) {
                  navigator.share({ title: `Perfil de ${profile?.display_name}`, url });
                } else {
                  navigator.clipboard.writeText(url);
                  alert("Link copiado!");
                }
              }}
              className="bg-indigo-600"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
        
        <button
          onClick={handleRetakeAssessment}
          className="w-full flex items-center gap-3 p-4 hover:bg-indigo-50 rounded-xl transition-colors text-left border border-gray-200"
        >
          <RefreshCw className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="font-medium text-gray-900">Refazer Avaliação</p>
            <p className="text-sm text-gray-500">Atualize seu perfil cognitivo</p>
          </div>
        </button>

        <Link to={createPageUrl("Settings")}>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left border border-gray-200">
            <Settings className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Configurações</p>
              <p className="text-sm text-gray-500">Acessibilidade e preferências</p>
            </div>
          </button>
        </Link>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-xl transition-colors text-left border border-red-200 text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <div>
            <p className="font-medium">Sair</p>
            <p className="text-sm text-red-500">Desconectar da conta</p>
          </div>
        </button>
      </div>
    </div>
  );
}
