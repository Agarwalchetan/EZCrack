export type ToolType =
  | 'pen'
  | 'brush'
  | 'pencil'
  | 'marker'
  | 'highlighter'
  | 'eraser'
  | 'select'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'polygon'
  | 'text'
  | 'sticky-note'
  | 'callout'
  | 'image'
  | 'measure';

export type PenType = 'ballpoint' | 'fountain' | 'marker' | 'highlighter';
export type BrushType = 'round' | 'flat' | 'textured' | 'spray';
export type BackgroundType = 'white' | 'transparent' | 'grid' | 'dots' | 'lined' | 'graph';
export type CanvasOrientation = 'portrait' | 'landscape' | 'square';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
  tilt?: { x: number; y: number };
  timestamp?: number;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  elements: CanvasElement[];
  order: number;
}

export interface CanvasElement {
  id: string;
  type: ToolType;
  layerId: string;
  points?: Point[];
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  fillColor?: string;
  strokeWidth: number;
  opacity: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  rotation?: number;
  penType?: PenType;
  brushType?: BrushType;
  pressure?: boolean;
  imageUrl?: string;
  imageData?: string;
  locked?: boolean;
  note?: string;
  calloutType?: 'rectangle' | 'rounded' | 'speech' | 'thought';
}

export interface CanvasSettings {
  width: number;
  height: number;
  background: BackgroundType;
  backgroundColor: string;
  gridSize: number;
  gridColor: string;
  orientation: CanvasOrientation;
  snapToGrid: boolean;
  showRuler: boolean;
}

export interface CanvasState {
  layers: Layer[];
  activeLayerId: string;
  settings: CanvasSettings;
  zoom: number;
  pan: { x: number; y: number };
  selectedElements: string[];
  clipboard: CanvasElement[];
}

export interface ToolSettings {
  color: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
  penType: PenType;
  brushType: BrushType;
  fontSize: number;
  fontFamily: string;
  pressureSensitivity: boolean;
  smoothing: number;
}

export interface UserCursor {
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
  tool: ToolType;
  timestamp: number;
}

export interface CanvasHistory {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
}

export interface StickyNote {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  fontSize: number;
  rotation: number;
}

export interface Callout {
  id: string;
  type: 'rectangle' | 'rounded' | 'speech' | 'thought';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  borderColor: string;
  pointerX?: number;
  pointerY?: number;
}

export interface CanvasPermission {
  userId: string;
  canvasId: string;
  role: 'viewer' | 'editor' | 'admin';
  grantedAt: string;
  grantedBy: string;
}

export interface CanvasExportOptions {
  format: 'png' | 'jpg' | 'pdf' | 'svg';
  quality: number;
  includeBackground: boolean;
  selectedLayersOnly: boolean;
  scale: number;
  bounds?: { x: number; y: number; width: number; height: number };
}
