import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus,
  Briefcase,
  Eye,
  Heart,
  Edit,
  TrendingUp,
  Lightbulb,
  Rocket,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STAGE_INFO = {
  ideia: { label: "Ideia", icon: Lightbulb, color: "bg-yellow-100 text-yellow-700" },
  validacao: { label: "Validação", icon: TrendingUp, color: "bg-blue-100 text-blue-700" },
  mvp: { label: "MVP", icon: Rocket, color: "bg-purple-100 text-purple-700" },
  lancamento: { label: "Lançamento", icon: Rocket, color: "bg-green-100 text-green-700" },
  crescimento: { label: "Crescimento", icon: TrendingUp, color: "bg-indigo-100 text-indigo-700" }
};

export default function MyProjectsPage() {
  const [user, setUser] = useState(null);

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

  const { data: myProjects = [], isLoading } = useQuery({
    queryKey: ['myProjects'],
    queryFn: async () => {
      return await base44.entities.Project.filter({ created_by: user?.email });
    },
    enabled: !!user,
    initialData: [],
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            Meus Projetos
          </h1>
          <p className="text-gray-600">
            Gerencie seus projetos e ideias empreendedoras
          </p>
        </div>
        <Link to={createPageUrl("CreateProject")}>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
            <Plus className="w-5 h-5 mr-2" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : myProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => {
            const stageInfo = STAGE_INFO[project.stage] || STAGE_INFO.ideia;
            const StageIcon = stageInfo.icon;

            return (
              <div key={project.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-xl ${stageInfo.color}`}>
                    <StageIcon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    {project.seeking_investment && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        💰
                      </span>
                    )}
                    {!project.is_public && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        🔒 Privado
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1 rounded-full font-medium ${stageInfo.color}`}>
                      {stageInfo.label}
                    </span>
                    <span className="text-gray-500 capitalize">{project.category}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{project.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{project.likes || 0}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Link to={createPageUrl("EditProject") + `?id=${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Link to={createPageUrl("ProjectDetail") + `?id=${project.id}`} className="flex-1">
                      <Button className="w-full bg-indigo-600" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum projeto ainda</h3>
          <p className="text-gray-600 mb-6">
            Transforme seu hiperfoco em um projeto real!
          </p>
          <Link to={createPageUrl("CreateProject")}>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
