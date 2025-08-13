import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { getTemplateByType } from '../../core/constants/NodeTemplates';
import { NODE_TYPES } from '../../core/types/DiagramTypes';

export const CustomNode = ({ data, selected }) => {
  const template = getTemplateByType(data.nodeType);
  
  // Si es un subgraph, renderizar de forma especial
  if (data.nodeType === NODE_TYPES.SUBGRAPH) {
    return (
      <div 
        className="subgraph-node" 
        style={{ 
          position: 'relative',
          // Zona de arrastre ampliada para subgraphs también
          padding: '8px',
          margin: '-8px',
          cursor: 'move'
        }}
      >
        {/* Handles para subgraph */}
        <Handle
          type="target"
          position={Position.Top}
          style={{ 
            top: 23, // Ajustado para el header
            left: '50%', 
            transform: 'translateX(-50%)',
            background: '#3b82f6',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{ 
            top: '50%', 
            right: 4, 
            transform: 'translateY(-50%)',
            background: '#3b82f6',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          style={{ 
            bottom: 4, 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: '#3b82f6',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          style={{ 
            top: '50%', 
            left: 4, 
            transform: 'translateY(-50%)',
            background: '#3b82f6',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />

        {/* Contenedor del subgraph */}
        <div style={{
          width: `${data.width || 300}px`,
          height: `${data.height || 200}px`,
          border: selected ? '3px solid #3b82f6' : '2px dashed #3b82f6',
          borderRadius: '8px',
          backgroundColor: selected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.02)',
          position: 'relative',
          transition: 'all 0.2s ease',
          boxShadow: selected 
            ? '0 0 0 1px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.3)' 
            : '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Header con título */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '12px',
            right: '40px', // Espacio para el botón de eliminar
            height: '30px',
            backgroundColor: '#3b82f6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: 10,
            cursor: 'move' // Cursor de arrastre en el header
          }}>
            📁 {data.label}
          </div>

          {/* Área de contenido */}
          <div style={{
            position: 'absolute',
            top: '46px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            border: '1px dashed #cbd5e1',
            borderRadius: '4px',
            backgroundColor: 'rgba(248, 250, 252, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '12px',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            {data.childNodes && data.childNodes.length > 0 ? (
              `${data.childNodes.length} elemento${data.childNodes.length !== 1 ? 's' : ''}`
            ) : (
              'Arrastra elementos aquí'
            )}
          </div>

          {/* Botón de eliminar para subgraph */}
          {selected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onDelete();
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '24px',
                height: '24px',
                border: 'none',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                zIndex: 100,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              title="Eliminar subgraph"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Estilos base según la forma del nodo
  const getShapeStyles = (shape) => {
    const baseStyles = {
      minWidth: '120px',
      minHeight: '40px',
      padding: '8px 16px',
      border: `2px solid ${data.style?.borderColor || '#3b82f6'}`,
      backgroundColor: data.style?.backgroundColor || '#ffffff',
      color: data.style?.textColor || '#1f2937',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: selected ? '0 0 0 2px #3b82f6' : '0 2px 4px rgba(0,0,0,0.1)'
    };

    switch (shape) {
      case 'circle':
        return {
          ...baseStyles,
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          minWidth: '60px',
          minHeight: '60px'
        };
      case 'diamond':
        return {
          ...baseStyles,
          transform: 'rotate(45deg)',
          width: '60px',
          height: '60px',
          minWidth: '60px',
          minHeight: '60px'
        };
      case 'roundedRectangle':
        return {
          ...baseStyles,
          borderRadius: '12px'
        };
      case 'hexagon':
        return {
          ...baseStyles,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          width: '100px'
        };
      case 'parallelogram':
        return {
          ...baseStyles,
          transform: 'skew(-20deg)',
          padding: '8px 24px'
        };
      default: // rectangle
        return {
          ...baseStyles,
          borderRadius: '4px'
        };
    }
  };

  const nodeStyles = getShapeStyles(data.shape);
  
  // Posiciones de los handles según la forma - ajustadas para zona ampliada
  const getHandlePositions = (shape) => {
    if (shape === 'circle') {
      return {
        top: { top: '20%', left: '50%' },
        right: { top: '50%', right: '20%' },
        bottom: { bottom: '20%', left: '50%' },
        left: { top: '50%', left: '20%' }
      };
    }
    return {
      top: { top: 12, left: '50%' },
      right: { top: '50%', right: 12 },
      bottom: { bottom: 12, left: '50%' },
      left: { top: '50%', left: 12 }
    };
  };

  const handlePositions = getHandlePositions(data.shape);

  return (
    <div 
      className="custom-node" 
      style={{ 
        position: 'relative',
        // Zona de arrastre ampliada e invisible
        padding: '12px', // Espacio extra para hacer clic
        margin: '-12px', // Compensar el padding para mantener posición visual
        cursor: 'move'
      }}
    >
      {/* Handles para conexiones */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ 
          ...handlePositions.top, 
          transform: 'translate(-50%, -50%)',
          background: '#3b82f6',
          width: '8px',
          height: '8px',
          border: '2px solid white'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          ...handlePositions.right, 
          transform: 'translate(50%, -50%)',
          background: '#3b82f6',
          width: '8px',
          height: '8px',
          border: '2px solid white'
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ 
          ...handlePositions.bottom, 
          transform: 'translate(-50%, 50%)',
          background: '#3b82f6',
          width: '8px',
          height: '8px',
          border: '2px solid white'
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        style={{ 
          ...handlePositions.left, 
          transform: 'translate(-50%, -50%)',
          background: '#3b82f6',
          width: '8px',
          height: '8px',
          border: '2px solid white'
        }}
      />

      {/* Cuerpo del nodo - ahora dentro del área de arrastre ampliada */}
      <div 
        style={{
          ...nodeStyles,
          // Agregar un borde de selección visible cuando está seleccionado
          position: 'relative',
          boxShadow: selected 
            ? `0 0 0 2px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.3)` 
            : nodeStyles.boxShadow
        }}
        className="node-content" // Nueva clase para el contenido
      >
        {data.shape === 'diamond' ? (
          <div style={{ transform: 'rotate(-45deg)' }}>
            {data.label}
          </div>
        ) : data.shape === 'parallelogram' ? (
          <div style={{ transform: 'skew(20deg)' }}>
            {data.label}
          </div>
        ) : (
          <div>
            {template?.icon} {data.label}
          </div>
        )}
      </div>

      {/* Zona de arrastre visual (solo cuando está seleccionado) */}
      {selected && (
        <div 
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            right: '6px',
            bottom: '6px',
            border: '2px dashed #3b82f6',
            borderRadius: '8px',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            pointerEvents: 'none', // No interfiere con el arrastre
            zIndex: -1 // Detrás del contenido
          }}
        />
      )}

      {/* Botón de eliminar (reposicionado) */}
      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete();
          }}
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '24px',
            height: '24px',
            border: 'none',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            zIndex: 100, // Encima de todo
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          title="Eliminar nodo"
        >
          ✕
        </button>
      )}
    </div>
  );
};