{
  "name": "CompanyProfile",
  "type": "object",
  "properties": {
    "company_name": {
      "type": "string",
      "description": "Nome da empresa"
    },
    "logo_url": {
      "type": "string",
      "description": "URL do logo"
    },
    "description": {
      "type": "string",
      "description": "Descri\u00e7\u00e3o da empresa"
    },
    "website": {
      "type": "string",
      "description": "Site da empresa"
    },
    "industry": {
      "type": "string",
      "description": "Setor de atua\u00e7\u00e3o"
    },
    "size": {
      "type": "string",
      "enum": [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501+"
      ],
      "description": "Tamanho da empresa"
    },
    "location": {
      "type": "string",
      "description": "Localiza\u00e7\u00e3o principal"
    },
    "neurodiversity_program": {
      "type": "object",
      "properties": {
        "has_program": {
          "type": "boolean",
          "default": false
        },
        "program_name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "accommodations_offered": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "contact_email": {
      "type": "string",
      "description": "Email de contato"
    },
    "verified": {
      "type": "boolean",
      "default": false,
      "description": "Se a empresa foi verificada"
    },
    "verification_date": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "company_name",
    "description",
    "industry"
  ]
}