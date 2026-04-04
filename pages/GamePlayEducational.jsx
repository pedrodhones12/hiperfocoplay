import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Star,
  Zap,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  Moon,
  Pause,
  Play,
  Save,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatedBackground, WalkingCharacter } from "../components/game/GameScene";
import { NarrationBox, ConstructionPuzzle, HistoricalCard, QuizChallenge } from "../components/game/EducationalGame";

// Dados dos jogos educacionais
const EDUCATIONAL_GAMES = {
  tecnologia: {
    type: "construction",
    intro: "Você está em 1940, na Inglaterra. A Segunda Guerra Mundial está acontecendo e você conhecerá Alan Turing, um gênio da matemática que mudará o mundo!",
    character: { name: "Alan Turing", avatar: "👨‍💻", role: "Matemático e Pai da Computação" },
    scene: "office",
    weather: "cloudy",
    stages: [
      {
        type: "narration",
        text: "Durante a guerra, precisamos decifrar códigos inimigos. Vamos construir uma máquina que possa processar informações automaticamente!"
      },
      {
        type: "construction",
        title: "Monte o Primeiro Computador",
        pieces: [
          {
            name: "Processador",
            emoji: "🖥️",
            x: 30,
            y: 40,
            options: [
              { emoji: "🖥️", label: "Processador", correct: true },
              { emoji: "📱", label: "Teclado", correct: false }
            ]
          },
          {
            name: "Memória",
            emoji: "💾",
            x: 50,
            y: 40,
            options: [
              { emoji: "💾", label: "Memória", correct: true },
              { emoji: "🖨️", label: "Impressora", correct: false }
            ]
          },
          {
            name: "Circuitos",
            emoji: "⚡",
            x: 40,
            y: 60,
            options: [
              { emoji: "⚡", label: "Circuitos", correct: true },
              { emoji: "🔌", label: "Tomada", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "O que torna um computador capaz de processar informações?",
        options: [
          "Sua capacidade de seguir instruções lógicas",
          "Apenas sua velocidade",
          "Somente sua memória",
          "Nenhuma das anteriores"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Incrível! Você ajudou a criar os fundamentos da computação moderna! Essa máquina salvou milhões de vidas decifrando códigos nazistas."
      }
    ]
  },
  sustentabilidade: {
    type: "construction",
    intro: "Bem-vindo a 1839, na França! Você conhecerá Edmond Becquerel, que descobrirá como transformar luz do sol em energia!",
    character: { name: "Edmond Becquerel", avatar: "🔬", role: "Físico Francês" },
    scene: "farm",
    weather: "sunny",
    stages: [
      {
        type: "narration",
        text: "Descobri que certos materiais geram eletricidade quando expostos à luz! Vamos construir o primeiro painel solar!"
      },
      {
        type: "construction",
        title: "Monte o Painel Solar",
        pieces: [
          {
            name: "Célula Fotovoltaica",
            emoji: "☀️",
            x: 40,
            y: 30,
            options: [
              { emoji: "☀️", label: "Célula Solar", correct: true },
              { emoji: "🔦", label: "Lanterna", correct: false }
            ]
          },
          {
            name: "Fios Condutores",
            emoji: "⚡",
            x: 40,
            y: 50,
            options: [
              { emoji: "⚡", label: "Fios", correct: true },
              { emoji: "🪢", label: "Corda", correct: false }
            ]
          },
          {
            name: "Bateria",
            emoji: "🔋",
            x: 40,
            y: 70,
            options: [
              { emoji: "🔋", label: "Bateria", correct: true },
              { emoji: "📦", label: "Caixa", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Por que a energia solar é importante para o planeta?",
        options: [
          "É limpa e não polui o ar",
          "É mais cara que outras energias",
          "Só funciona à noite",
          "Não pode ser armazenada"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Fantástico! Você aprendeu sobre energia solar! Hoje, painéis solares alimentam casas, escolas e até espaçonaves!"
      }
    ]
  },
  cultura_criativo: {
    type: "construction",
    intro: "Paris, 1892! Você conhecerá Émile Reynaud, inventor que criará o primeiro cinema de animação!",
    character: { name: "Émile Reynaud", avatar: "🎬", role: "Inventor e Artista" },
    scene: "school",
    weather: "sunny",
    stages: [
      {
        type: "narration",
        text: "Vamos criar imagens que se movem! É magia? Não! É ciência e arte juntas!"
      },
      {
        type: "construction",
        title: "Crie a Primeira Animação",
        pieces: [
          {
            name: "Desenho 1",
            emoji: "🎨",
            x: 25,
            y: 50,
            options: [
              { emoji: "🎨", label: "Primeiro quadro", correct: true },
              { emoji: "📄", label: "Papel em branco", correct: false }
            ]
          },
          {
            name: "Desenho 2",
            emoji: "✏️",
            x: 50,
            y: 50,
            options: [
              { emoji: "✏️", label: "Segundo quadro", correct: true },
              { emoji: "🖊️", label: "Caneta", correct: false }
            ]
          },
          {
            name: "Projetor",
            emoji: "📽️",
            x: 70,
            y: 50,
            options: [
              { emoji: "📽️", label: "Projetor", correct: true },
              { emoji: "📺", label: "TV", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Como funciona uma animação?",
        options: [
          "Muitas imagens passando rápido criam ilusão de movimento",
          "É uma única imagem que se move",
          "É feito com computador sempre",
          "Não precisa de desenhos"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Você criou a primeira animação! Isso revolucionou o cinema, desenhos animados e até os filmes que vemos hoje!"
      }
    ]
  },
  healthtech: {
    type: "construction",
    intro: "Londres, 1854! Você está com Florence Nightingale durante uma epidemia de cólera. Descubra como os dados salvam vidas!",
    character: { name: "Florence Nightingale", avatar: "🩺", role: "Enfermeira e Estatística" },
    scene: "hospital",
    weather: "cloudy",
    stages: [
      {
        type: "narration",
        text: "Pacientes estão morrendo! Mas percebi um padrão: a higiene das mãos faz diferença! Vamos provar isso com dados!"
      },
      {
        type: "construction",
        title: "Monte o Sistema de Saúde Preventiva",
        pieces: [
          {
            name: "Registro de Pacientes",
            emoji: "📋",
            x: 30,
            y: 40,
            options: [
              { emoji: "📋", label: "Prontuários", correct: true },
              { emoji: "📰", label: "Jornal", correct: false }
            ]
          },
          {
            name: "Análise de Dados",
            emoji: "📊",
            x: 50,
            y: 40,
            options: [
              { emoji: "📊", label: "Gráficos", correct: true },
              { emoji: "📝", label: "Caderno", correct: false }
            ]
          },
          {
            name: "Higiene",
            emoji: "🧼",
            x: 40,
            y: 60,
            options: [
              { emoji: "🧼", label: "Sabão", correct: true },
              { emoji: "💧", label: "Água suja", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Por que dados são importantes na saúde?",
        options: [
          "Ajudam a identificar padrões e prevenir doenças",
          "Apenas para decoração",
          "Não fazem diferença",
          "Só servem para contar pacientes"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Incrível! Com dados e higiene, reduzimos mortes em 90%! Isso criou a medicina moderna baseada em evidências!"
      }
    ]
  },
  agronegocio: {
    type: "construction",
    intro: "Vale do Silício da Agricultura, 1960s! Conheça Norman Borlaug, o homem que salvou 1 bilhão de vidas com ciência!",
    character: { name: "Norman Borlaug", avatar: "🌾", role: "Cientista Agrícola - Nobel da Paz" },
    scene: "farm",
    weather: "sunny",
    stages: [
      {
        type: "narration",
        text: "Milhões passam fome! Mas descobri: podemos criar plantas mais resistentes e produtivas usando ciência!"
      },
      {
        type: "construction",
        title: "Crie Sementes de Alto Rendimento",
        pieces: [
          {
            name: "Seleção Genética",
            emoji: "🧬",
            x: 30,
            y: 45,
            options: [
              { emoji: "🧬", label: "DNA das plantas", correct: true },
              { emoji: "🌱", label: "Planta comum", correct: false }
            ]
          },
          {
            name: "Fertilização Eficiente",
            emoji: "⚗️",
            x: 50,
            y: 45,
            options: [
              { emoji: "⚗️", label: "Nutrientes", correct: true },
              { emoji: "🪨", label: "Pedras", correct: false }
            ]
          },
          {
            name: "Irrigação Inteligente",
            emoji: "💧",
            x: 40,
            y: 65,
            options: [
              { emoji: "💧", label: "Água controlada", correct: true },
              { emoji: "☔", label: "Apenas chuva", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Como a Revolução Verde mudou a agricultura?",
        options: [
          "Aumentou produção alimentar e salvou milhões da fome",
          "Apenas mudou a cor das plantas",
          "Tornou tudo mais caro",
          "Não fez diferença"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Você ajudou a criar a Revolução Verde! A produção triplicou e salvamos 1 bilhão de pessoas da fome! Nobel da Paz 1970!"
      }
    ]
  },
  turismo: {
    type: "construction",
    intro: "Egito Antigo, 2560 a.C.! Você está ajudando Hemiunu a construir a Grande Pirâmide - a primeira maravilha do mundo!",
    character: { name: "Hemiunu", avatar: "🏛️", role: "Arquiteto Real" },
    scene: "city",
    weather: "sunny",
    stages: [
      {
        type: "narration",
        text: "O Faraó quer um monumento eterno! Vamos criar algo que pessoas visitarão por 4.500 anos!"
      },
      {
        type: "construction",
        title: "Construa a Pirâmide de Gizé",
        pieces: [
          {
            name: "Base",
            emoji: "🟫",
            x: 40,
            y: 70,
            options: [
              { emoji: "🟫", label: "Fundação sólida", correct: true },
              { emoji: "🏖️", label: "Areia solta", correct: false }
            ]
          },
          {
            name: "Blocos de Pedra",
            emoji: "🪨",
            x: 40,
            y: 50,
            options: [
              { emoji: "🪨", label: "2 milhões de blocos", correct: true },
              { emoji: "🧱", label: "Tijolos comuns", correct: false }
            ]
          },
          {
            name: "Topo",
            emoji: "⭐",
            x: 40,
            y: 30,
            options: [
              { emoji: "⭐", label: "Ponta dourada", correct: true },
              { emoji: "🎩", label: "Chapéu", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Por que as pirâmides atraem turistas até hoje?",
        options: [
          "São monumentos históricos incríveis de engenharia antiga",
          "Têm poderes mágicos",
          "São hotéis",
          "Ninguém sabe"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Perfeito! A pirâmide receberá 14 milhões de visitantes por ano 4.500 anos depois! Você criou o turismo histórico!"
      }
    ]
  },
  economia_mar: {
    type: "construction",
    intro: "Portugal, Século XV! Você está com o Infante D. Henrique iniciando a Era dos Descobrimentos e o comércio marítimo global!",
    character: { name: "Infante D. Henrique", avatar: "⛵", role: "Navegador" },
    scene: "city",
    weather: "cloudy",
    stages: [
      {
        type: "narration",
        text: "O mundo é maior que imaginamos! Vamos criar rotas marítimas e conectar continentes pelo comércio!"
      },
      {
        type: "construction",
        title: "Monte a Rota Marítima de Comércio",
        pieces: [
          {
            name: "Caravela",
            emoji: "⛵",
            x: 25,
            y: 50,
            options: [
              { emoji: "⛵", label: "Navio ágil", correct: true },
              { emoji: "🛶", label: "Canoa", correct: false }
            ]
          },
          {
            name: "Bússola",
            emoji: "🧭",
            x: 50,
            y: 45,
            options: [
              { emoji: "🧭", label: "Navegação", correct: true },
              { emoji: "🎯", label: "Alvo", correct: false }
            ]
          },
          {
            name: "Especiarias",
            emoji: "🌶️",
            x: 70,
            y: 50,
            options: [
              { emoji: "🌶️", label: "Produtos valiosos", correct: true },
              { emoji: "🪨", label: "Pedras", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Como o comércio marítimo mudou o mundo?",
        options: [
          "Conectou continentes e criou a economia global",
          "Apenas transportava água",
          "Não mudou nada",
          "Só servia para pescar"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Fantástico! Você iniciou a globalização! 70% do comércio mundial ainda usa o mar. A Economia Azul vale trilhões!"
      }
    ]
  },
  moda_design: {
    type: "construction",
    intro: "Paris, 1858! Conheça Charles Frederick Worth, criador da alta costura e do conceito de 'estilista'!",
    character: { name: "Charles Worth", avatar: "👗", role: "Pai da Alta Costura" },
    scene: "city",
    weather: "sunny",
    stages: [
      {
        type: "narration",
        text: "Roupa não é só tecido - é arte! Vamos criar o primeiro desfile de moda e a indústria fashion!"
      },
      {
        type: "construction",
        title: "Crie a Primeira Coleção de Alta Costura",
        pieces: [
          {
            name: "Sketch do Design",
            emoji: "✏️",
            x: 30,
            y: 45,
            options: [
              { emoji: "✏️", label: "Desenho original", correct: true },
              { emoji: "📄", label: "Papel em branco", correct: false }
            ]
          },
          {
            name: "Tecidos Premium",
            emoji: "🧵",
            x: 50,
            y: 45,
            options: [
              { emoji: "🧵", label: "Seda e veludo", correct: true },
              { emoji: "📦", label: "Caixa de papelão", correct: false }
            ]
          },
          {
            name: "Modelo na Passarela",
            emoji: "💃",
            x: 40,
            y: 65,
            options: [
              { emoji: "💃", label: "Desfile", correct: true },
              { emoji: "🚶", label: "Andar normal", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Por que a moda é importante na economia?",
        options: [
          "É uma indústria trilionária que gera milhões de empregos",
          "Só serve para gastar dinheiro",
          "Não tem importância",
          "Apenas para famosos"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Maravilhoso! Você criou a indústria da moda! Hoje vale US$ 3 trilhões e emprega 300 milhões de pessoas!"
      }
    ]
  },
  cidades_inteligentes: {
    type: "construction",
    intro: "Barcelona, 2011! Você está criando a primeira Smart City - onde tecnologia melhora a vida de todos!",
    character: { name: "Joan Clos", avatar: "🏙️", role: "Urbanista" },
    scene: "city",
    weather: "sunny",
    stages: [
      {
        type: "narration",
        text: "E se a cidade pudesse 'pensar'? Sensores, dados e IA podem tornar tudo mais eficiente e sustentável!"
      },
      {
        type: "construction",
        title: "Construa a Cidade Inteligente",
        pieces: [
          {
            name: "Sensores IoT",
            emoji: "📡",
            x: 30,
            y: 40,
            options: [
              { emoji: "📡", label: "Internet das Coisas", correct: true },
              { emoji: "📻", label: "Rádio antigo", correct: false }
            ]
          },
          {
            name: "Energia Solar",
            emoji: "☀️",
            x: 50,
            y: 35,
            options: [
              { emoji: "☀️", label: "Painéis solares", correct: true },
              { emoji: "⚡", label: "Carvão", correct: false }
            ]
          },
          {
            name: "Transporte Inteligente",
            emoji: "🚇",
            x: 40,
            y: 60,
            options: [
              { emoji: "🚇", label: "Metrô conectado", correct: true },
              { emoji: "🐎", label: "Cavalo", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "O que torna uma cidade 'inteligente'?",
        options: [
          "Uso de tecnologia e dados para melhorar serviços e qualidade de vida",
          "Apenas ter prédios altos",
          "Ser cara para morar",
          "Ter muitos carros"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Perfeito! Barcelona economiza 75 milhões/ano! Até 2050, 70% da população viverá em cidades inteligentes!"
      }
    ]
  },
  politica_juridico: {
    type: "construction",
    intro: "Atenas, 508 a.C.! Você está com Clístenes criando a primeira democracia da história!",
    character: { name: "Clístenes", avatar: "⚖️", role: "Pai da Democracia" },
    scene: "city",
    weather: "sunny",
    stages: [
      {
        type: "narration",
        text: "Todo cidadão tem direito a voz! Vamos criar um sistema onde o povo decide seu futuro!"
      },
      {
        type: "construction",
        title: "Monte o Sistema Democrático",
        pieces: [
          {
            name: "Assembleia Popular",
            emoji: "🗳️",
            x: 35,
            y: 45,
            options: [
              { emoji: "🗳️", label: "Voto do povo", correct: true },
              { emoji: "👑", label: "Rei decide tudo", correct: false }
            ]
          },
          {
            name: "Leis Escritas",
            emoji: "📜",
            x: 55,
            y: 45,
            options: [
              { emoji: "📜", label: "Constituição", correct: true },
              { emoji: "🗡️", label: "Espada", correct: false }
            ]
          },
          {
            name: "Tribunal de Justiça",
            emoji: "⚖️",
            x: 45,
            y: 65,
            options: [
              { emoji: "⚖️", label: "Julgamento justo", correct: true },
              { emoji: "⛓️", label: "Prisão aleatória", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Por que a democracia é importante?",
        options: [
          "Garante que o povo participe das decisões do país",
          "É apenas um nome bonito",
          "Não faz diferença",
          "Serve só para votar"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Extraordinário! Você criou a democracia! Hoje, 60% da população mundial vive em democracias!"
      }
    ]
  },
  genia_ciencia: {
    type: "construction",
    intro: "Paris, 1898! Marie Curie está prestes a descobrir a radioatividade e ganhar 2 Nobel - único a conseguir em áreas diferentes!",
    character: { name: "Marie Curie", avatar: "🔬", role: "Física e Química" },
    scene: "office",
    weather: "cloudy",
    stages: [
      {
        type: "narration",
        text: "Esses minerais brilham no escuro! Deve haver uma energia invisível que ainda não conhecemos!"
      },
      {
        type: "construction",
        title: "Descubra a Radioatividade",
        pieces: [
          {
            name: "Minério de Urânio",
            emoji: "⚛️",
            x: 30,
            y: 50,
            options: [
              { emoji: "⚛️", label: "Elemento radioativo", correct: true },
              { emoji: "🪨", label: "Pedra comum", correct: false }
            ]
          },
          {
            name: "Instrumentos de Medição",
            emoji: "📏",
            x: 50,
            y: 45,
            options: [
              { emoji: "📏", label: "Eletrômetro", correct: true },
              { emoji: "📱", label: "Celular", correct: false }
            ]
          },
          {
            name: "Laboratório",
            emoji: "🧪",
            x: 40,
            y: 65,
            options: [
              { emoji: "🧪", label: "Equipamento científico", correct: true },
              { emoji: "🍳", label: "Cozinha", correct: false }
            ]
          }
        ]
      },
      {
        type: "quiz",
        question: "Qual o impacto da descoberta da radioatividade?",
        options: [
          "Revolucionou medicina, energia e nossa compreensão da matéria",
          "Não teve impacto",
          "Só serviu para bombas",
          "Foi um erro"
        ],
        correctAnswer: 0
      },
      {
        type: "narration",
        text: "Brilhante! Você descobriu rádio e polônio! Tratamentos de câncer, energia nuclear e raios-X salvam milhões hoje!"
      }
    ]
  }
};

export default function GamePlayEducationalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get('id');

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [moduleComplete, setModuleComplete] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);

  // Accessibility settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    textToSpeech: true,
    subtitles: true,
    highContrast: false,
    contrastMode: "normal",
    audioFeedback: true,
    audioVolume: 0.7,
    fontSize: "media",
    animationSpeed: "normal"
  });

  // Load user
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

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const games = await base44.entities.Game.list();
      return games.find(g => g.id === gameId);
    },
    enabled: !!gameId,
  });

  // Get user's active character
  const { data: activeCharacter } = useQuery({
    queryKey: ['activeCharacter'],
    queryFn: async () => {
      const characters = await base44.entities.Character.filter({ 
        created_by: user?.email,
        is_active: true
      });
      return characters[0];
    },
    enabled: !!user,
  });

  // Load accessibility settings from user profile
  useEffect(() => {
    if (profile?.accessibility_settings) {
      setAccessibilitySettings({
        textToSpeech: profile.accessibility_settings.text_to_speech || false,
        subtitles: true,
        highContrast: profile.accessibility_settings.high_contrast || false,
        contrastMode: profile.accessibility_settings.contrast_mode || "normal",
        audioFeedback: profile.accessibility_settings.audio_feedback !== undefined ? profile.accessibility_settings.audio_feedback : true,
        audioVolume: profile.accessibility_settings.audio_feedback_volume || 0.7,
        fontSize: profile.accessibility_settings.font_size || "media",
        animationSpeed: profile.accessibility_settings.animation_speed || "normal"
      });
    }
  }, [profile]);

  // Play audio feedback
  const playAudioFeedback = (type) => {
    if (!accessibilitySettings.audioFeedback) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.value = accessibilitySettings.audioVolume;
    
    if (type === 'success') {
      oscillator.frequency.value = 523.25; // C5
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);
    } else if (type === 'error') {
      oscillator.frequency.value = 246.94; // B3
      oscillator.start();
      setTimeout(() => oscillator.stop(), 150);
    } else if (type === 'click') {
      oscillator.frequency.value = 440; // A4
      oscillator.start();
      setTimeout(() => oscillator.stop(), 50);
    }
  };

  const eduGame = game ? EDUCATIONAL_GAMES[game.category] : null;
  
  const displayCharacter = activeCharacter ? {
    name: activeCharacter.name,
    role: "Seu Personagem",
    avatar: activeCharacter.avatar_emoji
  } : eduGame?.character;

  // Load saved progress
  const { data: savedProgress } = useQuery({
    queryKey: ['gameProgress', gameId],
    queryFn: async () => {
      const progress = await base44.entities.GameProgress.filter({ 
        created_by: user?.email,
        game_id: gameId
      });
      return progress[0];
    },
    enabled: !!user && !!gameId,
  });

  // Apply saved progress on load
  useEffect(() => {
    if (savedProgress && !gameStarted) {
      setCurrentStage(savedProgress.current_stage || 0);
      setScore(savedProgress.score || 0);
    }
  }, [savedProgress, gameStarted]);

  // Auto-save mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (data) => {
      if (savedProgress?.id) {
        return await base44.entities.GameProgress.update(savedProgress.id, data);
      } else {
        return await base44.entities.GameProgress.create({
          game_id: gameId,
          game_title: game.title,
          current_stage: currentStage,
          score: score,
          completed: false,
          ...data
        });
      }
    },
    onSuccess: () => {
      setLastSaveTime(new Date());
      queryClient.invalidateQueries({ queryKey: ['gameProgress', gameId] });
    }
  });

  // Auto-save every stage change
  useEffect(() => {
    if (gameStarted && !showHistory) {
      saveProgressMutation.mutate({
        current_stage: currentStage,
        score: score,
        last_played: new Date().toISOString()
      });
    }
  }, [currentStage, score]);

  const startGame = () => {
    setGameStarted(true);
    if (savedProgress) {
      playAudioFeedback('success');
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    playAudioFeedback('click');
  };

  const saveManually = () => {
    saveProgressMutation.mutate({
      current_stage: currentStage,
      score: score,
      last_played: new Date().toISOString()
    });
    playAudioFeedback('success');
  };

  const handleStageComplete = () => {
    playAudioFeedback('success');
    
    // Check if this completes a module (every 2 stages = 1 module)
    const isModuleComplete = (currentStage + 1) % 2 === 0;
    
    if (currentStage < eduGame.stages.length - 1) {
      setScore(score + 10);
      
      if (isModuleComplete) {
        setModuleComplete(true);
        // Show module quiz after a delay
        setTimeout(() => {
          setModuleComplete(false);
          setCurrentStage(currentStage + 1);
        }, 2000);
      } else {
        setCurrentStage(currentStage + 1);
      }
    } else {
      setScore(score + 20);
      setShowHistory(true);
      // Mark game as completed
      saveProgressMutation.mutate({
        current_stage: currentStage,
        score: score + 20,
        completed: true,
        last_played: new Date().toISOString()
      });
    }
  };

  const handleQuizAnswer = (correct) => {
    setShowQuizResult(true);
    
    if (correct) {
      setScore(score + 15);
      setQuizFeedback({
        type: 'success',
        message: '✓ Correto! Você acertou!',
        color: 'green'
      });
      playAudioFeedback('success');
    } else {
      setQuizFeedback({
        type: 'error',
        message: '✗ Ops! Tente revisar o conteúdo',
        color: 'red'
      });
      playAudioFeedback('error');
    }
    
    setTimeout(() => {
      setShowQuizResult(false);
      setQuizFeedback(null);
      handleStageComplete();
    }, 2500);
  };

  const handleGameComplete = () => {
    // Save progress
    navigate(createPageUrl("Games"));
  };

  if (isLoading || !game || !eduGame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando jogo educativo...</p>
        </div>
      </div>
    );
  }

  const currentStageData = eduGame.stages[currentStage];

  const getFontSizeClass = () => {
    switch (accessibilitySettings.fontSize) {
      case 'pequena': return 'text-sm';
      case 'media': return 'text-base';
      case 'grande': return 'text-lg';
      case 'extra_grande': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getContrastClass = () => {
    switch (accessibilitySettings.contrastMode) {
      case 'dark': return 'contrast-dark';
      case 'light': return 'contrast-light';
      case 'blue_yellow': return 'contrast-blue-yellow';
      case 'yellow_black': return 'contrast-yellow-black';
      default: return '';
    }
  };

  const getAnimationSpeedClass = () => {
    switch (accessibilitySettings.animationSpeed) {
      case 'lenta': return 'animation-slow';
      case 'rapida': return 'animation-fast';
      default: return '';
    }
  };

  return (
    <div className={`min-h-screen w-full relative ${getFontSizeClass()} ${getContrastClass()} ${getAnimationSpeedClass()}`}>
      {/* Background - z-0 */}
      <div className="fixed inset-0 w-full h-full z-0">
        <AnimatedBackground weather={eduGame.weather} scene={eduGame.scene} />
      </div>

      {/* HUD - z-40 */}
      <div className="sticky top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-gradient-to-b from-black/20 to-transparent">
        <button
          onClick={() => navigate(createPageUrl("Games"))}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:bg-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
        
        <div className="flex items-center gap-3">
          {/* Score */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>

          {/* Pause/Play & Save */}
          {gameStarted && !showHistory && (
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg flex items-center gap-2">
              <button
                onClick={togglePause}
                className={`p-2 rounded-lg transition-all ${isPaused ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
                title={isPaused ? 'Continuar' : 'Pausar'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={saveManually}
                className="p-2 rounded-lg transition-all bg-blue-500 text-white hover:bg-blue-600"
                title="Salvar progresso"
              >
                <Save className="w-4 h-4" />
              </button>
              {lastSaveTime && (
                <span className="text-xs text-gray-600 ml-1">
                  Salvo {new Date(lastSaveTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}

          {/* Accessibility */}
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg flex items-center gap-2">
            <button
              onClick={() => setAccessibilitySettings({...accessibilitySettings, textToSpeech: !accessibilitySettings.textToSpeech})}
              className={`p-2 rounded-lg transition-all ${accessibilitySettings.textToSpeech ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
              title="Leitura em voz alta"
            >
              {accessibilitySettings.textToSpeech ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setAccessibilitySettings({...accessibilitySettings, highContrast: !accessibilitySettings.highContrast})}
              className={`p-2 rounded-lg transition-all ${accessibilitySettings.highContrast ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
              title="Alto contraste"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress - z-40 */}
      {gameStarted && !showHistory && (
        <div className="relative z-40 px-4 pb-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Etapa {currentStage + 1}/{eduGame.stages.length}</span>
              <span className="font-bold text-indigo-600">
                {Math.round(((currentStage + 1) / eduGame.stages.length) * 100)}%
              </span>
            </div>
            <Progress value={((currentStage + 1) / eduGame.stages.length) * 100} className="h-2" />
          </div>
        </div>
      )}

      {/* Character - z-10 */}
      {gameStarted && displayCharacter && !showHistory && (
        <div className="fixed bottom-8 left-4 z-10 pointer-events-none hidden md:block">
          <WalkingCharacter
            avatar={displayCharacter.avatar}
            name={displayCharacter.name}
            position="left"
            isWalking={false}
          />
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && gameStarted && !showHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md">
            <Pause className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Jogo Pausado</h2>
            <p className="text-gray-600 mb-6">
              Seu progresso está salvo automaticamente. Volte quando estiver pronto!
            </p>
            <div className="space-y-3">
              <Button
                onClick={togglePause}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-lg py-4"
              >
                <Play className="w-5 h-5 mr-2" />
                Continuar Jogando
              </Button>
              <Button
                onClick={() => navigate(createPageUrl("Games"))}
                variant="outline"
                className="w-full"
              >
                Sair do Jogo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Module Complete Celebration */}
      {moduleComplete && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600/90 to-pink-600/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md transform animate-in zoom-in duration-500">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Módulo Completo!</h2>
            <p className="text-gray-600 mb-4">
              Você dominou esta etapa do aprendizado!
            </p>
            <div className="flex items-center justify-center gap-2 text-yellow-600">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-2xl font-bold">+10 pontos</span>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Feedback Overlay */}
      {showQuizResult && quizFeedback && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className={`bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md transform animate-in zoom-in duration-300 border-4 ${
            quizFeedback.type === 'success' ? 'border-green-500' : 'border-red-500'
          }`}>
            <div className="text-6xl mb-4">
              {quizFeedback.type === 'success' ? (
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
              ) : (
                <XCircle className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
              )}
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${
              quizFeedback.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {quizFeedback.message}
            </h2>
            {quizFeedback.type === 'success' && (
              <div className="flex items-center justify-center gap-2 text-yellow-600 mt-4">
                <Star className="w-6 h-6 fill-current" />
                <span className="text-xl font-bold">+15 pontos</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Content - z-30 */}
      <div className="relative z-30 min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          {!gameStarted ? (
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
              <div className="text-8xl mb-4">{displayCharacter?.avatar || eduGame.character.avatar}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.title}</h1>
              <p className="text-gray-600 mb-4">{game.description}</p>
              
              <div className="bg-amber-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
                <p className="text-sm text-amber-900 font-medium">
                  📚 {eduGame.intro}
                </p>
              </div>

              {savedProgress && savedProgress.current_stage > 0 && (
                <div className="bg-blue-50 rounded-2xl p-4 mb-6 border-2 border-blue-200">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    💾 Progresso Salvo Encontrado!
                  </p>
                  <p className="text-xs text-blue-700">
                    Etapa {savedProgress.current_stage + 1} • {savedProgress.score} pontos
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                  🎓 Educativo
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  ♿ Acessível
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  🗣️ Narração
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  💾 Auto-Save
                </span>
              </div>

              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-lg px-8 py-6"
              >
                {savedProgress && savedProgress.current_stage > 0 ? 'Continuar Aventura' : 'Começar Aventura Histórica'}
              </Button>
            </div>
          ) : showHistory ? (
            <HistoricalCard
              historicalContext={game.historical_context}
              onContinue={handleGameComplete}
            />
          ) : (
            <>
              {currentStageData.type === 'narration' && (
                <NarrationBox
                  text={currentStageData.text}
                  onContinue={handleStageComplete}
                  autoRead={accessibilitySettings.textToSpeech}
                />
              )}

              {currentStageData.type === 'construction' && (
                <ConstructionPuzzle
                  title={currentStageData.title}
                  pieces={currentStageData.pieces}
                  onComplete={handleStageComplete}
                />
              )}

              {currentStageData.type === 'quiz' && (
                <QuizChallenge
                  question={currentStageData.question}
                  options={currentStageData.options}
                  correctAnswer={currentStageData.correctAnswer}
                  onAnswer={handleQuizAnswer}
                />
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        /* Contrast Modes */
        .contrast-dark {
          background: #000;
          color: #FFF;
        }
        .contrast-dark .bg-white {
          background: #1a1a1a !important;
          color: #FFF !important;
        }
        .contrast-dark .text-gray-900,
        .contrast-dark .text-gray-800,
        .contrast-dark .text-gray-700,
        .contrast-dark .text-gray-600 {
          color: #FFF !important;
        }

        .contrast-light {
          filter: brightness(1.3) contrast(1.5);
        }
        .contrast-light .bg-white {
          background: #FFF !important;
          border: 2px solid #000 !important;
        }

        .contrast-blue-yellow {
          background: #003366;
          color: #FFFF00;
        }
        .contrast-blue-yellow .bg-white {
          background: #003366 !important;
          color: #FFFF00 !important;
          border: 2px solid #FFFF00 !important;
        }
        .contrast-blue-yellow .text-gray-900,
        .contrast-blue-yellow .text-gray-800,
        .contrast-blue-yellow .text-gray-700,
        .contrast-blue-yellow .text-gray-600 {
          color: #FFFF00 !important;
        }

        .contrast-yellow-black {
          background: #FFFF00;
          color: #000;
        }
        .contrast-yellow-black .bg-white {
          background: #FFFF00 !important;
          color: #000 !important;
          border: 3px solid #000 !important;
        }
        .contrast-yellow-black .text-gray-900,
        .contrast-yellow-black .text-gray-800,
        .contrast-yellow-black .text-gray-700,
        .contrast-yellow-black .text-gray-600 {
          color: #000 !important;
        }

        /* Animation Speeds */
        .animation-slow * {
          animation-duration: 1.5s !important;
          transition-duration: 0.6s !important;
        }

        .animation-fast * {
          animation-duration: 0.3s !important;
          transition-duration: 0.15s !important;
        }

        /* Font Size Adjustments */
        .text-xl .text-sm { font-size: 1rem !important; }
        .text-xl .text-base { font-size: 1.25rem !important; }
        .text-xl .text-lg { font-size: 1.5rem !important; }
        .text-xl .text-xl { font-size: 1.75rem !important; }
        .text-xl .text-2xl { font-size: 2rem !important; }
      `}</style>
    </div>
  );
}
