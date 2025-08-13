import React, { useState, useEffect } from 'react';
import { MermaidExporter } from '../../core/services/MermaidExporter';

export const ExportPanel = ({
  diagramState,
  isVisible,
  onClose
}) => {
  const [mermaidCode, setMermaidCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Generar código Mermaid cuando cambie el estado
  useEffect(() => {
    if (isVisible) {
      const validation = MermaidExporter.validateDiagram(diagramState);
      setValidationErrors(validation.errors);
      
      if (validation.valid) {
        const code = MermaidExporter.exportToMermaid(diagramState);
        setMermaidCode(code);
      } else {
        setMermaidCode('// El diagrama tiene errores. Revisa los nodos y conexiones.');
      }
    }
  }, [diagramState, isVisible]);

  // Copiar al portapapeles
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mermaidCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
      // Fallback para navegadores sin soporte de clipboard
      const textArea = document.createElement('textarea');
      textArea.value = mermaidCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Descargar como archivo
  const handleDownload = () => {
    const blob = new Blob([mermaidCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagrama-${diagramState.diagramType}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid #e2e8f0',
      boxShadow: '-4px 0 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          Exportar Mermaid
        </h2>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            fontSize: '18px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Errores de validación */}
      {validationErrors.length > 0 && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          borderBottom: '1px solid #fecaca'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#dc2626' }}>
            Errores encontrados:
          </h3>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#dc2626' }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Información del diagrama */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          <div><strong>Tipo:</strong> {diagramState.diagramType}</div>
          <div><strong>Nodos:</strong> {diagramState.nodes.length}</div>
          <div><strong>Conexiones:</strong> {diagramState.edges.length}</div>
        </div>
      </div>

      {/* Acciones */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={handleCopy}
          disabled={validationErrors.length > 0}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: copied ? '#10b981' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: validationErrors.length > 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: validationErrors.length > 0 ? 0.5 : 1
          }}
        >
          {copied ? '✅ Copiado' : '📋 Copiar'}
        </button>

        <button
          onClick={handleDownload}
          disabled={validationErrors.length > 0}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: validationErrors.length > 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: validationErrors.length > 0 ? 0.5 : 1
          }}
        >
          📥 Descargar
        </button>
      </div>

      {/* Código generado */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 16px 8px 16px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
            Código Mermaid:
          </h3>
        </div>
        
        <div style={{ flex: 1, padding: '0 16px 16px 16px' }}>
          <textarea
            value={mermaidCode}
            readOnly
            style={{
              width: '100%',
              height: '100%',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '12px',
              resize: 'none',
              backgroundColor: '#f9fafb',
              lineHeight: '1.4'
            }}
          />
        </div>
      </div>

      {/* Instrucciones */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e2e8f0',
        fontSize: '12px',
        color: '#6b7280',
        lineHeight: '1.4'
      }}>
        <strong>Instrucciones:</strong>
        <ol style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
          <li>Copia el código generado</li>
          <li>Pégalo en cualquier editor compatible con Mermaid</li>
          <li>O úsalo directamente en GitHub, GitLab, etc.</li>
        </ol>
      </div>
    </div>
  );
};