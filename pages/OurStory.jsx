import React from "react";
import { 
  Heart, 
  Target, 
  Users, 
  Lightbulb, 
  Sparkles,
  Brain,
  Globe,
  Rocket,
  Award,
  Zap
} from "lucide-react";

export default function OurStoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Nossa História
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Uma plataforma criada com propósito: transformar o hiperfoco neurodivergente em oportunidades reais de carreira e conexão global
          </p>
        </div>
      </div>

      {/* Purpose Section */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">O Propósito</h2>
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            O Hiperfoco Vale Dinheiro nasceu de uma necessidade real: criar uma ponte entre o talento neurodivergente e as oportunidades globais de trabalho, educação e desenvolvimento.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Acreditamos que pessoas com TDAH, autismo, dislexia e outras neurodivergências possuem habilidades únicas e valiosas que o mercado precisa. O hiperfoco, muitas vezes visto como desafio, é na verdade um superpoder quando direcionado corretamente.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Nossa missão é <strong>democratizar o acesso</strong> a oportunidades internacionais, bolsas de estudo, editais brasileiros e vagas inclusivas, enquanto oferecemos uma experiência de aprendizado gamificada e totalmente acessível.
          </p>
        </div>
      </div>

      {/* Objectives Section */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Nossos Objetivos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-200">
            <Brain className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Educação Acessível</h3>
            <p className="text-gray-700">
              Oferecer jogos educativos históricos adaptados para diferentes perfis cognitivos, respeitando ritmos e estilos de aprendizagem únicos.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <Globe className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Conexão Global</h3>
            <p className="text-gray-700">
              Conectar talentos neurodivergentes a oportunidades reais em universidades, empresas e projetos ao redor do mundo.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <Rocket className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Desenvolvimento Profissional</h3>
            <p className="text-gray-700">
              Guiar cada pessoa na descoberta do seu hiperfoco e na construção de um caminho de carreira autêntico e sustentável.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
            <Award className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Inclusão Real</h3>
            <p className="text-gray-700">
              Promover a inclusão genuína no mercado de trabalho, mostrando às empresas o valor inestimável da neurodiversidade.
            </p>
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Público-Alvo</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <div className="text-3xl">🧠</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Pessoas Neurodivergentes</h3>
              <p className="text-gray-700">
                Indivíduos com TDAH, autismo, dislexia, dificuldades de fala e outras neurodivergências que buscam educação e oportunidades adaptadas às suas necessidades.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="text-3xl">🎓</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Estudantes e Profissionais em Transição</h3>
              <p className="text-gray-700">
                Pessoas que buscam descobrir seu propósito, desenvolver novas habilidades e acessar oportunidades de intercâmbio, bolsas e editais.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <div className="text-3xl">🏢</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Empresas Inclusivas</h3>
              <p className="text-gray-700">
                Organizações que valorizam a diversidade e buscam contratar talentos únicos com perfis cognitivos diferenciados.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
            <div className="text-3xl">👨‍👩‍👧‍👦</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Famílias e Educadores</h3>
              <p className="text-gray-700">
                Pais, professores e profissionais que apoiam pessoas neurodivergentes em sua jornada educacional e profissional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Como Funciona</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">🎮 Jogos Educativos Históricos</h3>
              <p className="text-gray-700">
                Aprenda através de jogos interativos sobre grandes invenções e personalidades históricas, com narrativas adaptadas ao seu perfil cognitivo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
 
