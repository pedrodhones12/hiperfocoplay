{
  "name": "GameSession",
  "type": "object",
  "properties": {
    "game_id": {
      "type": "string",
      "description": "ID do jogo"
    },
    "game_title": {
      "type": "string",
      "description": "T\u00edtulo do jogo"
    },
    "session_start": {
      "type": "string",
      "format": "date-time",
      "description": "In\u00edcio da sess\u00e3o"
    },
    "session_end": {
      "type": "string",
      "format": "date-time",
      "description": "Fim da sess\u00e3o"
    },
    "current_difficulty": {
      "type": "string",
      "enum": [
        "muito_facil",
        "facil",
        "medio",
        "dificil",
        "muito_dificil"
      ],
      "default": "medio",
      "description": "Dificuldade atual adaptada"
    },
    "initial_difficulty": {
      "type": "string",
      "description": "Dificuldade inicial baseada no perfil"
    },
    "performance_metrics": {
      "type": "object",
      "properties": {
        "correct_answers": {
          "type": "number",
          "default": 0
        },
        "incorrect_answers": {
          "type": "number",
          "default": 0
        },
        "hints_used": {
          "type": "number",
          "default": 0
        },
        "average_response_time": {
          "type": "number",
          "description": "Tempo m\u00e9dio de resposta em segundos"
        },
        "accuracy_rate": {
          "type": "number",
          "description": "Taxa de acerto em porcentagem"
        },
        "focus_breaks": {
          "type": "number",
          "default": 0,
          "description": "N\u00famero de pausas por perda de foco"
        },
        "streak": {
          "type": "number",
          "default": 0,
          "description": "Sequ\u00eancia de acertos consecutivos"
        },
        "best_streak": {
          "type": "number",
          "default": 0
        }
      }
    },
    "difficulty_adjustments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "timestamp": {
            "type": "string",
            "format": "date-time"
          },
          "from_difficulty": {
            "type": "string"
          },
          "to_difficulty": {
            "type": "string"
          },
          "reason": {
            "type": "string"
          }
        }
      },
      "description": "Hist\u00f3rico de ajustes de dificuldade"
    },
    "rewards_earned": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "points",
              "badge",
              "achievement",
              "bonus"
            ]
          },
          "value": {
            "type": "number"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        }
      }
    },
    "completed": {
      "type": "boolean",
      "default": false
    },
    "final_score": {
      "type": "number",
      "default": 0
    },
    "bonus_multiplier": {
      "type": "number",
      "default": 1,
      "description": "Multiplicador de pontos por performance"
    }
  },
  "required": [
    "game_id",
    "game_title"
  ]
}