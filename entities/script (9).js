{
  "name": "GameProgress",
  "type": "object",
  "properties": {
    "game_id": {
      "type": "string",
      "description": "ID do jogo"
    },
    "game_title": {
      "type": "string",
      "description": "T\u00edtulo do jogo para refer\u00eancia"
    },
    "completed": {
      "type": "boolean",
      "default": false,
      "description": "Se o jogo foi completado"
    },
    "score": {
      "type": "number",
      "default": 0,
      "description": "Pontua\u00e7\u00e3o obtida"
    },
    "attempts": {
      "type": "number",
      "default": 0,
      "description": "N\u00famero de tentativas"
    },
    "time_spent": {
      "type": "number",
      "default": 0,
      "description": "Tempo gasto em minutos"
    },
    "last_played": {
      "type": "string",
      "format": "date-time",
      "description": "\u00daltima vez que jogou"
    },
    "achievements": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Conquistas desbloqueadas"
    }
  },
  "required": [
    "game_id",
    "game_title"
  ]
}