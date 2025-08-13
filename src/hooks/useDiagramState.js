import { useState, useCallback } from 'react';
import { 
  createInitialState, 
  createNode, 
  createEdge, 
  isNodeInsideSubgraph, 
  addNodeToSubgraph, 
  removeNodeFromSubgraph,
  NODE_TYPES 
} from '../core/types/DiagramTypes';
import { getTemplateByType } from '../core/constants/NodeTemplates';

export const useDiagramState = () => {
  const [diagramState, setDiagramState] = useState(createInitialState());

  // Función para calcular una posición libre
  const findFreePosition = useCallback((nodes, preferredPosition) => {
    const NODE_WIDTH = 120;
    const NODE_HEIGHT = 60;
    const SPACING = 20;
    
    // Si no hay nodos, usar la posición preferida
    if (nodes.length === 0) {
      return preferredPosition;
    }

    // Buscar una posición libre en una cuadrícula
    const gridSize = NODE_WIDTH + SPACING;
    
    // Probar posiciones en espiral hacia afuera
    for (let radius = 0; radius < 10; radius++) {
      for (let angle = 0; angle < 360; angle += 45) {
        const radians = (angle * Math.PI) / 180;
        const testX = preferredPosition.x + Math.cos(radians) * radius * gridSize;
        const testY = preferredPosition.y + Math.sin(radians) * radius * gridSize;
        
        // Verificar si esta posición está libre
        const isPositionFree = !nodes.some(node => {
          const dx = Math.abs(node.position.x - testX);
          const dy = Math.abs(node.position.y - testY);
          return dx < NODE_WIDTH + SPACING && dy < NODE_HEIGHT + SPACING;
        });
        
        if (isPositionFree) {
          return { x: testX, y: testY };
        }
      }
    }
    
    // Si no encuentra posición libre, usar un offset aleatorio
    return {
      x: preferredPosition.x + Math.random() * 200 - 100,
      y: preferredPosition.y + Math.random() * 200 - 100
    };
  }, []);

  // Agregar nodo con posicionamiento inteligente y detección de subgraphs
  const addNode = useCallback((nodeType, preferredPosition) => {
    const template = getTemplateByType(nodeType);
    if (!template) return;

    setDiagramState(prev => {
      // Encontrar una posición libre
      const freePosition = findFreePosition(prev.nodes, preferredPosition);
      
      const newNode = createNode(
        `node_${Date.now()}`,
        nodeType,
        template.label,
        freePosition,
        template.shape
      );

      // Si no es un subgraph, verificar si está dentro de algún subgraph existente
      let updatedNodes = [...prev.nodes, newNode];
      
      if (nodeType !== NODE_TYPES.SUBGRAPH) {
        const parentSubgraph = prev.nodes.find(node => 
          node.data.isSubgraph && isNodeInsideSubgraph(freePosition, node)
        );
        
        if (parentSubgraph) {
          updatedNodes = addNodeToSubgraph(updatedNodes, newNode.id, parentSubgraph.id);
        }
      }

      return {
        ...prev,
        nodes: updatedNodes
      };
    });
  }, [findFreePosition]);

  // Actualizar nodo con detección de subgraphs
  const updateNode = useCallback((nodeId, updates) => {
    setDiagramState(prev => {
      let updatedNodes = prev.nodes.map(node => 
        node.id === nodeId ? { 
          ...node, 
          ...updates,
          // Si se actualiza la posición, mantener la estructura correcta
          position: updates.position || node.position
        } : node
      );

      // Si se actualizó la posición y no es un subgraph, verificar contenedores
      if (updates.position) {
        const movedNode = updatedNodes.find(n => n.id === nodeId);
        if (movedNode && !movedNode.data.isSubgraph) {
          
          // Remover de subgraph actual si existe
          if (movedNode.data.parentSubgraph) {
            updatedNodes = removeNodeFromSubgraph(updatedNodes, nodeId);
          }
          
          // Buscar nuevo subgraph contenedor
          const newParentSubgraph = updatedNodes.find(node => 
            node.data.isSubgraph && 
            node.id !== nodeId && 
            isNodeInsideSubgraph(updates.position, node)
          );
          
          if (newParentSubgraph) {
            updatedNodes = addNodeToSubgraph(updatedNodes, nodeId, newParentSubgraph.id);
          }
        }
      }

      return {
        ...prev,
        nodes: updatedNodes
      };
    });
  }, []);

  // Eliminar nodo con manejo especial para subgraphs
  const deleteNode = useCallback((nodeId) => {
    setDiagramState(prev => {
      const nodeToDelete = prev.nodes.find(n => n.id === nodeId);
      
      let updatedNodes = prev.nodes.filter(node => node.id !== nodeId);
      
      // Si es un subgraph, liberar los nodos hijos
      if (nodeToDelete && nodeToDelete.data.isSubgraph && nodeToDelete.data.childNodes) {
        updatedNodes = updatedNodes.map(node => {
          if (nodeToDelete.data.childNodes.includes(node.id)) {
            return { ...node, data: { ...node.data, parentSubgraph: undefined } };
          }
          return node;
        });
      }
      
      // Si es un nodo normal, removerlo de su subgraph padre
      if (nodeToDelete && !nodeToDelete.data.isSubgraph && nodeToDelete.data.parentSubgraph) {
        updatedNodes = updatedNodes.map(node => {
          if (node.id === nodeToDelete.data.parentSubgraph && node.data.childNodes) {
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
      }

      return {
        ...prev,
        nodes: updatedNodes,
        edges: prev.edges.filter(edge => 
          edge.source !== nodeId && edge.target !== nodeId
        ),
        selectedNode: prev.selectedNode === nodeId ? undefined : prev.selectedNode
      };
    });
  }, []);

  // Agregar conexión
  const addEdge = useCallback((sourceId, targetId) => {
    setDiagramState(prev => {
      // Verificar si la conexión ya existe
      const edgeExists = prev.edges.some(edge => 
        edge.source === sourceId && edge.target === targetId
      );
      
      if (edgeExists) return prev;

      const newEdge = createEdge(
        `edge_${Date.now()}`,
        sourceId,
        targetId
      );

      return {
        ...prev,
        edges: [...prev.edges, newEdge]
      };
    });
  }, []);

  // Eliminar conexión
  const deleteEdge = useCallback((edgeId) => {
    setDiagramState(prev => ({
      ...prev,
      edges: prev.edges.filter(edge => edge.id !== edgeId),
      selectedEdge: prev.selectedEdge === edgeId ? undefined : prev.selectedEdge
    }));
  }, []);

  // Cambiar tipo de diagrama
  const setDiagramType = useCallback((diagramType) => {
    setDiagramState(prev => ({
      ...prev,
      diagramType,
      // Limpiar nodos no compatibles si es necesario
      nodes: prev.nodes.filter(node => {
        const template = getTemplateByType(node.type);
        return template?.supportedDiagrams.includes(diagramType);
      })
    }));
  }, []);

  // Seleccionar elemento
  const selectNode = useCallback((nodeId) => {
    setDiagramState(prev => ({
      ...prev,
      selectedNode: nodeId,
      selectedEdge: undefined
    }));
  }, []);

  const selectEdge = useCallback((edgeId) => {
    setDiagramState(prev => ({
      ...prev,
      selectedEdge: edgeId,
      selectedNode: undefined
    }));
  }, []);

  // Limpiar diagrama
  const clearDiagram = useCallback(() => {
    setDiagramState(createInitialState());
  }, []);

  return {
    diagramState,
    actions: {
      addNode,
      updateNode,
      deleteNode,
      addEdge,
      deleteEdge,
      setDiagramType,
      selectNode,
      selectEdge,
      clearDiagram
    }
  };
};