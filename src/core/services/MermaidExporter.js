import { DIAGRAM_TYPES, NODE_TYPES } from '../types/DiagramTypes';

export class MermaidExporter {
  
  /**
   * Exporta el estado del diagrama a código Mermaid
   */
  static exportToMermaid(diagramState) {
    const { diagramType, nodes, edges } = diagramState;
    
    switch (diagramType) {
      case DIAGRAM_TYPES.FLOWCHART:
        return this.exportFlowchart(nodes, edges);
      case DIAGRAM_TYPES.SEQUENCE:
        return this.exportSequence(nodes, edges);
      case DIAGRAM_TYPES.CLASS_DIAGRAM:
        return this.exportClassDiagram(nodes, edges);
      case DIAGRAM_TYPES.STATE_DIAGRAM:
        return this.exportStateDiagram(nodes, edges);
      case DIAGRAM_TYPES.ENTITY_RELATIONSHIP:
        return this.exportERDiagram(nodes, edges);
      default:
        return this.exportFlowchart(nodes, edges);
    }
  }

  /**
   * Exporta diagrama de flujo
   */
  static exportFlowchart(nodes, edges) {
    let mermaidCode = 'flowchart TD\n';
    
    // Separar subgraphs de nodos normales
    const subgraphs = nodes.filter(node => node.type === NODE_TYPES.SUBGRAPH);
    const normalNodes = nodes.filter(node => node.type !== NODE_TYPES.SUBGRAPH);
    
    // Agregar nodos normales que no están en subgraphs
    const nodesInSubgraphs = [];
    subgraphs.forEach(sg => {
      if (sg.data.childNodes) {
        nodesInSubgraphs.push(...sg.data.childNodes);
      }
    });
    
    normalNodes.forEach(node => {
      if (!nodesInSubgraphs.includes(node.id)) {
        const nodeId = this.sanitizeId(node.id);
        const label = this.sanitizeLabel(node.data.label);
        const shape = this.getFlowchartNodeShape(node);
        
        mermaidCode += `    ${nodeId}${shape.start}${label}${shape.end}\n`;
      }
    });
    
    // Agregar subgraphs
    subgraphs.forEach((subgraph, index) => {
      const sgId = this.sanitizeId(subgraph.id);
      const sgLabel = this.sanitizeLabel(subgraph.data.label);
      
      mermaidCode += `\n    subgraph ${sgId} ["${sgLabel}"]\n`;
      
      // Agregar nodos dentro del subgraph
      if (subgraph.data.childNodes) {
        subgraph.data.childNodes.forEach(childNodeId => {
          const childNode = normalNodes.find(n => n.id === childNodeId);
          if (childNode) {
            const nodeId = this.sanitizeId(childNode.id);
            const label = this.sanitizeLabel(childNode.data.label);
            const shape = this.getFlowchartNodeShape(childNode);
            
            mermaidCode += `        ${nodeId}${shape.start}${label}${shape.end}\n`;
          }
        });
      }
      
      mermaidCode += `    end\n`;
    });
    
    // Agregar conexiones
    edges.forEach(edge => {
      const sourceId = this.sanitizeId(edge.source);
      const targetId = this.sanitizeId(edge.target);
      const arrow = this.getFlowchartArrow(edge);
      
      if (edge.label) {
        const edgeLabel = this.sanitizeLabel(edge.label);
        mermaidCode += `    ${sourceId} ${arrow}|${edgeLabel}| ${targetId}\n`;
      } else {
        mermaidCode += `    ${sourceId} ${arrow} ${targetId}\n`;
      }
    });
    
    return mermaidCode;
  }

  /**
   * Exporta diagrama de secuencia
   */
  static exportSequence(nodes, edges) {
    let mermaidCode = 'sequenceDiagram\n';
    
    // En diagramas de secuencia, los nodos son participantes
    nodes.forEach(node => {
      const nodeId = this.sanitizeId(node.id);
      const label = this.sanitizeLabel(node.data.label);
      mermaidCode += `    participant ${nodeId} as ${label}\n`;
    });
    
    // Las conexiones son mensajes entre participantes
    edges.forEach(edge => {
      const sourceId = this.sanitizeId(edge.source);
      const targetId = this.sanitizeId(edge.target);
      const message = edge.label ? this.sanitizeLabel(edge.label) : 'mensaje';
      
      mermaidCode += `    ${sourceId}->>+${targetId}: ${message}\n`;
    });
    
    return mermaidCode;
  }

  /**
   * Exporta diagrama de clases
   */
  static exportClassDiagram(nodes, edges) {
    let mermaidCode = 'classDiagram\n';
    
    // Agregar clases
    nodes.forEach(node => {
      const nodeId = this.sanitizeId(node.id);
      
      mermaidCode += `    class ${nodeId} {\n`;
      mermaidCode += `        +String name\n`;
      mermaidCode += `        +method()\n`;
      mermaidCode += `    }\n`;
    });
    
    // Agregar relaciones
    edges.forEach(edge => {
      const sourceId = this.sanitizeId(edge.source);
      const targetId = this.sanitizeId(edge.target);
      const relation = edge.label || 'implements';
      
      mermaidCode += `    ${sourceId} --|> ${targetId} : ${relation}\n`;
    });
    
    return mermaidCode;
  }

  /**
   * Exporta diagrama de estados
   */
  static exportStateDiagram(nodes, edges) {
    let mermaidCode = 'stateDiagram-v2\n';
    
    // Agregar estados
    nodes.forEach(node => {
      const nodeId = this.sanitizeId(node.id);
      const label = this.sanitizeLabel(node.data.label);
      
      if (node.type === 'start') {
        mermaidCode += `    [*] --> ${nodeId} : inicio\n`;
      } else if (node.type === 'end') {
        mermaidCode += `    ${nodeId} --> [*] : fin\n`;
      }
      
      mermaidCode += `    ${nodeId} : ${label}\n`;
    });
    
    // Agregar transiciones
    edges.forEach(edge => {
      const sourceId = this.sanitizeId(edge.source);
      const targetId = this.sanitizeId(edge.target);
      const condition = edge.label ? this.sanitizeLabel(edge.label) : 'transición';
      
      mermaidCode += `    ${sourceId} --> ${targetId} : ${condition}\n`;
    });
    
    return mermaidCode;
  }

  /**
   * Exporta diagrama entidad-relación
   */
  static exportERDiagram(nodes, edges) {
    let mermaidCode = 'erDiagram\n';
    
    // Agregar entidades
    nodes.forEach(node => {
      const nodeId = this.sanitizeId(node.id);
      
      mermaidCode += `    ${nodeId} {\n`;
      mermaidCode += `        string id PK\n`;
      mermaidCode += `        string name\n`;
      mermaidCode += `    }\n`;
    });
    
    // Agregar relaciones
    edges.forEach(edge => {
      const sourceId = this.sanitizeId(edge.source);
      const targetId = this.sanitizeId(edge.target);
      const relation = edge.label || 'tiene';
      
      mermaidCode += `    ${sourceId} ||--o{ ${targetId} : "${relation}"\n`;
    });
    
    return mermaidCode;
  }

  /**
   * Obtiene la forma del nodo para flowchart
   */
  static getFlowchartNodeShape(node) {
    switch (node.data.shape) {
      case 'circle':
        return { start: '((', end: '))' };
      case 'diamond':
        return { start: '{', end: '}' };
      case 'roundedRectangle':
        return { start: '(', end: ')' };
      case 'hexagon':
        return { start: '{{', end: '}}' };
      case 'parallelogram':
        return { start: '[/', end: '/]' };
      default: // rectangle
        return { start: '[', end: ']' };
    }
  }

  /**
   * Obtiene el tipo de flecha para flowchart
   */
  static getFlowchartArrow(edge) {
    switch (edge.type) {
      case 'straight':
        return '--->';
      case 'step':
        return '-.->';
      default:
        return '-->';
    }
  }

  /**
   * Limpia el ID para que sea válido en Mermaid
   */
  static sanitizeId(id) {
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  /**
   * Limpia la etiqueta para que sea válida en Mermaid
   */
  static sanitizeLabel(label) {
    return label.replace(/"/g, '\\"').replace(/\n/g, ' ');
  }

  /**
   * Valida si el diagrama se puede exportar
   */
  static validateDiagram(diagramState) {
    const errors = [];
    const { nodes, edges } = diagramState;
    
    if (nodes.length === 0) {
      errors.push('El diagrama debe tener al menos un nodo');
    }
    
    // Validar que todas las conexiones tengan nodos válidos
    edges.forEach(edge => {
      const sourceExists = nodes.some(node => node.id === edge.source);
      const targetExists = nodes.some(node => node.id === edge.target);
      
      if (!sourceExists) {
        errors.push(`Nodo origen no encontrado: ${edge.source}`);
      }
      if (!targetExists) {
        errors.push(`Nodo destino no encontrado: ${edge.target}`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}