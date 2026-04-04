{
  "name": "Mission",
  "type": "object",
  "properties": {
    "era_id": {
      "type": "string",
      "description": "ID da era a qual pertence"
    },
    "title": {
      "type": "string",
      "description": "T\u00edtulo da miss\u00e3o"
    },
    "description": {
      "type": "string",
      "description": "Descri\u00e7\u00e3o da miss\u00e3o"
    },
    "order": {
      "type": "number",
      "description": "Ordem dentro da era"
    },
    "narrative_intro": {
      "type": "string",
      "description": "Texto narrativo de introdu\u00e7\u00e3o"
    },
    "mission_type": {
      "type": "string",
      "enum": [
        "exploration",
        "decision",
        "construction",
        "reflection",
        "creation"
      ],
      "description": "Tipo de miss\u00e3o"
    },
    "estimated_duration_minutes": {
      "type": "number",
      "description": "Dura\u00e7\u00e3o estimada em minutos"
    },
    "can_span_days": {
      "type": "boolean",
      "default": false,
      "description": "Se a miss\u00e3o pode ser feita ao longo de dias"
    },
    "stages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "order": {
            "type": "number"
          },
          "title": {
            "type": "string"
          },
          "narrative_text": {
            "type": "string"
          },
          "stage_type": {
            "type": "string",
            "enum": [
              "narration",
              "choice",
              "puzzle",
              "reflection",
              "consequence"
            ]
          },
          "choices": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "text": {
                  "type": "string"
                },
                "consequence_text": {
                  "type": "string"
                },
                "skill_detected": {
                  "type": "string"
                },
                "points": {
                  "type": "number"
                }
              }
            }
          },
          "pause_suggested": {
            "type": "boolean",
            "default": false
          },
          "pause_message": {
            "type": "string"
          }
        }
      }
    },
    "skills_mapped": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Habilidades que esta miss\u00e3o mapeia"
    },
    "unlock_requirements": {
      "type": "object",
      "properties": {
        "previous_mission_id": {
          "type": "string"
        },
        "cooldown_hours": {
          "type": "number",
          "default": 0
        }
      }
    },
    "is_active": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "era_id",
    "title",
    "order",
    "mission_type"
  ]
}