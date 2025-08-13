import { NODE_TYPES, NODE_SHAPES, DIAGRAM_TYPES } from '../types/DiagramTypes';

// Plantillas de nodos disponibles
export const NODE_TEMPLATES = [
  {
    type: NODE_TYPES.START,
    label: 'Inicio',
    shape: NODE_SHAPES.CIRCLE,
    icon: '⚪',
    description: 'Punto de inicio del flujo',
    supportedDiagrams: [DIAGRAM_TYPES.FLOWCHART, DIAGRAM_TYPES.STATE_DIAGRAM]
  },
  {
    type: NODE_TYPES.PROCESS,
    label: 'Proceso',
    shape: NODE_SHAPES.RECTANGLE,
    icon: '📋',
    description: 'Proceso o acción',
    supportedDiagrams: [DIAGRAM_TYPES.FLOWCHART]
  },
  {
    type: NODE_TYPES.DECISION,
    label: 'Decisión',
    shape: NODE_SHAPES.DIAMOND,
    icon: '💎',
    description: 'Punto de decisión',
    supportedDiagrams: [DIAGRAM_TYPES.FLOWCHART]
  },
  {
    type: NODE_TYPES.END,
    label: 'Fin',
    shape: NODE_SHAPES.CIRCLE,
    icon: '🔴',
    description: 'Punto final del flujo',
    supportedDiagrams: [DIAGRAM_TYPES.FLOWCHART, DIAGRAM_TYPES.STATE_DIAGRAM]
  },
  {
    type: NODE_TYPES.CLASS,
    label: 'Clase',
    shape: NODE_SHAPES.RECTANGLE,
    icon: '📦',
    description: 'Clase en diagrama de clases',
    supportedDiagrams: [DIAGRAM_TYPES.CLASS_DIAGRAM]
  },
  {
    type: NODE_TYPES.ENTITY,
    label: 'Entidad',
    shape: NODE_SHAPES.RECTANGLE,
    icon: '🗃️',
    description: 'Entidad en diagrama ER',
    supportedDiagrams: [DIAGRAM_TYPES.ENTITY_RELATIONSHIP]
  },
  {
    type: NODE_TYPES.STATE,
    label: 'Estado',
    shape: NODE_SHAPES.ROUNDED_RECTANGLE,
    icon: '🔄',
    description: 'Estado en diagrama de estados',
    supportedDiagrams: [DIAGRAM_TYPES.STATE_DIAGRAM]
  },
  {
    type: NODE_TYPES.SUBGRAPH,
    label: 'Subgraph',
    shape: NODE_SHAPES.RECTANGLE,
    icon: '📁',
    description: 'Contenedor para agrupar elementos',
    supportedDiagrams: [DIAGRAM_TYPES.FLOWCHART]
  }
];

// Obtener plantillas por tipo de diagrama
export const getTemplatesByDiagram = (diagramType) => {
  return NODE_TEMPLATES.filter(template => 
    template.supportedDiagrams.includes(diagramType)
  );
};

// Obtener plantilla por tipo de nodo
export const getTemplateByType = (nodeType) => {
  return NODE_TEMPLATES.find(template => template.type === nodeType);
};