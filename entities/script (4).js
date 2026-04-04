{
  "name": "Character",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome do personagem"
    },
    "avatar_emoji": {
      "type": "string",
      "description": "Emoji principal do personagem",
      "default": "\ud83d\ude0a"
    },
    "skin_tone": {
      "type": "string",
      "enum": [
        "light",
        "medium-light",
        "medium",
        "medium-dark",
        "dark"
      ],
      "default": "medium",
      "description": "Tom de pele"
    },
    "outfit_color": {
      "type": "string",
      "enum": [
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "pink",
        "orange",
        "black",
        "white"
      ],
      "default": "blue",
      "description": "Cor da roupa"
    },
    "accessory": {
      "type": "string",
      "enum": [
        "none",
        "glasses",
        "hat",
        "crown",
        "headphones",
        "tie",
        "scarf"
      ],
      "default": "none",
      "description": "Acess\u00f3rio"
    },
    "hair_style": {
      "type": "string",
      "enum": [
        "short",
        "long",
        "curly",
        "straight",
        "bald"
      ],
      "default": "short",
      "description": "Estilo de cabelo"
    },
    "personality": {
      "type": "string",
      "enum": [
        "friendly",
        "serious",
        "funny",
        "wise",
        "energetic"
      ],
      "default": "friendly",
      "description": "Personalidade"
    },
    "is_active": {
      "type": "boolean",
      "default": false,
      "description": "Se \u00e9 o personagem ativo do usu\u00e1rio"
    },
    "favorite_category": {
      "type": "string",
      "enum": [
 