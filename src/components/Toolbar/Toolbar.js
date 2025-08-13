import React from 'react';
import { DIAGRAM_TYPES } from '../../core/types/DiagramTypes';
import { getTemplatesByDiagram } from '../../core/constants/NodeTemplates';

const DIAGRAM_TYPE_LABELS = {
  [DIAGRAM_TYPES.FLOWCHART]: 'Diagrama de Flujo',
  [DIAGRAM_TYPES.SEQUENCE]: 'Diagrama de Secuencia', 
  [DIAGRAM_TYPES.CLASS_DIAGRAM]: 'Diagrama de Clases',
  [DIAGRAM_TYPES.STATE_DIAGRAM]: 'Diagrama de Estados',
  [DIAGRAM_TYPES.ENTITY_RELATIONSHIP]: 'Diagrama ER',
  [DIAGRAM_TYPES.GITGRAPH]: 'Git Graph'
};

export const Toolbar = ({
  diagramType,
  onDiagramTypeChange,
  onNodeAdd,
  onExport,
  onClear,
  selectedNodeType,
  onNodeTypeSelect
}) => {
  // Obtener plantillas disponibles para el tipo de diagrama actual
  const availableTemplates = getTemplatesByDiagram(diagramType);

  // Manejar arrastrar nodo
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
    onNodeTypeSelect(nodeType);
  };

  const handleDragEnd = () => {
    // Cleanup si es necesario
  };

  // Renderizar botón de nodo
  const renderNodeButton = (template) => (
    <div
      key={template.type}
      className={`node-button ${selectedNodeType === template.type ? 'selected' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, template.type)}
      onDragEnd={handleDragEnd}
      onClick={() => onNodeAdd(template.type)}
      title={template.description}
      style={{
        padding: '8px 12px',
        margin: '4px',
        border: selectedNodeType === template.type ? '2px solid #3b82f6' : '1px solid #e2e8f0',
        borderRadius: '6px',
        backgroundColor: selectedNodeType === template.type ? '#dbeafe' : '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '60px',
        fontSize: '12px',
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{ fontSize: '16px', marginBottom: '4px' }}>
        {template.icon}
      </span>
      <span>{template.label}</span>
    </div>
  );

  return (
    <div 
      className="toolbar" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '240px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '16px',
        gap: '16px',
        height: '100vh',
        overflowY: 'auto'
      }}
    >
      {/* Selector de tipo de diagrama */}
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
          Tipo de Diagrama
        </h3>
        <select
          value={diagramType}
          onChange={(e) => onDiagramTypeChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          {Object.entries(DIAGRAM_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Elementos disponibles */}
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
          Elementos
        </h3>
        <p style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          margin: '0 0 12px 0',
          lineHeight: '1.4'
        }}>
          Arrastra o haz clic para agregar elementos al diagrama
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {availableTemplates.map(renderNodeButton)}
        </div>
      </div>

      {/* Acciones */}
      <div style={{ marginTop: 'auto' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
          Acciones
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📤 Exportar Mermaid
          </button>
          
          <button
            onClick={onClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Limpiar Todo
          </button>
        </div>
      </div>

      {/* Instrucciones */}
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        lineHeight: '1.4',
        padding: '8px',
        backgroundColor: '#f9fafb',
        borderRadius: '4px',
        border: '1px solid #e5e7eb'
      }}>
        <strong>💡 Cómo usar:</strong>
        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
          <li><strong>Agregar:</strong> Haz clic en elementos o arrástralos</li>
          <li><strong>Arrastrar:</strong> Zona amplia alrededor de cada elemento</li>
          <li><strong>Seleccionar:</strong> Haz clic → aparece borde azul y botón ✕</li>
          <li><strong>Conectar:</strong> Aparecen puntos azules al pasar el mouse</li>
          <li><strong>Subgraphs:</strong> Contenedores para agrupar elementos</li>
          <li><strong>Eliminar:</strong> Botón ✕ o seleccionar + Delete</li>
        </ul>
        <div style={{ 
          marginTop: '8px', 
          padding: '4px 8px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '4px',
          fontSize: '11px'
        }}>
          <strong>🎯 Tip:</strong> Si no puedes arrastrar, haz clic primero para seleccionar
        </div>
      </div>
    </div>
  );
};