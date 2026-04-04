import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  Target,
  Rocket,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
  Code,
  Leaf,
  Palette,
  Scale,
  Microscope,
  Tractor,
  Plane,
  Waves,
  Shirt,
  Building2,
  Stethoscope
} from "lucide-react";

const SECTORS = {
  tecnologia: {
    name: "Tecnologia",
    icon: Code,
    color: "from-blue-500 to-cyan-600",
    description: "Inovação digital, IA, desenvolvimento",
    professions: [
      "Engenheiro de IA/Machine Learning",
      "Cientista de Dados",
      "Analista de Cibersegurança",
      "Desenvolvedor Full-Stack",
      "Engenheiro de Nuvem"
    ]
  },
  sustentabilidade: {
    name: "Sustentabilidade",
    icon: Leaf,
    color: "from-green-500 to-emerald-600",
    description: "Energia limpa, meio ambiente",
    professions: [
      "Engenheiro de Energias Renováveis",
      "Cientista Ambiental",
      "Consultor de Sustentabilidade",
      "Técnico em Instalação Fotovoltaica",
      "Engenheiro de Infraestrutura Verde"
    ]
  },
  cultura_criativo: {
    name: "Cultura & Criativo",
    icon: Palette,
    color: "from-purple-500 to-pink-600",
    description: "Design, conteúdo, experiências",
    professions: [
      "Designer UX/UI",
      "Especialista em Marketing Digital",
      "Criador de Conteúdo Digital",
      "Gerente de Comunidade Virtual",
      "Produtor de Experiências Imersivas (XR/VR)"
    ]
  },
  politica_juridico: {
    name: "Política & Jurídico",
    icon: Scale,
    color: "from-amber-500 to-orange-600",
    description: "Direito, políticas públicas, compliance",
    professions: [
      "Advogado/Consultor Jurídico em Tecnologia",
      "Analista de Políticas Públicas",
      "Gestor de Compliance",
      "Estrategista de Relações Governamentais",
      "Especialista em Privacidade de Dados"
    ]
  },
  genia_ciencia: {
    name: "Gênia (Ciência de Ponta)",
    icon: Microscope,
    color: "from-indigo-500 to-purple-600",
    description: "Pesquisa, inovação, ciência avançada",
    professions: [
      "Pesquisador em Computação Quântica",
      "Engenheiro de Robótica",
      "Especialista em Biotecnologia",
      "Cientista de Materiais Avançados",
      "Físico Teórico"
    ]
  },
  agronegocio: {
    name: "Agronegócio Digital",
    icon: Tractor,
    color: "from-lime-500 to-green-600",
    description: "AgriTech, agricultura 4.0",
    professions: [
      "Engenheiro Agrônomo Digital",
      "Especialista em Drones Agrícolas",
      "Analista de Agricultura de Precisão",
      "Desenvolvedor de Soluções AgriTech",
      "Gestor de Fazendas Inteligentes"
    ]
  },
  turismo: {
    name: "Turismo & Hospitalidade",
    icon: Plane,
    color: "from-sky-500 to-blue-600",
    description: "Turismo sustentável, experiências",
    professions: [
      "Gestor de Turismo Sustentável",
      "Especialista em Ecoturismo",
      "Designer de Experiências Turísticas",
      "Consultor de Hospitalidade Digital",
      "Curador de Viagens Personalizadas"
    ]
  },
  economia_mar: {
    name: "Economia do Mar",
    icon: Waves,
    color: "from-teal-500 to-cyan-600",
    description: "Oceanos, recursos marinhos",
    professions: [
      "Biólogo Marinho",
      "Engenheiro Naval",
      "Especialista em Aquicultura Sustentável",
      "Oceanógrafo",
      "Gestor de Recursos Marinhos"
    ]
  },
  moda_design: {
    name: "Moda & Design Sustentável",
    icon: Shirt,
    color: "from-pink-500 to-rose-600",
    description: "Moda ética, design consciente",
    professions: [
      "Designer de Moda Sustentável",
      "Especialista em Economia Circular",
      "Consultor de Moda Ética",
      "Estilista de Materiais Inovadores",
      "Gestor de Marca Consciente"
    ]
  },
  cidades_inteligentes: {
    name: "Cidades Inteligentes",
    icon: Building2,
    color: "from-slate-500 to-zinc-600",
    description: "Urbanismo, tecnologia urbana",
    professions: [
      "Urbanista Digital",
      "Engenheiro de IoT Urbano",
      "Especialista em Mobilidade Inteligente",
      "Arquiteto de Cidades Sustentáveis",
      "Analista de Dados Urbanos"
    ]
  },
  healthtech: {
    name: "HealthTech",
    icon: Stethoscope,
    color: "from-red-500 to-pink-600",
    description: "Tecnologia para saúde",
    professions: [
      "Desenvolvedor de Soluções em Saúde",
      "Especialista em Telemedicina",
      "Engenheiro Biomédico",
      "Analista de Dados Clínicos",
      "Designer de Dispositivos Médicos"
    ]
  }
};

const TEST_QUESTIONS = [
  {
    question: "Qual atividade mais te empolga?",
    options: [
      { text: "Programar e criar soluções tecnológicas", sectors: { tecnologia: 10, genia_ciencia: 5 } },
      { text: "Trabalhar com sustentabilidade e meio ambiente", sectors: { sustentabilidade: 10, economia_mar: 5 } },
      { text: "Criar conteúdo, design ou arte", sectors: { cultura_criativo: 10, moda_design: 5 } },
      { text: "Trabalhar com leis, políticas ou justiça", sectors: { politica_juridico: 10 } },
      { text: "Fazer pesquisa científica avançada", sectors: { genia_ciencia: 10, healthtech: 5 } },
      { text: "Inovar na agricultura e produção", sectors: { agronegocio: 10, sustentabilidade: 5 } }
    ]
  },
  {
    question: "Em qual ambiente você se sente melhor?",
    options: [
      { text: "Escritório de tecnologia ou startup", sectors: { tecnologia: 8, cidades_inteligentes: 5 } },
      { text: "Natureza, campo ou laboratório ambiental", sectors: { sustentabilidade: 8, agronegocio: 5, economia_mar: 5 } },
      { text: "Estúdio criativo ou agência", sectors: { cultura_criativo: 8, moda_design: 5 } },
      { text: "Tribunais, escritório de advocacia ou órgão público", sectors: { politica_juridico: 10 } },
      { text: "Laboratório de pesquisa ou universidade", sectors: { genia_ciencia: 10, healthtech: 5 } },
      { text: "Destinos turísticos ou hotéis", sectors: { turismo: 10 } }
    ]
  },
  {
    question: "Qual problema global te motiva mais a resolver?",
    options: [
      { text: "Transformação digital e acesso à tecnologia", sectors: { tecnologia: 10, cidades_inteligentes: 5 } },
      { text: "Crise climática e preservação ambiental", sectors: { sustentabilidade: 10, economia_mar: 5 } },
      { text: "Expressão cultural e democratização da arte", sectors: { cultura_criativo: 10 } },
      { text: "Desigualdade social e justiça", sectors: { politica_juridico: 10 } },
      { text: "Avanço científico e cura de doenças", sectors: { genia_ciencia: 10, healthtech: 10 } },
      { text: "Segurança alimentar e agricultura sustentável", sectors: { agronegocio: 10, sustentabilidade: 5 } }
    ]
  },
  {
    question: "Qual habilidade você mais domina?",
    options: [
      { text: "Lógica, programação e resolução de problemas", sectors: { tecnologia: 10, genia_ciencia: 5 } },
      { text: "Análise ambiental e pensamento sistêmico", sectors: { sustentabilidade: 8, economia_mar: 5 } },
      { text: "Criatividade e comunicação visual", sectors: { cultura_criativo: 10, moda_design: 5 } },
      { text: "Argumentação e análise crítica", sectors: { politica_juridico: 10 } },
      { text: "Pesquisa científica e experimentação", sectors: { genia_ciencia: 10, healthtech: 5 } },
      { text: "Gestão de pessoas e hospitalidade", sectors: { turismo: 10, cidades_inteligentes: 5 } }
    ]
  },
  {
    question: "Onde você se vê trabalhando daqui 5 anos?",
    options: [
      { text: "Em uma Big Tech ou startup inovadora", sectors: { tecnologia: 10 } },
      { text: "ONG ambiental ou empresa de energia limpa", sectors: { sustentabilidade: 10, economia_mar: 5 } },
      { text: "Agência criativa ou como freelancer criativo", sectors: { cultura_criativo: 10, moda_design: 5 } },
      { text: "Órgão governamental ou escritório de advocacia", sectors: { politica_juridico: 10 } },
      { text: "Centro de pesquisa ou universidade de prestígio", sectors: { genia_ciencia: 10, healthtech: 5 } },
      { text: "Empresa do agronegócio ou turismo", sectors: { agronegocio: 8, turismo: 8 } }
    ]
  }
];

export default function HyperfocusTestPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sectorScores, setSectorScores] = useState({});
  const [testComplete, setTestComplete] = useState(false);
  const [results, setResults] = useState(null);

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

  const saveDiscoveryMutation = useMutation({
    mutationFn: (data) => base44.entities.HyperfocusDiscovery.create(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['hyperfocusDiscovery'] });
      
      // Buscar jogo do setor descoberto e redirecionar automaticamente
      const games = await base44.entities.Game.filter({ category: results.primary_sector });
      
      if (games && games.length > 0) {
        setTimeout(() => {
          navigate(`${createPageUrl("GamePlayEducational")}?id=${games[0].id}`);
        }, 3000);
      } else {
        setTimeout(() => {
          navigate(createPageUrl("Games"));
        }, 3000);
      }
    },
  });

  const handleAnswer = (optionIndex) => {
    const question = TEST_QUESTIONS[currentQuestion];
    const selectedOption = question.options[optionIndex];
    
    const newScores = { ...sectorScores };
    Object.entries(selectedOption.sectors).forEach(([sector, points]) => {
      newScores[sector] = (newScores[sector] || 0) + points;
    });
    
    setSectorScores(newScores);

    if (currentQuestion < TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newScores);
    }
  };

  const calculateResults = (scores) => {
    const sortedSectors = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const primarySector = sortedSectors[0][0];
    const secondarySectors = sortedSectors.slice(1).map(([sector]) => sector);
    const topProfessions = SECTORS[primarySector]?.professions || [];

    const cognitiveStrengths = [];
    if (scores.tecnologia > 20) cognitiveStrengths.push("Lógica e Resolução de Problemas");
    if (scores.genia_ciencia > 20) cognitiveStrengths.push("Pensamento Científico");
    if (scores.cultura_criativo > 20) cognitiveStrengths.push("Criatividade");
    if (scores.sustentabilidade > 20) cognitiveStrengths.push("Pensamento Sistêmico");

    const discoveryData = {
      primary_sector: primarySector,
      secondary_sectors: secondarySectors,
      sector_scores: scores,
      top_professions: topProfessions,
      cognitive_strengths: cognitiveStrengths,
      test_completed_date: new Date().toISOString(),
      total_tests_taken: 1
    };

    setResults(discoveryData);
    setTestComplete(true);
    saveDiscoveryMutation.mutate(discoveryData);
  };

  if (testComplete && results) {
    const primarySectorData = SECTORS[results.primary_sector];
    const SectorIcon = primarySectorData.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br ${primarySectorData.color} rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <SectorIcon className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Seu Hiperfoco Descoberto!
            </h1>

            <div className="inline-block px-6 py-3 bg-gradient-to-r ${primarySectorData.color} rounded-2xl mb-6">
              <h2 className="text-3xl font-bold text-white">
                {primarySectorData.name}
              </h2>
            </div>

            <p className="text-xl text-gray-600 mb-8">
              {primarySectorData.description}
            </p>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                Top 5 Profissões para Você
              </h3>
              <div className="space-y-2">
                {primarySectorData.professions.map((prof, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-medium text-gray-900">{prof}</span>
                  </div>
                ))}
              </div>
            </div>

            {results.cognitive_strengths.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  Seus Pontos Fortes
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {results.cognitive_strengths.map((strength, idx) => (
                    <span key={idx} className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                      ✓ {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-4 border-2 border-yellow-300">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  🎮 Próximo Passo: Jogue e Aprenda!
                </h3>
                <p className="text-gray-700 text-center">
                  Você será direcionado automaticamente para um jogo educacional sobre <strong>{primarySectorData.name}</strong>!
                </p>
              </div>
              
              <Button
                disabled
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-lg py-6 opacity-90"
              >
                <Sparkles className="w-6 h-6 mr-2 animate-spin" />
                Preparando Seu Jogo...
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
              <p className="text-sm text-gray-500">
                Redirecionando automaticamente em 3 segundos...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Descubra Seu Hiperfoco
          </h1>
          <p className="text-xl text-gray-600">
            Identifique o setor onde você vai brilhar! ✨
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Pergunta {currentQuestion + 1} de {TEST_QUESTIONS.length}
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {Math.round(((currentQuestion + 1) / TEST_QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / TEST_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {TEST_QUESTIONS[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {TEST_QUESTIONS[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full p-5 text-left border-2 border-gray-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-gray-800 hover:shadow-lg transform hover:scale-[1.02] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-lg">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 Responda com honestidade para resultados mais precisos
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
