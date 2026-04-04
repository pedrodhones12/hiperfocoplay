{
  "name": "EraProgress",
  "type": "object",
  "properties": {
    "era_id": {
      "type": "string",
      "description": "ID da era"
    },
    "era_title": {
      "type": "string",
      "description": "T\u00edtulo da era para refer\u00eancia"
    },
    "started_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data de in\u00edcio"
    },
    "completed": {
      "type": "boolean",
      "default": false
    },
    "completion_date": {
      "type": "string",
      "format": "date-time"
    },
    "current_mission_index": {
      "type": "number",
      "default": 0
    },
    "missions_completed": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "IDs das miss\u00f5es completadas"
    },
    "total_time_spent_minutes": {
      "type": "number",
      "default": 0
    },
    "pause_count": {
      "type": "number",
      "default": 0,
      "description": "Quantas vezes pausou conscientemente"
    },
    "hyperfocus_patterns": {
      "type": "object",
      "properties": {
        "longest_session_minutes": {
          "type": "number"
        },
        "average_session_minutes": {
          "type": "number"
        },
        "preferred_mission_type": {
          "type": "string"
        },
        "decision_speed": {
          "type": "string",
          "enum": [
            "rapid",
            "thoughtful",
            "deep"
          ]
        }
      }
    },
    "skills_discovered": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "skill_name": {
            "type": "string"
          },
          "confidence_level": {
            "type": "number"
          },
          "evidence_count": {
            "type": "number"
          }
        }
      }
    },
    "narrative_choices": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "mission_id": {
            "type": "string"
          },
          "choice_text": {
            "type": "string"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time"
          }
        }
      }
    }
  },
  "required": [
    "era_id",
    "era_title"
  ]
}