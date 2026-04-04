{
  "name": "TalentProfile",
  "type": "object",
  "properties": {
    "portfolio_title": {
      "type": "string",
      "description": "T\u00edtulo do portf\u00f3lio"
    },
    "bio": {
      "type": "string",
      "description": "Biografia profissional"
    },
    "primary_sector": {
      "type": "string",
      "description": "Setor principal de atua\u00e7\u00e3o"
    },
    "target_professions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Profiss\u00f5es alvo"
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Habilidades t\u00e9cnicas"
    },
    "projects": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "link": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "description": "Projetos do portf\u00f3lio"
    },
    "certifications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "issuer": {
            "type": "string"
          },
          "date": {
            "type": "string"
          },
          "credential_url": {
            "type": "string"
          }
        }
      },
      "description": "Certifica\u00e7\u00f5es"
    },
    "languages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "language": {
            "type": "string"
          },
          "proficiency": {
            "type": "string",
            "enum": [
              "basico",
              "intermediario",
              "avancado",
              "fluente",
              "nativo"
            ]
          }
        }
      },
      "description": "Idiomas"
    },
    "open_to_opportunities": {
      "type": "boolean",
      "default": true,
      "description": "Aberto a oportunidades"
    },
    "preferred_work_mode": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "remoto",
          "hibrido",
          "presencial",
          "freelance"
        ]
      },
      "description": "Modo de trabalho preferido"
    },
    "portfolio_views": {
      "type": "number",
      "default": 0,
      "description": "Visualiza\u00e7\u00f5es do portf\u00f3lio"
    },
    "contact_email": {
      "type": "string",
      "description": "Email de contato profissional"
    },
    "linkedin_url": {
      "type": "string",
      "description": "URL do LinkedIn"
    },
    "github_url": {
      "type": "string",
      "description": "URL do GitHub"
    },
    "portfolio_url": {
      "type": "string",
      "description": "URL do portf\u00f3lio externo"
    },
    "is_public": {
      "type": "boolean",
      "default": true,
      "description": "Se o portf\u00f3lio \u00e9 p\u00fablico"
    }
  },
  "required": [
    "portfolio_title",
    "bio",
    "primary_sector"
  ]
}