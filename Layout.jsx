import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Gamepad2, 
  User, 
  Award, 
  Settings, 
  Globe, 
  Briefcase,
  Menu,
  X,
  LogOut,
  HelpCircle,
  Bell,
  TrendingUp,
  Gem
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Layout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Início", path: "Dashboard", icon: Home },
    { name: "Jornada", path: "ErasJourney", icon: Gamepad2 },
    { name: "Feed", path: "Feed", icon: Globe },
    { name: "Mundo", path: "ConnectWorld", icon: Globe },
    { name: "Perfil", path: "Profile", icon: User },
  ];

  const menuItems = [
    { name: "Dashboard", path: "Dashboard", icon: Home },
    { name: "Jornada Histórica", path: "ErasJourney", icon: Gamepad2 },
    { name: "Jogos Rápidos", path: "Games", icon: Gamepad2 },
    { name: "Meu Progresso", path: "Progress", icon: TrendingUp },
    { name: "Feed Internacional", path: "Feed", icon: Globe },
    { name: "Conecte-se com o Mundo", path: "ConnectWorld", icon: Globe },
    { name: "Meus Projetos", path: "MyProjects", icon: Briefcase },
    { name: "Postar Vaga Inclusiva", path: "PostJob", icon: Briefcase },
    { name: "Nossa História", path: "OurStory", icon: HelpCircle },
    { name: "Perfil", path: "Profile", icon: User },
    { name: "Configurações", path: "Settings", icon: Settings },
    { name: "Ajuda", path: "Help", icon: HelpCircle },
  ];

  const isActive = (path) => {
    return location.pathname === createPageUrl(path);
  };

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Hiperfoco
                </h1>
                <p className="text-xs text-gray-500">Vale Dinheiro</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors hidden lg:block"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Hiperfoco</h2>
                <p className="text-xs text-gray-500">Menu</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-4"
            >
              <LogOut className="w-5 h-5" />
<span className="font-medium">Sair</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <p className="text-xs text-gray-600 text-center">
            Versão 1.0.0
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            © 2025 Hiperfoco Vale Dinheiro
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className="flex flex-col items-center gap-1 min-w-[70px] py-1"
                >
                  <div className={`p-2 rounded-xl transition-all ${
                    active 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30' 
                      : 'hover:bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className={`text-xs font-medium ${
                    active ? 'text-indigo-600' : 'text-gray-600'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
