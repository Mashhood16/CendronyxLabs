import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../store';
import { SavedSimulation } from '../services/customSimService';

type ShapeType = SavedSimulation['shapes'][number]['type'];

interface InteractiveCanvasProps {
  shapes: SavedSimulation['shapes'];
  onShapesChange: (shapes: SavedSimulation['shapes']) => void;
  selectedShapeId: string | null;
  onSelectShape: (id: string | null) => void;
  tool: ShapeType | 'select' | 'delete';
  isDark: boolean;
  /** If true, the canvas is in "playback" mode (no editing) */
  previewMode?: boolean;
  /** Current evaluated shape positions for playback */
  previewShapes?: Array<{ id: string; type: ShapeType; x: number; y: number; x2?: number; y2?: number; x3?: number; y3?: number; radius?: number; width?: number; height?: number; angle?: number; strokeWidth?: number; textContent?: string; fontSize?: number; color: string }>;
}

interface DragState {
  shapeId: string;
  field: string;
  startX: number;
  startY: number;
  startValue: number;
}

/**
 * Microsoft Paint-style interactive SVG canvas.
 * Users click to place shapes, drag to reposition, and select to edit.
 */
export default function InteractiveCanvas({
  shapes,
  onShapesChange,
  selectedShapeId,
  onSelectShape,
  tool,
  isDark,
  previewMode = false,
  previewShapes,
}: InteractiveCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [canvasSize] = useState({ width: 800, height: 500 });

  // Convert screen coords to SVG coords
  const screenToSvg = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvasSize.width;
    const y = ((clientY - rect.top) / rect.height) * canvasSize.height;
    return { x: Math.round(x), y: Math.round(y) };
  }, [canvasSize]);

  // Handle click on canvas to place shape
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (previewMode) return;
    if (tool === 'select' || tool === 'delete') return;

    const { x, y } = screenToSvg(e.clientX, e.clientY);
    const id = `shape-${Math.random().toString(36).substring(2, 7)}`;

    let newShape: SavedSimulation['shapes'][number];

    switch (tool) {
      case 'circle':
        newShape = { id, type: 'circle', color: '#6366f1', xExpr: String(x), yExpr: String(y), radiusExpr: '25' };
        break;
      case 'rectangle':
        newShape = { id, type: 'rectangle', color: '#3b82f6', xExpr: String(x), yExpr: String(y), widthExpr: '80', heightExpr: '50', angleExpr: '0' };
        break;
      case 'line':
        newShape = { id, type: 'line', color: '#94a3b8', xExpr: String(x), yExpr: String(y), x2Expr: String(x + 100), y2Expr: String(y), strokeWidth: '3' };
        break;
      case 'triangle':
        newShape = { id, type: 'triangle', color: '#22c55e', xExpr: String(x), yExpr: String(y - 30), x2Expr: String(x - 40), y2Expr: String(y + 30), x3Expr: String(x + 40), y3Expr: String(y + 30) };
        break;
      case 'text':
        newShape = { id, type: 'text', color: '#f59e0b', xExpr: String(x), yExpr: String(y), textExpr: '"Label"', fontSizeExpr: '16' };
        break;
      default:
        return;
    }

    onShapesChange([...shapes, newShape]);
    onSelectShape(id);
  }, [tool, shapes, onShapesChange, onSelectShape, screenToSvg, previewMode]);

  // Handle clicking on a shape
  const handleShapeClick = useCallback((e: React.MouseEvent, shapeId: string) => {
    e.stopPropagation();
    if (previewMode) return;
    if (tool === 'delete') {
      onShapesChange(shapes.filter(s => s.id !== shapeId));
      onSelectShape(null);
      return;
    }
    onSelectShape(shapeId);
  }, [tool, shapes, onShapesChange, onSelectShape, previewMode]);

  // Drag handling
  const handleMouseDown = useCallback((e: React.MouseEvent, shapeId: string, field: string, startVal: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (previewMode) return;
    onSelectShape(shapeId);
    setDragState({ shapeId, field, startX: e.clientX, startY: e.clientY, startValue: startVal });
  }, [onSelectShape, previewMode]);

  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = canvasSize.width / rect.width;
      const delta = dragState.field.includes('x') || dragState.field === 'x2Expr' || dragState.field === 'x3Expr'
        ? dx * scale
        : dy * scale;
      const newVal = Math.round(dragState.startValue + delta);

      const updated = shapes.map(s => {
        if (s.id !== dragState.shapeId) return s;
        return { ...s, [dragState.field]: String(newVal) };
      });
      onShapesChange(updated);
    };

    const handleMouseUp = () => setDragState(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, shapes, onShapesChange, canvasSize]);

  // Get static numeric value from expression (for non-animated shapes)
  const getStaticNum = (expr?: string): number => {
    if (!expr) return 0;
    const n = parseFloat(expr);
    return isNaN(n) ? 0 : n;
  };

  const renderShape = (shape: SavedSimulation['shapes'][number], idx: number, isPreview?: boolean) => {
    const isSelected = shape.id === selectedShapeId && !previewMode;
    const x = getStaticNum(shape.xExpr);
    const y = getStaticNum(shape.yExpr);

    const selectionRing = isSelected ? (
      <circle cx={x} cy={y} r={12} fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2" className="pointer-events-none" />
    ) : null;

    const dragHandle = isSelected && !previewMode ? (
      <circle
        cx={x} cy={y} r={6}
        fill="#6366f1" stroke="white" strokeWidth="2"
        className="cursor-move"
        onMouseDown={(e) => handleMouseDown(e, shape.id, shape.type === 'circle' ? 'xExpr' : 'xExpr', x)}
      />
    ) : null;

    const clickHandler = (e: React.MouseEvent) => handleShapeClick(e, shape.id);

    switch (shape.type) {
      case 'circle': {
        const r = getStaticNum(shape.radiusExpr);
        return (
          <g key={shape.id}>
            {selectionRing}
            <circle
              cx={x} cy={y} r={Math.max(5, r)}
              fill={shape.color}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={clickHandler}
              onMouseDown={(e) => { e.stopPropagation(); if (!previewMode) { onSelectShape(shape.id); handleMouseDown(e, shape.id, 'xExpr', x); } }}
            />
            {dragHandle}
          </g>
        );
      }
      case 'rectangle': {
        const w = getStaticNum(shape.widthExpr);
        const h = getStaticNum(shape.heightExpr);
        const angle = getStaticNum(shape.angleExpr);
        return (
          <g key={shape.id}>
            {selectionRing}
            <rect
              x={x - w / 2} y={y - h / 2}
              width={Math.max(5, w)} height={Math.max(5, h)}
              fill={shape.color}
              transform={angle ? `rotate(${angle} ${x} ${y})` : undefined}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={clickHandler}
              onMouseDown={(e) => { e.stopPropagation(); if (!previewMode) { onSelectShape(shape.id); handleMouseDown(e, shape.id, 'xExpr', x); } }}
            />
            {dragHandle}
          </g>
        );
      }
      case 'line': {
        const x2 = getStaticNum(shape.x2Expr);
        const y2 = getStaticNum(shape.y2Expr);
        const sw = getStaticNum(shape.strokeWidth || '3');
        const mx = (x + x2) / 2;
        const my = (y + y2) / 2;
        return (
          <g key={shape.id}>
            {isSelected && !previewMode && (
              <>
                <circle cx={x} cy={y} r={5} fill="#6366f1" stroke="white" strokeWidth="2" className="cursor-move"
                  onMouseDown={(e) => handleMouseDown(e, shape.id, 'xExpr', x)} />
                <circle cx={x2} cy={y2} r={5} fill="#6366f1" stroke="white" strokeWidth="2" className="cursor-move"
                  onMouseDown={(e) => handleMouseDown(e, shape.id, 'x2Expr', x2)} />
              </>
            )}
            <line
              x1={x} y1={y} x2={x2} y2={y2}
              stroke={shape.color}
              strokeWidth={Math.max(1, sw)}
              strokeLinecap="round"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={clickHandler}
              onMouseDown={(e) => { e.stopPropagation(); if (!previewMode) { onSelectShape(shape.id); handleMouseDown(e, shape.id, 'xExpr', x); } }}
            />
          </g>
        );
      }
      case 'triangle': {
        const x2 = getStaticNum(shape.x2Expr);
        const y2 = getStaticNum(shape.y2Expr);
        const x3 = getStaticNum(shape.x3Expr);
        const y3 = getStaticNum(shape.y3Expr);
        return (
          <g key={shape.id}>
            {selectionRing}
            <polygon
              points={`${x},${y} ${x2},${y2} ${x3},${y3}`}
              fill={shape.color}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={clickHandler}
              onMouseDown={(e) => { e.stopPropagation(); if (!previewMode) { onSelectShape(shape.id); handleMouseDown(e, shape.id, 'xExpr', x); } }}
            />
            {dragHandle}
          </g>
        );
      }
      case 'text': {
        const fontSize = getStaticNum(shape.fontSizeExpr || '16');
        const displayText = shape.textExpr?.replace(/"/g, '') || 'Label';
        return (
          <g key={shape.id}>
            {selectionRing}
            <text
              x={x} y={y}
              fill={shape.color}
              fontSize={Math.max(10, fontSize)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono font-semibold cursor-pointer select-none hover:opacity-80 transition-opacity"
              onClick={clickHandler}
              onMouseDown={(e) => { e.stopPropagation(); if (!previewMode) { onSelectShape(shape.id); handleMouseDown(e, shape.id, 'xExpr', x); } }}
            >
              {displayText}
            </text>
            {dragHandle}
          </g>
        );
      }
      default:
        return null;
    }
  };

  // If in preview mode, render the evaluated shapes
  const displayShapes = previewMode && previewShapes
    ? previewShapes.map((ps) => ({
        ...shapes.find(s => s.id === ps.id),
        ...ps,
      }))
    : shapes;

  return (
    <div className={`relative w-full h-full rounded-2xl border overflow-hidden ${isDark ? 'bg-[#0a0a0e] border-slate-800' : 'bg-white border-slate-200'}`}>
      {/* Canvas grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="canvas-grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#canvas-grid)" />
        </svg>
      </div>

      {/* Canvas crosshair guides when placing */}
      {tool !== 'select' && tool !== 'delete' && !previewMode && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-400/20" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-400/20" />
        </div>
      )}

      {/* Tool indicator */}
      {!previewMode && (
        <div className={`absolute top-2 right-2 z-20 px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
          isDark ? 'bg-black/60 text-slate-400 border border-slate-800' : 'bg-white/80 text-slate-500 border border-slate-200'
        }`}>
          {tool === 'select' ? '👆 Select & Drag' : tool === 'delete' ? '🗑️ Click to Delete' : `✏️ Click to Place ${tool}`}
        </div>
      )}

      {/* Shape count */}
      {!previewMode && (
        <div className={`absolute bottom-2 left-2 z-20 px-2 py-1 rounded-lg text-[9px] font-bold ${
          isDark ? 'bg-black/60 text-slate-500' : 'bg-white/80 text-slate-400'
        }`}>
          {shapes.length} shape{shapes.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        className="w-full h-full relative z-10"
        style={{ cursor: previewMode ? 'default' : tool === 'select' ? 'default' : tool === 'delete' ? 'crosshair' : 'crosshair' }}
        onClick={handleCanvasClick}
      >
        {displayShapes.map((shape, idx) => renderShape(shape as any, idx, previewMode))}
      </svg>
    </div>
  );
}
