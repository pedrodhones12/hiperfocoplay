{
  "name": "HyperfocusDiscovery",
  "type": "object",
  "properties": {
    "primary_sector": {
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
      "description": "Setor principal descoberto"
    },
    "secondary_sectors": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Setores secund\u00e1rios de interesse"
    },
    "sector_scores": {
      "type": "object",
      "properties": {
        "tecnologia": {
          "type": "number"
        },
        "sustentabilidade": {
          "type": "number"
        },
        "cultura_criativo": {
          "type": "number"
        },
        "politica_juridico": {
          "type": "number"
        },
        "genia_ciencia": {
          "type": "number"
        },
        "agronegocio": {
          "type": "number"
        },
        "turismo": {
          "type": "number"
        },
        "economia_mar": {
          "type": "number"
        },
        "moda_design": {
          "type": "number"
        },
        "cidades_inteligentes": {
          "type": "number"
        },
        "healthtech": {
          "type": "number"
        }
      },
      "description": "Pontua\u00e7\u00e3o em cada setor"
    },
    "top_professions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Top 5 profiss\u00f5es recomendadas"
    },
    "cognitive_strengths": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Pontos fortes cognitivos identificados"
    },
    "test_completed_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data de conclus\u00e3o do teste"
    },
    "total_tests_taken": {
      "type": "number",
      "default": 1,
      "description": "N\u00famero de testes realizados"
    }
  },
  "required": [
    "primary_sector",
    "sector_scores"
  ]
}