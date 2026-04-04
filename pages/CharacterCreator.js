// ==========================
// IMPORTAÇÕES
// ==========================

// React e hooks para controlar estado e ciclo de vida
import React, { useState, useEffect } from "react";

// Navegação entre páginas
import { useNavigate } from "react-router-dom";

// Função que cria URL das páginas
import { createPageUrl } from "@/utils";

// Função do seu sistema de login (SEM Base44)
import { getUser } from "@/utils/auth";

// Funções que substituem o banco de dados (localStorage)
import {
  getCharacters,
  saveCharacter,
  updateCharacter
} from "@/utils/characters";

// Componentes visuais (botão, input, etc.)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Ícones
import { Save } from "lucide-react";


// ==========================
// DADOS FIXOS (CONFIGURAÇÃO)
// ==========================

// Lista de emojis para escolher avatar
const EMOJI_OPTIONS = ["😊","😎","🤓","🤖","👽"];


// ==========================
// COMPONENTE PRINCIPAL
// ==========================

export default function CharacterCreatorPage() {

  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Estado do usuário logado
  const [user, setUser] = useState(null);

  // Lista dos personagens do usuário
  const [myCharacters, setMyCharacters] = useState([]);

  // Estado do personagem sendo criado
  const [character, setCharacter] = useState({
    name: "",
    avatar_emoji: "😊",
    is_active: true
  });


  // ==========================
  // PEGAR USUÁRIO LOGADO
  // ==========================

  useEffect(() => {
    // pega usuário do localStorage
    const currentUser = getUser();

    // salva no estado
    setUser(currentUser);
  }, []);


  // ==========================
  // CARREGAR PERSONAGENS
  // ==========================

  useEffect(() => {
    if (user) {
      // pega todos personagens
      const chars = getCharacters();

      // filtra só os do usuário atual
      const filtered = chars.filter(
        c => c.created_by === user.email
      );

      // salva no estado
      setMyCharacters(filtered);
    }
  }, [user]);


  // ==========================
  // CRIAR PERSONAGEM
  // ==========================

  const handleSubmit = (e) => {
    e.preventDefault(); // impede recarregar página

    // validação simples
    if (!character.name.trim()) {
      alert("Digite um nome!");
      return;
    }

    // se esse personagem for ativo
    if (character.is_active) {

      // desativa os outros
      myCharacters.forEach(char => {
        if (char.is_active) {
          updateCharacter(char.id, { is_active: false });
        }
      });
    }

    // salva novo personagem
    saveCharacter({
      ...character, // copia dados
      id: Date.now(), // cria id único
      created_by: user?.email // vincula ao usuário
    });

    // redireciona para perfil
    navigate(createPageUrl("Profile"));
  };


  // ==========================
  // INTERFACE (HTML + JSX)
  // ==========================

  return (
    <div className="p-6">

      {/* Título */}
      <h1 className="text-2xl font-bold">
        Criar Personagem
      </h1>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Input do nome */}
        <Input
          placeholder="Nome"
          value={character.name}
          onChange={(e) =>
            setCharacter({
              ...character,
              name: e.target.value
            })
          }
        />

        {/* Escolha de emoji */}
        <div className="flex gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() =>
                setCharacter({
                  ...character,
                  avatar_emoji: emoji
                })
              }
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Botão salvar */}
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Criar
        </Button>
      </form>


      {/* LISTA DE PERSONAGENS */}
      <div className="mt-6">

        <h2>Meus personagens</h2>

        {myCharacters.map((char) => (
          <div key={char.id} className="p-2 border rounded">

            {/* Emoji + nome */}
            {char.avatar_emoji} {char.name}

            {/* Mostra se está ativo */}
            {char.is_active && " (Ativo)"}
          </div>
        ))}

      </div>

    </div>
  );
}
