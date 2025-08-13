import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CustomNode } from './CustomNode';

// Tipos de nodos personalizados
const nodeTypes = {
  customNode: CustomNode,
};

export const DiagramCanvas = ({
  diagramState,
  onNodeSelect,
  onEdgeSelect,
  onConnect,
  onNodeMove,
  onNodeDelete,
  onEdgeDelete
}) => {
  // Convertir nodos internos a formato ReactFlow
  const reactFlowNodes = useMemo(() => {
    return diagramState.nodes.map(node => ({
      id: node.id,
      type: 'customNode',
      position: node.position,
      data: {
        ...node.data,
        nodeType: node.type,
        isSelected: diagramState.selectedNode === node.id,
        onDelete: () => onNodeDelete(node.id)
      },
      selected: diagramState.selectedNode === node.id,
      draggable: true, // Habilitar arrastre
      selectable: true, // Habilitar selección
      deletable: true // Habilitar eliminación
    }));
  }, [diagramState.nodes, diagramState.selectedNode, onNodeDelete]);

  // Convertir conexiones internas a formato ReactFlow
  const reactFlowEdges = useMemo(() => {
    return diagramState.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      label: edge.label,
      selected: diagramState.selectedEdge === edge.id,
      style: edge.style ? {
        stroke: edge.style.strokeColor,
        strokeWidth: edge.style.strokeWidth,
        strokeDasharray: edge.style.strokeDasharray
      } : undefined
    }));
  }, [diagramState.edges, diagramState.selectedEdge]);

  // Manejar conexiones entre nodos
  const handleConnect = useCallback((connection) => {
    if (connection.source && connection.target) {
      onConnect(connection.source, connection.target);
    }
  }, [onConnect]);

  // Manejar selección de nodos
  const handleNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    onNodeSelect(node.id);
  }, [onNodeSelect]);

  // Manejar selección de conexiones
  const handleEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    onEdgeSelect(edge.id);
  }, [onEdgeSelect]);

  // Manejar movimiento de nodos mientras se arrastra
  const handleNodeDrag = useCallback((event, node) => {
    // Opcional: actualizar en tiempo real mientras se arrastra
  }, []);

  // Manejar movimiento de nodos al finalizar el arrastre
  const handleNodeDragStop = useCallback((event, node) => {
    onNodeMove(node.id, { position: node.position });
  }, [onNodeMove]);

  // Manejar movimiento de múltiples nodos
  const handleNodesChange = useCallback((changes) => {
    changes.forEach(change => {
      if (change.type === 'position' && change.dragging === false) {
        // Actualizar posición cuando termine el arrastre
        onNodeMove(change.id, { position: change.position });
      }
    });
  }, [onNodeMove]);

  // Limpiar selección al hacer clic en el canvas
  const handlePaneClick = useCallback(() => {
    onNodeSelect(undefined);
    onEdgeSelect(undefined);
  }, [onNodeSelect, onEdgeSelect]);

  // Manejar teclas para eliminar elementos y prevenir selección múltiple
  const handleKeyDown = useCallback((event) => {
    // Prevenir selección múltiple con Ctrl/Cmd
    if (event.ctrlKey || event.metaKey) {
      // No prevenir Delete/Backspace con Ctrl
      if (event.key !== 'Delete' && event.key !== 'Backspace') {
        event.preventDefault();
        return;
      }
    }
    
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (diagramState.selectedNode) {
        onNodeDelete(diagramState.selectedNode);
      } else if (diagramState.selectedEdge) {
        onEdgeDelete(diagramState.selectedEdge);
      }
    }
  }, [diagramState.selectedNode, diagramState.selectedEdge, onNodeDelete, onEdgeDelete]);

  return (
    <div 
      className="diagram-canvas" 
      style={{ width: '100%', height: '100%' }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        nodeTypes={nodeTypes}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onNodesChange={handleNodesChange}
        onPaneClick={handlePaneClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        multiSelectionKeyCode={null} // Deshabilitar selección múltiple
        selectionOnDrag={false} // Deshabilitar selección al arrastrar
        panOnDrag={false} // Evitar pan accidental
        selectNodesOnDrag={false} // No seleccionar nodos al arrastrar
        style={{ background: '#f8f9fa' }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls />
        <MiniMap 
          style={{
            height: 120,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0'
          }}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

// Componente envolvente con provider
export const DiagramCanvasProvider = (props) => {
  return (
    <ReactFlowProvider>
      <DiagramCanvas {...props} />
    </ReactFlowProvider>
  );
};