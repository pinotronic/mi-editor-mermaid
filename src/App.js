import React, { useState, useCallback, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { DiagramCanvasProvider } from './components/DiagramCanvas/DiagramCanvas';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ExportPanel } from './components/ExportPanel/ExportPanel';
import { useDiagramState } from './hooks/useDiagramState';
import { NODE_TYPES } from './core/types/DiagramTypes';
import './App.css';

const App = () => {
  const { diagramState, actions } = useDiagramState();
  const [selectedNodeType, setSelectedNodeType] = useState(NODE_TYPES.PROCESS);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(0); // Para posicionamiento
  const canvasRef = useRef(null);

  // Generar posición en rejilla para botones de agregar
  const generateGridPosition = useCallback(() => {
    const GRID_SIZE = 150;
    const COLS = 5; // 5 columnas
    const START_X = 100;
    const START_Y = 100;
    
    const col = nodeCounter % COLS;
    const row = Math.floor(nodeCounter / COLS);
    
    setNodeCounter(prev => prev + 1);
    
    return {
      x: START_X + col * GRID_SIZE,
      y: START_Y + row * GRID_SIZE
    };
  }, [nodeCounter]);

  // Manejar drop de nodos en el canvas
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    
    const nodeType = event.dataTransfer.getData('application/reactflow');
    if (!nodeType) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const position = {
      x: event.clientX - canvasRect.left - 60, // Centrar el nodo
      y: event.clientY - canvasRect.top - 20
    };

    actions.addNode(nodeType, position);
  }, [actions]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Manejar doble clic para agregar nodo
  const handleCanvasDoubleClick = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const position = {
      x: event.clientX - canvasRect.left - 60,
      y: event.clientY - canvasRect.top - 20
    };

    actions.addNode(selectedNodeType, position);
  }, [actions, selectedNodeType]);

  return (
    <div className="app">
      {/* Barra de herramientas */}
      <Toolbar
        diagramType={diagramState.diagramType}
        onDiagramTypeChange={actions.setDiagramType}
        onNodeAdd={(nodeType) => {
          // Agregar nodo en posición de rejilla automática
          const gridPosition = generateGridPosition();
          actions.addNode(nodeType, gridPosition);
        }}
        onExport={() => setShowExportPanel(true)}
        onClear={() => {
          actions.clearDiagram();
          setNodeCounter(0); // Reiniciar contador de posición
        }}
        selectedNodeType={selectedNodeType}
        onNodeTypeSelect={setSelectedNodeType}
      />

      {/* Área principal del canvas */}
      <div 
        className="canvas-container"
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDoubleClick={handleCanvasDoubleClick}
      >
        <ReactFlowProvider>
          <DiagramCanvasProvider
            diagramState={diagramState}
            onNodeSelect={actions.selectNode}
            onEdgeSelect={actions.selectEdge}
            onConnect={actions.addEdge}
            onNodeMove={(nodeId, updates) => actions.updateNode(nodeId, updates)}
            onNodeDelete={actions.deleteNode}
            onEdgeDelete={actions.deleteEdge}
          />
        </ReactFlowProvider>

        {/* Indicador de zona de drop */}
        <div className="drop-indicator">
          <p>
            🎯 Arrastra elementos aquí o haz doble clic para agregar
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Tipo actual: <strong>{selectedNodeType}</strong>
          </p>
        </div>
      </div>

      {/* Panel de exportación */}
      <ExportPanel
        diagramState={diagramState}
        isVisible={showExportPanel}
        onClose={() => setShowExportPanel(false)}
      />

      {/* Información de estado */}
      <div className="status-bar">
        <span>
          📊 {diagramState.diagramType} | 
          🔹 {diagramState.nodes.filter(n => !n.data.isSubgraph).length} nodos | 
          📁 {diagramState.nodes.filter(n => n.data.isSubgraph).length} subgraphs |
          🔗 {diagramState.edges.length} conexiones
        </span>
        {diagramState.selectedNode && (
          <span style={{ marginLeft: '16px', color: '#3b82f6' }}>
            ✅ {(() => {
              const selectedNode = diagramState.nodes.find(n => n.id === diagramState.selectedNode);
              if (selectedNode?.data.isSubgraph) {
                return `Subgraph: ${selectedNode.data.label}`;
              } else if (selectedNode?.data.parentSubgraph) {
                const parentSg = diagramState.nodes.find(n => n.id === selectedNode.data.parentSubgraph);
                return `${selectedNode.data.label} (en ${parentSg?.data.label || 'subgraph'})`;
              } else {
                return `Nodo: ${selectedNode?.data.label || diagramState.selectedNode}`;
              }
            })()}
          </span>
        )}
        {diagramState.selectedEdge && (
          <span style={{ marginLeft: '16px', color: '#10b981' }}>
            ✅ Conexión seleccionada: {diagramState.selectedEdge}
          </span>
        )}
      </div>
    </div>
  );
};

export default App;