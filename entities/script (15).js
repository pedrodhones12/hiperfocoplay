{
  "name": "UserBadge",
  "type": "object",
  "properties": {
    "badge_id": {
      "type": "string",
      "description": "ID do badge conquistado"
    },
    "badge_name": {
      "type": "string",
      "description": "Nome do badge para refer\u00eancia"
    },
    "badge_emoji": {
      "type": "string",
      "description": "Emoji do badge"
    },
    "earned_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data que conquistou"
    },
    "progress_snapshot": {
      "type": "object",
      "description": "Estado do progresso quando conquistou"
    },
    "is_displayed": {
      "type": "boolean",
      "default": true,
      "description": "Se est\u00e1 exibido no perfil"
    }
  },
  "required": [
    "badge_id",
    "badge_name",
    "badge_emoji"
  ]
}