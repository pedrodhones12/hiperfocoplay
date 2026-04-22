// base44Client.js - Versão LOCAL (substitui a API real)
import { getUser, isAuthenticated, logout } from "@/utils/auth";
import { getCharacters, saveCharacter, updateCharacter } from "@/utils/characters";

// Mock das entidades que o sistema espera
const entities = {
  // UserProfile
  UserProfile: {
    filter: async (filters) => {
      const users = JSON.parse(localStorage.getItem("userProfiles")) || [];
      if (filters.created_by) {
        return users.filter(u => u.created_by === filters.created_by);
      }
      return users;
    },
    create: async (data) => {
      const users = JSON.parse(localStorage.getItem("userProfiles")) || [];
      const newUser = { ...data, id: Date.now(), created_by: getUser()?.email };
      users.push(newUser);
      localStorage.setItem("userProfiles", JSON.stringify(users));
      return newUser;
    },
    update: async (id, data) => {
      const users = JSON.parse(localStorage.getItem("userProfiles")) || [];
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...data };
        localStorage.setItem("userProfiles", JSON.stringify(users));
      }
      return users[index];
    }
  },

  // Game
  Game: {
    list: async () => {
      const games = JSON.parse(localStorage.getItem("games")) || getDefaultGames();
      return games;
    },
    filter: async (filters) => {
      const games = JSON.parse(localStorage.getItem("games")) || getDefaultGames();
      if (filters.category) {
        return games.filter(g => g.category === filters.category);
      }
      return games;
    }
  },

  // GameProgress
  GameProgress: {
    list: async (order, limit) => {
      const progress = JSON.parse(localStorage.getItem("gameProgress")) || [];
      const userEmail = getUser()?.email;
      const filtered = progress.filter(p => p.created_by === userEmail);
      return filtered.sort((a, b) => new Date(b.last_played) - new Date(a.last_played));
    },
    filter: async (filters) => {
      const progress = JSON.parse(localStorage.getItem("gameProgress")) || [];
      return progress.filter(p => {
        if (filters.created_by && p.created_by !== filters.created_by) return false;
        if (filters.game_id && p.game_id !== filters.game_id) return false;
        return true;
      });
    },
    create: async (data) => {
      const progress = JSON.parse(localStorage.getItem("gameProgress")) || [];
      const newProgress = { ...data, id: Date.now(), created_by: getUser()?.email };
      progress.push(newProgress);
      localStorage.setItem("gameProgress", JSON.stringify(progress));
      return newProgress;
    },
    update: async (id, data) => {
      const progress = JSON.parse(localStorage.getItem("gameProgress")) || [];
      const index = progress.findIndex(p => p.id === id);
      if (index !== -1) {
        progress[index] = { ...progress[index], ...data };
        localStorage.setItem("gameProgress", JSON.stringify(progress));
      }
      return progress[index];
    }
  },

  // Character
  Character: {
    filter: async (filters) => {
      const chars = getCharacters();
      if (filters.created_by) {
        return chars.filter(c => c.created_by === filters.created_by);
      }
      if (filters.is_active !== undefined) {
        return chars.filter(c => c.is_active === filters.is_active);
      }
      return chars;
    },
    create: async (data) => {
      const newChar = { ...data, id: Date.now(), created_by: getUser()?.email };
      saveCharacter(newChar);
      return newChar;
    },
    update: async (id, data) => {
      updateCharacter(id, data);
      return { id, ...data };
    }
  },

  // Post (Feed)
  Post: {
    list: async (order, limit) => {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      return posts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    create: async (data) => {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const newPost = { 
        ...data, 
        id: Date.now(), 
        created_date: new Date().toISOString(),
        created_by: getUser()?.email
      };
      posts.push(newPost);
      localStorage.setItem("posts", JSON.stringify(posts));
      return newPost;
    },
    update: async (id, data) => {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...data };
        localStorage.setItem("posts", JSON.stringify(posts));
      }
      return posts[index];
    }
  },

  // HyperfocusDiscovery
  HyperfocusDiscovery: {
    filter: async (filters) => {
      const discoveries = JSON.parse(localStorage.getItem("hyperfocusDiscoveries")) || [];
      if (filters.created_by) {
        return discoveries.filter(d => d.created_by === filters.created_by);
      }
      return discoveries;
    },
    create: async (data) => {
      const discoveries = JSON.parse(localStorage.getItem("hyperfocusDiscoveries")) || [];
      const newDiscovery = { ...data, id: Date.now(), created_by: getUser()?.email };
      discoveries.push(newDiscovery);
      localStorage.setItem("hyperfocusDiscoveries", JSON.stringify(discoveries));
      return newDiscovery;
    }
  },

  // JobOpportunity
  JobOpportunity: {
    filter: async (filters) => {
      const jobs = JSON.parse(localStorage.getItem("jobs")) || getDefaultJobs();
      if (filters.is_active !== undefined) {
        return jobs.filter(j => j.is_active === filters.is_active);
      }
      return jobs;
    },
    create: async (data) => {
      const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
      const newJob = { ...data, id: Date.now(), created_date: new Date().toISOString() };
      jobs.push(newJob);
      localStorage.setItem("jobs", JSON.stringify(jobs));
      return newJob;
    }
  },

  // Project
  Project: {
    filter: async (filters) => {
      const projects = JSON.parse(localStorage.getItem("projects")) || [];
      if (filters.created_by) {
        return projects.filter(p => p.created_by === filters.created_by);
      }
      if (filters.is_public !== undefined) {
        return projects.filter(p => p.is_public === filters.is_public);
      }
      return projects;
    },
    create: async (data) => {
      const projects = JSON.parse(localStorage.getItem("projects")) || [];
      const newProject = { ...data, id: Date.now(), created_by: getUser()?.email };
      projects.push(newProject);
      localStorage.setItem("projects", JSON.stringify(projects));
      return newProject;
    }
  }
};

// Dados padrão para testes
function getDefaultGames() {
  return [
    {
      id: "1",
      title: "A Revolução da Computação",
      description: "Conheça Alan Turing e ajude a construir o primeiro computador!",
      category: "tecnologia",
      estimated_time: 10,
      difficulty: "médio",
      historical_context: {
        period: "1940 - Segunda Guerra Mundial",
        key_figure: "Alan Turing"
      }
    },
    {
      id: "2",
      title: "Energia do Futuro",
      description: "Descubra a energia solar com Edmond Becquerel!",
      category: "sustentabilidade",
      estimated_time: 10,
      difficulty: "médio"
    },
    {
      id: "3",
      title: "A Magia do Cinema",
      description: "Crie a primeira animação com Émile Reynaud!",
      category: "cultura_criativo",
      estimated_time: 10,
      difficulty: "fácil"
    }
  ];
}

function getDefaultJobs() {
  return [
    {
      id: "1",
      title: "Desenvolvedor Front-end",
      company: "TechInclui",
      location: "Remoto",
      job_type: "remoto",
      description: "Vaga afirmativa para pessoas neurodivergentes. Ambiente acolhedor e flexível.",
      salary_range: "R$ 5.000 - R$ 8.000",
      accessibility_features: ["Horário flexível", "Mentoria", "Ambiente silencioso"],
      is_active: true,
      created_date: new Date().toISOString()
    },
    {
      id: "2",
      title: "Analista de Dados",
      company: "DataForAll",
      location: "São Paulo - SP",
      job_type: "hibrido",
      description: "Buscamos pessoas com TDAH ou autismo para trazer novas perspectivas.",
      salary_range: "R$ 6.000 - R$ 9.000",
      accessibility_features: ["Ferramentas de apoio", "Pausas flexíveis"],
      is_active: true,
      created_date: new Date().toISOString()
    }
  ];
}

// Exporta o objeto base44
export const base44 = {
  auth: {
    me: async () => {
      const user = getUser();
      if (!user) throw new Error("Não autenticado");
      return user;
    },
    logout: () => {
      logout();
    }
  },
  entities: entities
};
