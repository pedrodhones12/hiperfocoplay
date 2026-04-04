import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Globe,
  GraduationCap,
  Rocket,
  Heart,
  ExternalLink,
  MapPin,
  Award,
  Briefcase,
  Building2,
  Users,
  Search,
  Filter,
  BookOpen,
  Lightbulb,
  Target,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AIJobBot from "../components/AIJobBot";
import { calculateJobMatch, JobMatchBadge, JobMatchDetails } from "../components/JobMatchSystem";

const REGIONS = [
  {
    id: "europe",
    name: "Europa / União Europeia",
    icon: "🇪🇺",
    color: "from-blue-500 to-cyan-600",
    programs: [
      {
        name: "Erasmus+",
        description: "Programa marco para mobilidade estudantil com linhas de apoio e 'inclusion support' para estudantes com necessidades médicas/deficiências.",
        url: "https://erasmus-plus.ec.europa.eu/",
        tags: ["Mobilidade", "Inclusão", "Bolsas"],
        highlight: true
      },
      {
        name: "Universidade de Maastricht",
        description: "Forte em estudos sociais, projetos internacionais e cooperações com a China. Oferece apoio a estudantes com deficiência via serviços estudantis.",
        location: "Países Baixos",
        url: "https://www.maastrichtuniversity.nl/",
        tags: ["Estudos Sociais", "Acessibilidade"]
      },
      {
        name: "Technical University of Munich (TUM)",
        description: "Parcerias intensas com a China e plataformas de cooperação em tecnologia. Excelente ecossistema de transferência e incubadoras.",
        location: "Alemanha",
        url: "https://www.tum.de/",
        tags: ["Tecnologia", "Empreendedorismo", "Incubadoras"]
      },
      {
        name: "Kunstuniversität Linz",
        description: "Universidades austríacas com serviços dedicados à igualdade de tratamento e inclusão para estudantes com deficiência.",
        location: "Áustria",
        url: "https://www.kunstuni-linz.at/",
        tags: ["Arte", "Inclusão", "Cultura"]
      },
      {
        name: "UNICA Network",
        description: "Projetos europeus que fomentam a mobilidade de estudantes com deficiência e a inclusão nas trocas (ExchangeAbility, IDEM).",
        url: "https://www.unica-network.eu/",
        tags: ["Mobilidade", "Inclusão", "Redes"]
      },
      {
        name: "EULiST University",
        description: "Rede de universidades europeias focada em cooperações transnacionais e financiamento de projetos.",
        url: "https://eulist.university/",
        tags: ["Cooperação", "Financiamento"]
      }
    ]
  },
  {
    id: "usa",
    name: "Estados Unidos",
    icon: "🇺🇸",
    color: "from-red-500 to-orange-600",
    programs: [
      {
        name: "Gallaudet University",
        description: "Universidade focada em educação para surdos com escritório de Education Abroad. Ótima opção para acessibilidade comunicativa.",
        location: "Washington, DC",
        url: "https://www.gallaudet.edu/",
        tags: ["Acessibilidade", "Inclusão", "Surdos"],
        highlight: true
      },
      {
        name: "University of Illinois Urbana-Champaign (UIUC)",
        description: "Referência em serviços de acessibilidade (DRES) que integra com o escritório de study abroad para facilitar intercâmbios.",
        location: "Illinois",
        url: "https://www.disability.illinois.edu/",
        tags: ["Acessibilidade", "Intercâmbio", "DRES"]
      },
      {
        name: "Programas Fulbright / Departamento de Estado",
        description: "Bolsas e programas de intercâmbio que incentivam a participação de pessoas com deficiência. Úteis para financiamento formal.",
        url: "https://www.state.gov/",
        tags: ["Bolsas", "Financiamento", "Inclusão"],
        highlight: true
      },
      {
        name: "Stanford / MIT / Berkeley",
        description: "Universidades com hubs de empreendedorismo, incubadoras, programas de corporate engagement e fundos de seed/spin-offs.",
        location: "Califórnia / Massachusetts",
        tags: ["Empreendedorismo", "Incubadoras", "Inovação"]
      }
    ]
  },
  {
    id: "china",
    name: "China",
    icon: "🇨🇳",
    color: "from-red-600 to-yellow-500",
    programs: [
      {
        name: "Tsinghua University (x-lab)",
        description: "Plataforma universitária de inovação/empreendedorismo (cursos, incubação e cooperação internacional). Excelente para projetos tecnológicos.",
        location: "Beijing",
        url: "https://www.x-lab.tsinghua.edu.cn/",
        tags: ["Inovação", "Empreendedorismo", "Tecnologia"],
        highlight: true
      },
      {
        name: "Duke Kunshan University (DKU)",
        description: "Campus sino-americano com incubadora DKU Innovation Incubator e serviços formais de acomodação para estudantes com deficiência.",
        url: "https://ine.dukekunshan.edu.cn/",
        tags: ["Inovação", "Acessibilidade", "Incubadora"]
      },
      {
        name: "Zhejiang International Business School (ZIBS)",
        description: "Centros que fazem 'capital matching' entre projetos e investidores, úteis para quem deseja investir ou prototipar.",
        location: "Zhejiang",
        url: "https://www.zibs.zju.edu.cn/",
        tags: ["Investimento", "Negócios", "Capital"]
      }
    ]
  },
  {
    id: "uae",
    name: "Dubai / Emirados Árabes",
    icon: "🇦🇪",
    color: "from-amber-500 to-orange-600",
    programs: [
      {
        name: "Khalifa University",
        description: "Universidade técnica com programas de intercâmbio, suporte a estudantes internacionais e acomodações para necessidades especiais.",
        location: "Abu Dhabi",
        url: "https://www.ku.ac.ae/",
        tags: ["Tecnologia", "Acessibilidade", "Pesquisa"]
      },
      {
        name: "NYU Abu Dhabi",
        description: "Parte da rede global NYU com políticas de acessibilidade (Moses Center). Bom para cultura, tecnologia e intercâmbio acadêmico.",
        location: "Abu Dhabi",
        url: "https://nyuad.nyu.edu/",
        tags: ["Global", "Acessibilidade", "Cultura"],
        highlight: true
      },
      {
        name: "American University of Sharjah (AUS)",
        description: "Escritório de intercâmbio e serviço de Accessibility Support para estudantes com deficiência.",
        location: "Sharjah",
        url: "https://www.aus.edu/",
        tags: ["Intercâmbio", "Acessibilidade"]
      }
    ]
  }
];

const EDITAIS_BRASIL = [
  {
    name: "CNPq - Bolsas de Estudo",
    description: "Conselho Nacional de Desenvolvimento Científico e Tecnológico - editais para bolsas de pesquisa e inovação.",
    url: "https://www.gov.br/cnpq/",
    icon: Award,
    tags: ["Pesquisa", "Bolsas", "Ciência"]
  },
  {
    name: "CAPES - Programas de Pós-Graduação",
    description: "Coordenação de Aperfeiçoamento de Pessoal de Nível Superior - bolsas para mestrado, doutorado e pós-doutorado.",
    url: "https://www.gov.br/capes/",
    icon: GraduationCap,
    tags: ["Pós-Graduação", "Pesquisa", "Bolsas"]
  },
  {
    name: "FAPESP - Fundação de Amparo à Pesquisa",
    description: "Editais de apoio à pesquisa, empreendedorismo e inovação no estado de São Paulo.",
    url: "https://fapesp.br/",
    icon: Lightbulb,
    tags: ["Inovação", "Pesquisa", "SP"]
  },
  {
    name: "FINEP - Inovação e Pesquisa",
    description: "Financiadora de Estudos e Projetos - apoio a projetos de inovação e desenvolvimento tecnológico.",
    url: "http://www.finep.gov.br/",
    icon: Rocket,
    tags: ["Inovação", "Tecnologia", "Financiamento"]
  },
  {
    name: "Programa Ciência sem Fronteiras",
    description: "Intercâmbio e mobilidade internacional para estudantes brasileiros em áreas estratégicas.",
    url: "https://www.gov.br/capes/",
    icon: Globe,
    tags: ["Intercâmbio", "Mobilidade", "Internacional"]
  },
  {
    name: "Editais de Inclusão - MEC",
    description: "Ministério da Educação - programas de apoio a estudantes com deficiência e neurodivergentes.",
    url: "https://www.gov.br/mec/",
    icon: Heart,
    tags: ["Inclusão", "Acessibilidade", "Educação"]
  }
];

export default function ConnectWorldPage() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [jobFilter, setJobFilter] = useState("all");

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

  const { data: hyperfocus } = useQuery({
    queryKey: ['hyperfocusDiscovery'],
    queryFn: async () => {
      const discoveries = await base44.entities.HyperfocusDiscovery.filter({ created_by: user?.email });
      return discoveries[0];
    },
    enabled: !!user,
  });

  const { data: jobOpportunities = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ['jobOpportunities'],
    queryFn: async () => {
      const jobs = await base44.entities.JobOpportunity.filter({ is_active: true });
      return jobs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    initialData: [],
  });

  const jobsWithMatch = jobOpportunities.map(job => ({
    ...job,
    matchData: calculateJobMatch(profile, hyperfocus, job)
  })).sort((a, b) => b.matchData.total - a.matchData.total);

  const allTags = Array.from(
    new Set(
      REGIONS.flatMap(region =>
        region.programs.flatMap(program => program.tags || [])
      ).concat(EDITAIS_BRASIL.flatMap(edital => edital.tags || []))
    )
  ).sort();

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredRegions = REGIONS.filter(region => {
    if (selectedRegion !== "all" && region.id !== selectedRegion) return false;
    
    return region.programs.some(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 ||
                         selectedTags.some(tag => program.tags?.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  });

  const filteredEditais = EDITAIS_BRASIL.filter(edital => {
    const matchesSearch = edital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edital.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
                       selectedTags.some(tag => edital.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const filteredJobs = jobsWithMatch.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(jobSearchTerm.toLowerCase());
    
    const matchesFilter = jobFilter === "all" || job.job_type === jobFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <AIJobBot />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Globe className="w-12 h-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">Conecte-se com o Mundo</h1>
            <p className="text-lg text-indigo-100">
              Universidades, programas de inclusão e editais para transformar seu hiperfoco em oportunidades globais 🌍
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-6 h-6" />
              <h3 className="font-bold text-lg">Universidades Inclusivas</h3>
            </div>
            <p className="text-sm text-indigo-100">
              Instituições com suporte especializado para neurodivergentes
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-6 h-6" />
              <h3 className="font-bold text-lg">Incubadoras & Investimento</h3>
            </div>
            <p className="text-sm text-indigo-100">
              Hubs de inovação e oportunidades de financiamento
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6" />
              <h3 className="font-bold text-lg">Editais Brasileiros</h3>
            </div>
            <p className="text-sm text-indigo-100">
              Captação de recursos e bolsas nacionais
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar universidades, programas ou editais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setSelectedRegion("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              selectedRegion === "all"
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas as Regiões
          </button>
          {REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                selectedRegion === region.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region.icon} {region.name}
            </button>
          ))}
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Regions and Programs */}
      {filteredRegions.map((region) => (
        <div key={region.id} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${region.color} rounded-2xl flex items-center justify-center text-3xl`}>
              {region.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{region.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {region.programs
              .filter(program => {
                const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    program.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesTags = selectedTags.length === 0 ||
                                   selectedTags.some(tag => program.tags?.includes(tag));
                return matchesSearch && matchesTags;
              })
              .map((program, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-6 shadow-lg border transition-all hover:shadow-2xl hover:-translate-y-1 ${
                    program.highlight
                      ? 'border-2 border-purple-500 ring-2 ring-purple-200'
                      : 'border-gray-100'
                  }`}
                >
                  {program.highlight && (
                    <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      ⭐ DESTAQUE
                    </span>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                    {program.url && (
                      <a
                        href={program.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {program.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{program.location}</span>
                    </div>
                  )}

                  <p className="text-gray-700 mb-4">{program.description}</p>

                  {program.tags && program.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {program.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Vagas de Emprego para Neurodivergentes */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl">
            💼
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Vagas para Neurodivergentes
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </h2>
            <p className="text-sm text-gray-600">Oportunidades inclusivas atualizadas diariamente pela IA</p>
          </div>
        </div>

        {/* Job Search */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar vagas..."
                value={jobSearchTerm}
                onChange={(e) => setJobSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="remoto">🏠 Remoto</option>
              <option value="hibrido">🔄 Híbrido</option>
              <option value="presencial">🏢 Presencial</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {profile && hyperfocus ? "💡 Vagas ordenadas por compatibilidade com seu perfil" : "Crie seu perfil para ver recomendações personalizadas"}
            </p>
            <Button
              onClick={() => navigate(createPageUrl("PostJob"))}
              variant="outline"
              className="border-purple-500 text-purple-600"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Postar Vaga
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        {isLoadingJobs ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Buscando vagas...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-purple-600 font-semibold">{job.company}</p>
                    {profile && hyperfocus && job.matchData.total > 0 && (
                      <div className="mt-2">
                        <JobMatchBadge matchScore={job.matchData.total} />
                      </div>
                    )}
                  </div>
                  {job.posted_by_ai && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI
                    </span>
                  )}
                </div>

                {profile && hyperfocus && job.matchData.total > 0 && (
                  <div className="mb-4">
                    <JobMatchDetails matchDetails={job.matchData.details} />
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {job.job_type === "remoto" ? "🏠 Remoto" : job.job_type === "hibrido" ? "🔄 Híbrido" : "🏢 Presencial"}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                {job.accessibility_features && job.accessibility_features.length > 0 && (
                  <div className="mb-4 bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      ♿ Recursos de Acessibilidade Oferecidos
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {job.accessibility_features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-green-800">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {job.salary_range && (
                  <p className="text-sm text-gray-600 mb-4">
                    💰 {job.salary_range}
                  </p>
                )}

                <div className="flex gap-3">
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Candidatar-se
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-50"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma vaga encontrada</h3>
            <p className="text-gray-600 mb-4">Novas vagas são adicionadas diariamente!</p>
          </div>
        )}
      </div>

      {/* Editais Brasileiros */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl">
            🇧🇷
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Editais e Programas Brasileiros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEditais.map((edital, idx) => {
            const IconComponent = edital.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{edital.name}</h3>
                  <a
                    href={edital.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <p className="text-gray-700 text-sm mb-4">{edital.description}</p>

                {edital.tags && edital.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {edital.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Target className="w-8 h-8" />
          Próximos Passos Práticos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Escolha 2-3 universidades</h3>
            <p className="text-indigo-100 text-sm">
              Selecione instituições que mais interessam de acordo com seus objetivos e área de atuação.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Entre em contato</h3>
            <p className="text-indigo-100 text-sm">
              Contate o International Office e pergunte sobre: acordos de intercâmbio, políticas de acessibilidade e oportunidades nas incubadoras.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Candidate-se a editais</h3>
            <p className="text-indigo-100 text-sm">
              Busque financiamento através de editais brasileiros e programas de bolsas internacionais.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Pronto para Conectar-se com o Mundo?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore as oportunidades, entre em contato com as universidades e transforme seu hiperfoco em uma carreira internacional!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Ver Todos os Programas
          </button>
          <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2">
            <Users className="w-5 h-5" />
            Falar com Mentor
          </button>
        </div>
      </div>
    </div>
  );
}
