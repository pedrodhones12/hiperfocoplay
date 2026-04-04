{
  "name": "LearningPathProgress",
  "type": "object",
  "properties": {
    "learning_path_id": {
      "type": "string",
      "description": "ID da trilha de aprendizagem"
    },
    "learning_path_title": {
      "type": "string",
      "description": "T\u00edtulo da trilha para refer\u00eancia"
    },
    "enrolled_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data de inscri\u00e7\u00e3o"
    },
    "completed": {
      "type": "boolean",
      "default": false,
      "description": "Se completou a trilha"
    },
    "completion_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data de conclus\u00e3o"
    },
    "current_step": {
      "type": "number",
      "default": 0,
      "description": "Etapa atual (\u00edndice)"
    },
    "completed_steps": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "description": "\u00cdndices das etapas completadas"
    },
    "total_time_spent": {
      "type": "number",
      "default": 0,
      "description": "Tempo total gasto em minutos"
    },
    "certificate_earned": {
      "type": "boolean",
      "default": false,
      "description": "Se ganhou certificado"
    },
    "certificate_url": {
      "type": "string",
      "description": "URL do certificado gerado"
    }
  },
  "required": [
    "learning_path_id",
    "learning_path_title"
  ]
}