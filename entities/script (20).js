{
  "name": "Opportunity",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "T\u00edtulo da oportunidade"
    },
    "type": {
      "type": "string",
      "enum": [
        "vaga",
        "bolsa",
        "programa",
        "freelance",
        "estagio",
        "mentoria",
        "aceleradora"
      ],
      "description": "Tipo de oportunidade"
    },
    "organization": {
      "type": "string",
      "description": "Empresa/Institui\u00e7\u00e3o"
    },
    "sector": {
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
      "description": "Setor da oportunidade"
    },
    "description": {
      "type": "string",
      "description": "Descri\u00e7\u00e3o detalhada"
    },
    "location": {
      "type": "string",
      "description": "Localiza\u00e7\u00e3o"
    },
    "is_remote": {
      "type": "boolean",
      "default": false,
      "description": "Se \u00e9 remoto"
    },
    "is_international": {
      "type": "boolean",
      "default": false,
      "description": "Se \u00e9 internacional"
    },
    "country": {
      "type": "string",
      "description": "Pa\u00eds da oportunidade"
    },
    "required_skills": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Habilidades requeridas"
    },
    "application_url": {
      "type": "string",
      "description": "URL para aplicar"
    },
    "deadline": {
      "type": "string",
      "format": "date",
      "description": "Prazo de inscri\u00e7\u00e3o"
    },
    "salary_range": {
      "type": "string",
      "description": "Faixa salarial"
    },
    "benefits": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Benef\u00edcios oferecidos"
    },
    "is_neurodivergent_friendly": {
      "type": "boolean",
      "default": false,
      "description": "Se \u00e9 amig\u00e1vel para neurodivergentes"
    },
    "views": {
      "type": "number",
      "default": 0,
      "description": "Visualiza\u00e7\u00f5es"
    },
    "applications": {
      "type": "number",
      "default": 0,
      "description": "N\u00famero de candidaturas"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se est\u00e1 ativa"
    }
  },
  "required": [
    "title",
    "type",
    "organization",
    "sector",
    "description"
  ]
}