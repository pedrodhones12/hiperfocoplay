import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Star,
  Zap,
  Brain,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatedBackground, WalkingCharacter, DialogueBubble, GameChoices } from "../components/game/GameScene";

// Confetti Component
const ConfettiExplosion = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 5
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            animationDelay: `${piece.animationDelay}s`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Game scenarios
const GAME_SCENARIOS = {
  "comercio": {
    character: { name: "Maria", role: "Dona do Café", avatar: "☕" },
    scene: "cafe",
    weather: "sunny",
    story: "Bem-vindo ao meu café! Estou começando meu negócio e preciso de ajuda para tomar decisões importantes.",
    challenges: [
      {
        dialogue: "Um cliente frequente está reclamando que o café está frio. Isso pode arruinar minha reputação!",
        options: [
          { text: "Pedir desculpas e oferecer novo café imediatamente", points: 10, feedback: "Perfeito! O cliente ficou satisfeito e voltará sempre! Ele até trouxe amigos!" },
          { text: "Explicar que é assim que servimos", points: 0, feedback: "O cliente saiu insatisfeito e postou uma avaliação negativa..." },
          { text: "Oferecer desconto no próximo pedido", points: 5, feedback: "Boa tentativa, mas o cliente queria solução imediata." },
          { text: "Treinar equipe sobre temperatura ideal", points: 8, feedback: "Excelente visão de longo prazo! Isso evitará problemas futuros." }
        ]
      },
      {
        dialogue: "Tenho R$ 1000 para investir no negócio. Preciso escolher com sabedoria!",
        options: [
          { text: "Comprar máquina de café melhor", points: 10, feedback: "Investimento perfeito! A qualidade do café aumentou muito!" },
          { text: "Fazer campanha de marketing", points: 8, feedback: "Bom! Mais clientes estão chegando!" },
          { text: "Guardar para emergências", points: 5, feedback: "Seguro, mas perdeu oportunidade de crescer agora." },
          { text: "Contratar mais funcionários", points: 7, feedback: "Bom para atendimento! O serviço ficou mais rápido." }
        ]
      },
      {
        dialogue: "Um fornecedor oferece desconto de 30% mas quer pagamento adiantado de 3 meses...",
        options: [
          { text: "Aceitar se tiver capital de giro suficiente", points: 10, feedback: "Decisão inteligente! Economizou muito mantendo o caixa saudável!" },
          { text: "Recusar, muito arriscado", points: 5, feedback: "Seguro, mas perdeu uma boa economia." },
          { text: "Negociar pagamento de 2 meses", points: 8, feedback: "Ótima negociação! Conseguiu desconto com menos risco!" },
          { text: "Aceitar sem analisar caixa", points: 0, feedback: "Perigoso! O café ficou sem dinheiro para operações..." }
        ]
      }
    ]
  },
  "tecnologia": {
    character: { name: "Lucas", role: "Desenvolvedor", avatar: "💻" },
    scene: "office",
    weather: "cloudy",
    story: "E aí! Estou desenvolvendo um app incrível e preciso da sua ajuda com alguns desafios de lógica.",
    challenges: [
      {
        dialogue: "Precisamos ordenar uma lista gigante de dados. Qual algoritmo usar?",
        options: [
          { text: "Bubble Sort", points: 5, feedback: "Funciona... mas o app travou com muitos dados!" },
          { text: "Quick Sort", points: 10, feedback: "Excelente! O app ficou super rápido! Os usuários adoraram!" },
          { text: "Selection Sort", points: 6, feedback: "Razoável, mas não é o mais eficiente." },
          { text: "Não ordenar", points: 0, feedback: "O app ficou caótico e os usuários reclamaram!" }
        ]
      },
      {
        dialogue: "O app está lentíssimo! Usuários estão reclamando nas reviews...",
        options: [
          { text: "Investigar queries do banco", points: 10, feedback: "Encontrou o problema! Era isso mesmo! App voando agora!" },
          { text: "Redesenhar interface", points: 5, feedback: "Ficou bonito mas continua lento..." },
          { text: "Otimizar imagens", points: 7, feedback: "Ajudou um pouco, mas o problema persiste." },
          { text: "Reiniciar servidor", points: 0, feedback: "Problema temporário... voltou depois!" }
        ]
      },
      {
        dialogue: "Bug crítico! Sistema de pagamento falhou para alguns usuários!",
        options: [
          { text: "Reproduzir o bug primeiro", points: 10, feedback: "Perfeito! Encontrou e corrigiu! Salvou a empresa!" },
          { text: "Corrigir sem testar", points: 0, feedback: "Criou mais bugs! Sistema parou completamente!" },
          { text: "Ignorar se poucos relataram", points: 0, feedback: "O bug se espalhou! Prejuízo enorme!" },
          { text: "Criar testes automatizados", points: 8, feedback: "Ótimo! Agora bugs são detectados antes!" }
        ]
      }
    ]
  },
  "agricultura": {
    character: { name: "Ana", role: "Agricultora", avatar: "🌱" },
    scene: "farm",
    weather: "sunny",
    story: "Olá! Minha fazenda orgânica precisa de boas decisões. Vamos trabalhar juntos?",
    challenges: [
      {
        dialogue: "É época de plantar tomates. Quando devo começar?",
        options: [
          { text: "Início da primavera", points: 10, feedback: "Perfeito! Clima ideal! Colheita abundante!" },
          { text: "Meio do verão", points: 5, feedback: "Funcionou, mas produção foi menor..." },
          { text: "Inverno", points: 0, feedback: "Muito frio! As plantas morreram..." },
          { text: "Qualquer época", points: 0, feedback: "Plantou no momento errado, perdeu tudo!" }
        ]
      },
      {
        dialogue: "As plantas estão com folhas amarelas! O que fazer?",
        options: [
          { text: "Adubar o solo", points: 10, feedback: "Exato! Plantas voltaram verdes e saudáveis!" },
          { text: "Diminuir água", points: 8, feedback: "Ajudou! Era excesso de água mesmo!" },
          { text: "Ignorar, é normal", points: 0, feedback: "Plantas morreram... prejuízo grande!" },
          { text: "Dar mais sol", points: 5, feedback: "Melhorou um pouco, mas não resolveu." }
        ]
      },
      {
        dialogue: "Como tornar a fazenda mais sustentável?",
        options: [
          { text: "Compostagem e rotação", points: 10, feedback: "Perfeito! Solo ficou rico e produtivo!" },
          { text: "Usar agrotóxicos", points: 0, feedback: "Contaminou o solo e perdeu certificação orgânica!" },
          { text: "Irrigação inteligente", points: 8, feedback: "Ótimo! Economizou 50% de água!" },
          { text: "Monocultura", points: 0, feedback: "Solo esgotou! Produção caiu drasticamente!" }
        ]
      }
    ]
  },
  "saude": {
    character: { name: "Dr. Silva", role: "Médico", avatar: "🩺" },
    scene: "hospital",
    weather: "cloudy",
    story: "Bem-vindo à minha clínica! Hoje temos casos que precisam do seu raciocínio.",
    challenges: [
      {
        dialogue: "Paciente com febre alta e dor de cabeça chegou na emergência!",
        options: [
          { text: "Fazer anamnese completa", points: 10, feedback: "Correto! Descobriu uma infecção grave a tempo!" },
          { text: "Prescrever antibiótico já", points: 0, feedback: "Paciente teve reação alérgica!" },
          { text: "Pedir todos os exames", points: 5, feedback: "Gastou muito e demorou... poderia ser mais eficiente." },
          { text: "Mandar para casa", points: 0, feedback: "Paciente voltou em estado grave!" }
        ]
      },
      {
        dialogue: "Sala de espera lotada! Como organizar melhor?",
        options: [
          { text: "Triagem por urgência", points: 10, feedback: "Perfeito! Salvou vidas priorizando casos graves!" },
          { text: "Ordem de chegada", points: 5, feedback: "Justo mas não eficiente... casos graves esperaram." },
          { text: "Atender mais rápido", points: 0, feedback: "Diagnósticos precipitados, erros médicos!" },
          { text: "Sistema de agendamento", points: 9, feedback: "Excelente! Fluxo otimizado!" }
        ]
      },
      {
        dialogue: "Preciso dar notícia difícil sobre exame do paciente...",
        options: [
          { text: "Com empatia e clareza", points: 10, feedback: "Perfeito! Paciente se sentiu acolhido e confiante!" },
          { text: "Direto ao ponto", points: 5, feedback: "Paciente ficou em choque... precisava de mais cuidado." },
          { text: "Por mensagem", points: 0, feedback: "Paciente teve crise! Falta de humanização!" },
          { text: "Esperar ele perguntar", points: 0, feedback: "Paciente ficou ansioso e perdeu confiança!" }
        ]
      }
    ]
  },
  "educacao": {
    character: { name: "Carla", role: "Professora", avatar: "👩‍🏫" },
    scene: "school",
    weather: "sunny",
    story: "Oi! Estou planejando aulas especiais e adoraria sua colaboração!",
    challenges: [
      {
        dialogue: "Tenho um aluno com TDAH disperso na aula...",
        options: [
          { text: "Atividades curtas", points: 10, feedback: "Perfeito! Aluno se engajou e aprendeu muito!" },
          { text: "Chamar atenção", points: 0, feedback: "Aluno se fechou e parou de participar..." },
          { text: "Ignorar", points: 0, feedback: "Aluno ficou desmotivado e com notas baixas." },
          { text: "Material visual", points: 9, feedback: "Excelente! Facilitou muito o aprendizado!" }
        ]
      },
      {
        dialogue: "Como tornar matemática mais interessante?",
        options: [
          { text: "Gamificação", points: 10, feedback: "Incrível! Turma toda engajada! Notas subiram!" },
          { text: "Mais exercícios", points: 0, feedback: "Turma ficou entediada..." },
          { text: "Exemplos práticos", points: 9, feedback: "Ótimo! Alunos entenderam aplicação real!" },
          { text: "Seguir livro", points: 0, feedback: "Aula monótona, alunos dispersos." }
        ]
      },
      {
        dialogue: "Turma agitada após intervalo!",
        options: [
          { text: "Dinâmica de energização", points: 10, feedback: "Perfeito! Focaram e tiveram ótima aula!" },
          { text: "Gritar para silêncio", points: 0, feedback: "Clima tenso, alunos desmotivados." },
          { text: "Começar com mistério", points: 9, feedback: "Captou atenção naturalmente!" },
          { text: "Cancelar aula", points: 0, feedback: "Perdeu oportunidade de ensinar!" }
        ]
      }
    ]
  },
  "financas": {
    character: { name: "Pedro", role: "CEO de Startup", avatar: "🚀" },
    scene: "office",
    weather: "sunny",
    story: "Fala! Estamos construindo algo revolucionário. Decisões importantes pela frente!",
    challenges: [
      {
        dialogue: "Investidor oferece R$ 500mil por 30% da empresa!",
        options: [
          { text: "Avaliar valuation", points: 10, feedback: "Pensamento estratégico! Negociou melhor termo!" },
          { text: "Aceitar já", points: 0, feedback: "Vendeu barato! Poderia ter conseguido melhor!" },
          { text: "Recusar", points: 5, feedback: "Ficou sem capital... crescimento lento." },
          { text: "Contra-propor", points: 9, feedback: "Ótima negociação! Conseguiu 25%!" }
        ]
      },
      {
        dialogue: "Produto pronto mas zero usuários! E agora?",
        options: [
          { text: "Marketing agressivo", points: 10, feedback: "Exato! Viralizou! 10mil usuários em 1 mês!" },
          { text: "Mais funcionalidades", points: 0, feedback: "Gastou tempo sem usuários... concorrente passou!" },
          { text: "Buscar investimento", points: 5, feedback: "Sem tração, difícil captar..." },
          { text: "Testes A/B", points: 7, feedback: "Bom, mas precisa de volume primeiro." }
        ]
      },
      {
        dialogue: "Concorrente gigante entrou no mercado!",
        options: [
          { text: "Focar em nicho", points: 10, feedback: "Inteligente! Dominou nicho específico!" },
          { text: "Competir direto", points: 0, feedback: "Startup quebrou... sem recursos para competir." },
          { text: "Vender empresa", points: 5, feedback: "Desistiu cedo... tinha potencial!" },
          { text: "Inovar rápido", points: 9, feedback: "Agilidade venceu! Lançou feature primeiro!" }
        ]
      }
    ]
  }
};

export default function GamePlayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get('id');

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [gamePhase, setGamePhase] = useState('intro');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [characterWalking, setCharacterWalking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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

  const scenario = game ? GAME_SCENARIOS[game.category] : null;

  // Use custom character if available
  const displayCharacter = activeCharacter ? {
    name: activeCharacter.name,
    role: "Seu Personagem",
    avatar: activeCharacter.avatar_emoji
  } : scenario?.character;

  const startGame = () => {
    setGameStarted(true);
    setCharacterWalking(true);
    setTimeout(() => {
      setCharacterWalking(false);
      setGamePhase('dialogue');
    }, 2000);
  };

  const handleDialogueNext = () => {
    setGamePhase('choice');
  };

  const handleChoice = (optionIndex) => {
    const currentQuestion = scenario.challenges[currentChallenge];
    const selectedOption = currentQuestion.options[optionIndex];
    
    setSelectedAnswer(optionIndex);
    setGamePhase('feedback');
    
    const newScore = score + selectedOption.points;
    setScore(newScore);

    if (selectedOption.points >= 8) {
      setStreak(streak + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentChallenge < scenario.challenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setGamePhase('dialogue');
        setSelectedAnswer(null);
      } else {
        navigate(createPageUrl("Games"));
      }
    }, 4000);
  };

  if (isLoading || !game || !scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando jogo...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = scenario.challenges[currentChallenge];

  return (
    <div className="fixed inset-0 overflow-hidden w-screen h-screen">
      {showConfetti && <ConfettiExplosion />}
      
      {/* Animated Background - z-index 0 */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground weather={scenario.weather} scene={scenario.scene} />
      </div>

      {/* HUD - z-index 40 */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between">
        <button
          onClick={() => navigate(createPageUrl("Games"))}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:bg-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{streak}</span>
          </div>
        </div>
      </div>

      {/* Progress - z-index 40 */}
      {gameStarted && (
        <div className="absolute top-20 left-4 right-4 z-40">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Desafio {currentChallenge + 1}/{scenario.challenges.length}</span>
              <span className="font-bold text-indigo-600">
                {Math.round(((currentChallenge + 1) / scenario.challenges.length) * 100)}%
              </span>
            </div>
            <Progress value={((currentChallenge + 1) / scenario.challenges.length) * 100} className="h-2" />
          </div>
        </div>
      )}

      {/* Character - z-index 10 */}
      {gameStarted && displayCharacter && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <WalkingCharacter
            avatar={displayCharacter.avatar}
            name={displayCharacter.name}
            position="left"
            isWalking={characterWalking}
          />
        </div>
      )}

      {/* Game Phases - z-index 30 */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="w-full h-full flex items-center justify-center pointer-events-auto">
          {!gameStarted ? (
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl mx-4 text-center">
              <div className="text-8xl mb-4">{displayCharacter?.avatar || scenario.character.avatar}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.title}</h1>
              <p className="text-gray-600 mb-4">{game.description}</p>
              {activeCharacter && (
                <p className="text-indigo-600 font-medium mb-4">
                  Jogando com: {activeCharacter.name} {activeCharacter.avatar_emoji}
                </p>
              )}
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-lg px-8 py-6"
              >
                Começar Aventura
              </Button>
            </div>
          ) : gamePhase === 'intro' ? (
            <DialogueBubble
              text={scenario.story}
              character={displayCharacter}
              onNext={() => setGamePhase('dialogue')}
            />
          ) : gamePhase === 'dialogue' ? (
            <DialogueBubble
              text={currentQuestion.dialogue}
              character={displayCharacter}
              onNext={handleDialogueNext}
            />
          ) : gamePhase === 'choice' ? (
            <GameChoices
              options={currentQuestion.options}
              onChoice={handleChoice}
              character={displayCharacter}
            />
          ) : gamePhase === 'feedback' && selectedAnswer !== null ? (
            <DialogueBubble
              text={currentQuestion.options[selectedAnswer].feedback}
              character={displayCharacter}
              showNext={false}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
