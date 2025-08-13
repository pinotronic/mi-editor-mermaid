// Tipos base para el editor de diagramas Mermaid (JavaScript version)

// Tipos de diagramas Mermaid soportados
export const DIAGRAM_TYPES = {
  FLOWCHART: 'flowchart',
  SEQUENCE: 'sequence',
  CLASS_DIAGRAM: 'classDiagram',
  STATE_DIAGRAM: 'stateDiagram',
  ENTITY_RELATIONSHIP: 'entityRelationship',
  GITGRAPH: 'gitgraph'
};

// Tipos de nodos según el diagrama
export const NODE_TYPES = {
  STANDARD: 'standard',
  DECISION: 'decision',
  PROCESS: 'process',
  START: 'start',
  END: 'end',
  CLASS: 'class',
  ENTITY: 'entity',
  STATE: 'state',
  SUBGRAPH: 'subgraph' // Nuevo tipo para contenedores
};

// Formas de nodos
export const NODE_SHAPES = {
  RECTANGLE: 'rectangle',
  ROUNDED_RECTANGLE: 'roundedRectangle',
  CIRCLE: 'circle',
  DIAMOND: 'diamond',
  HEXAGON: 'hexagon',
  PARALLELOGRAM: 'parallelogram'
};

// Tipos de conexiones
export const EDGE_TYPES = {
  DEFAULT: 'default',
  STRAIGHT: 'straight',
  SMOOTHSTEP: 'smoothstep',
  STEP: 'step'
};

// Estado inicial del diagrama
export const createInitialState = () => ({
  nodes: [],
  edges: [],
  diagramType: DIAGRAM_TYPES.FLOWCHART,
  selectedNode: undefined,
  selectedEdge: undefined
});

// Crear nuevo nodo
export const createNode = (id, type, label, position, shape = NODE_SHAPES.RECTANGLE) => ({
  id,
  type,
  label,
  position,
  data: {
    label,
    shape,
    properties: {},
    // Para subgraphs
    isSubgraph: type === NODE_TYPES.SUBGRAPH,
    childNodes: type === NODE_TYPES.SUBGRAPH ? [] : undefined,
    parentSubgraph: undefined, // ID del subgraph padre
    width: type === NODE_TYPES.SUBGRAPH ? 300 : undefined,
    height: type === NODE_TYPES.SUBGRAPH ? 200 : undefined
  }
});

// Crear nueva conexión
export const createEdge = (id, source, target, type = EDGE_TYPES.DEFAULT, label = null) => ({
  id,
  source,
  target,
  type,
  label,
  style: {}
});

// Funciones auxiliares para subgraphs
export const isNodeInsideSubgraph = (nodePosition, subgraphNode) => {
  if (!subgraphNode.data.isSubgraph) return false;
  
  const sg = subgraphNode;
  const sgLeft = sg.position.x;
  const sgRight = sg.position.x + (sg.data.width || 300);
  const sgTop = sg.position.y;
  const sgBottom = sg.position.y + (sg.data.height || 200);
  
  return nodePosition.x >= sgLeft && 
         nodePosition.x <= sgRight && 
         nodePosition.y >= sgTop && 
         nodePosition.y <= sgBottom;
};

export const addNodeToSubgraph = (nodes, nodeId, subgraphId) => {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return { ...node, data: { ...node.data, parentSubgraph: subgraphId } };
    }
    if (node.id === subgraphId && node.data.isSubgraph) {
      const childNodes = node.data.childNodes || [];
      if (!childNodes.includes(nodeId)) {
        return { 
          ...node, 
          data: { 
            ...node.data, 
            childNodes: [...childNodes, nodeId] 
          } 
        };
      }
    }
    return node;
  });
};

export const removeNodeFromSubgraph = (nodes, nodeId) => {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return { ...node, data: { ...node.data, parentSubgraph: undefined } };
    }
    if (node.data.isSubgraph && node.data.childNodes) {
      return {
        ...node,
        data: {
          ...node.data,
          childNodes: node.data.childNodes.filter(id => id !== nodeId)
        }
      };
    }
    return node;
  });
};