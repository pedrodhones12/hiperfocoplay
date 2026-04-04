{
  "name": "Project",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "T\u00edtulo do projeto"
    },
    "description": {
      "type": "string",
      "description": "Descri\u00e7\u00e3o do projeto"
    },
    "category": {
      "type": "string",
      "enum": [
        "tecnologia",
        "saude",
        "educacao",
        "agricultura",
        "alimentacao",
        "energia",
        "financas",
        "comercio",
        "logistica",
        "turismo",
        "moda",
        "construcao",
        "entretenimento",
        "meio_ambiente",
        "midia",
        "servicos",
        "imobiliario",
        "seguranca"
      ],
      "description": "Setor do projeto"
    },
    "stage": {
      "type": "string",
      "enum": [
        "ideia",
        "validacao",
        "mvp",
        "lancamento",
        "crescimento"
      ],
      "default": "ideia",
      "description": "Est\u00e1gio do projeto"
    },
    "seeking_investment": {
      "type": "boolean",
      "default": false,
      "description": "Se est\u00e1 buscando investimento"
    },
    "investment_amount": {
      "type": "number",
      "description": "Valor de investimento buscado"
    },
    "pitch_video_url": {
      "type": "string",
      "description": "URL do v\u00eddeo de pitch"
    },
    "images": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "URLs de imagens do projeto"
    },
    "team_members": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Membros da equipe"
    },
    "skills_needed": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Habilidades necess\u00e1rias"
    },
    "website": {
      "type": "string",
      "description": "Website do projeto"
    },
    "is_public": {
      "type": "boolean",
      "default": true,
      "description": "Se o projeto \u00e9 p\u00fablico"
    },
    "likes": {
      "type": "number",
      "default": 0,
      "description": "N\u00famero de curtidas"
    },
    "views": {
      "type": "number",
      "default": 0,
      "description": "N\u00famero de visualiza\u00e7\u00f5es"
    }
  },
  "required": [
    "title",
    "description",
    "category"
  ]
}