{
  "name": "Game",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "T\u00edtulo do jogo"
    },
    "description": {
      "type": "string",
      "description": "Descri\u00e7\u00e3o do jogo"
    },
    "category": {
      "type": "string",
      "enum": [
        "tecnologia",
        "sustentabilidade",
        "cultura_criativo",
        "politica_juridico",
        "genia_ciencia",
        "agronegocio",
        "turismo",
        "economia_mar",
        "moda_design",
        "cidades_inteligentes",
        "healthtech"
      ],
      "description": "Categoria/setor do jogo"
    },
    "historical_context": {
      "type": "object",
      "properties": {
        "period": {
          "type": "string",
          "description": "Per\u00edodo hist\u00f3rico (ex: 1940s, s\u00e9culo XIX)"
        },
        "location": {
          "type": "string",
          "description": "Local do evento hist\u00f3rico"
        },
        "key_figure": {
          "type": "string",
          "description": "Figura hist\u00f3rica principal"
        },
        "invention_discovery": {
          "type": "string",
          "description": "Inven\u00e7\u00e3o ou descoberta do jogo"
        },
        "impact": {
          "type": "string",
          "description": "Impacto no mundo"
        },
        "fun_fact": {
          "type": "string",
          "description": "Curiosidade hist\u00f3rica"
        }
      },
      "description": "Contexto hist\u00f3rico do jogo"
    },
    "cognitive_focus": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "atencao",
          "memoria",
          "leitura",
          "logica",
          "criatividade",
          "organizacao",
          "velocidade",
          "resolucao_problemas",
          "pensamento_visual",
          "comunicacao",
          "coordenacao_motora"
        ]
      },
      "description": "Habilidades cognitivas trabalhadas"
    },
    "difficulty": {
      "type": "string",
      "enum": [
        "facil",
        "medio",
        "dificil"
      ],
      "description": "N\u00edvel de dificuldade"
    },
    "estimated_time": {
      "type": "number",
      "description": "Tempo estimado em minutos"
    },
    "is_discovery_test": {
      "type": "boolean",
      "default": false,
      "description": "Se \u00e9 um teste de descoberta de hiperfoco"
    },
    "game_type": {
      "type": "string",
      "enum": [
        "puzzle",
        "construction",
        "exploration",
        "quiz",
        "simulation"
      ],
      "description": "Tipo de mec\u00e2nica do jogo"
    },
    "learning_objectives": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Objetivos de aprendizado"
    },
    "accessibility_features": {
      "type": "object",
      "properties": {
        "text_to_speech": {
          "type": "boolean",
          "default": true
        },
        "subtitles": {
          "type": "boolean",
          "default": true
        },
        "high_contrast": {
          "type": "boolean",
          "default": true
        },
        "adjustable_pace": {
          "type": "boolean",
          "default": true
        },
        "visual_feedback": {
          "type": "boolean",
          "default": true
        },
        "audio_feedback": {
          "type": "boolean",
          "default": true
        }
      }
    },
    "sector_professions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Profiss\u00f5es em alta no setor"
    },
    "icon": {
      "type": "string",
      "description": "Nome do \u00edcone Lucide"
    },
    "color": {
      "type": "string",
      "description": "Cor do card do jogo"
    }
  },
  "required": [
    "title",
    "description",
    "category",
    "cognitive_focus"
  ]
}