{
  "name": "Badge",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome do badge"
    },
    "description": {
      "type": "string",
      "description": "Descri\u00e7\u00e3o do que o badge representa"
    },
    "emoji": {
      "type": "string",
      "description": "Emoji do badge"
    },
    "category": {
      "type": "string",
      "enum": [
        "aprendizado",
        "comunidade",
        "projeto",
        "habilidade",
        "especial"
      ],
      "description": "Categoria do badge"
    },
    "criteria": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "games_completed",
            "score_threshold",
            "projects_created",
            "posts_created",
            "comments_made",
            "days_streak",
            "learning_paths_completed",
            "special_achievement"
          ]
        },
        "value": {
          "type": "number"
        }
      },
      "description": "Crit\u00e9rio para conquistar o badge"
    },
    "rarity": {
      "type": "string",
      "enum": [
        "comum",
        "raro",
        "epico",
        "lendario"
      ],
      "default": "comum",
      "description": "Raridade do badge"
    },
    "points": {
      "type": "number",
      "default": 10,
      "description": "Pontos ganhos ao conquistar"
    },
    "unlocks": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "IDs de m\u00f3dulos/conte\u00fados que desbloqueia"
    },
    "color": {
      "type": "string",
      "description": "Cor do badge"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "name",
    "description",
    "emoji",
    "category"
  ]
}using AI to generate more code!