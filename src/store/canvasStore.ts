import { create } from 'zustand';
import { CanvasState, Layer, CanvasElement, ToolSettings, CanvasSettings, ToolType } from '../types/canvas.types';

interface CanvasStore extends CanvasState {
  toolSettings: ToolSettings;
  activeTool: ToolType;
  history: {
    past: CanvasState[];
    future: CanvasState[];
  };

  setActiveTool: (tool: ToolType) => void;
  setToolSettings: (settings: Partial<ToolSettings>) => void;

  addLayer: (name?: string) => void;
  removeLayer: (layerId: string) => void;
  setActiveLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  reorderLayers: (layerIds: string[]) => void;

  addElement: (element: CanvasElement) => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  removeElement: (elementId: string) => void;
  removeElements: (elementIds: string[]) => void;

  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;

  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;

  copySelected: () => void;
  paste: () => void;

  undo: () => void;
  redo: () => void;

  updateSettings: (settings: Partial<CanvasSettings>) => void;

  resetCanvas: () => void;
  loadCanvas: (state: Partial<CanvasState>) => void;
}

const defaultSettings: CanvasSettings = {
  width: 1920,
  height: 1080,
  background: 'white',
  backgroundColor: '#ffffff',
  gridSize: 20,
  gridColor: '#e5e7eb',
  orientation: 'landscape',
  snapToGrid: false,
  showRuler: true,
};

const defaultToolSettings: ToolSettings = {
  color: '#000000',
  fillColor: '#ffffff',
  strokeWidth: 2,
  opacity: 1,
  penType: 'ballpoint',
  brushType: 'round',
  fontSize: 16,
  fontFamily: 'Inter, system-ui, sans-serif',
  pressureSensitivity: true,
  smoothing: 0.5,
};

const createInitialLayer = (): Layer => ({
  id: 'layer-1',
  name: 'Layer 1',
  visible: true,
  locked: false,
  opacity: 1,
  blendMode: 'normal',
  elements: [],
  order: 0,
});

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  layers: [createInitialLayer()],
  activeLayerId: 'layer-1',
  settings: defaultSettings,
  zoom: 1,
  pan: { x: 0, y: 0 },
  selectedElements: [],
  clipboard: [],
  toolSettings: defaultToolSettings,
  activeTool: 'pen',
  history: {
    past: [],
    future: [],
  },

  setActiveTool: (tool) => set({ activeTool: tool }),

  setToolSettings: (settings) =>
    set((state) => ({
      toolSettings: { ...state.toolSettings, ...settings },
    })),

  addLayer: (name) =>
    set((state) => {
      const newLayer: Layer = {
        id: `layer-${Date.now()}`,
        name: name || `Layer ${state.layers.length + 1}`,
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'normal',
        elements: [],
        order: state.layers.length,
      };
      return { layers: [...state.layers, newLayer] };
    }),

  removeLayer: (layerId) =>
    set((state) => {
      if (state.layers.length <= 1) return state;
      const newLayers = state.layers.filter((l) => l.id !== layerId);
      const newActiveId = state.activeLayerId === layerId
        ? newLayers[0].id
        : state.activeLayerId;
      return { layers: newLayers, activeLayerId: newActiveId };
    }),

  setActiveLayer: (layerId) => set({ activeLayerId: layerId }),

  updateLayer: (layerId, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      ),
    })),

  reorderLayers: (layerIds) =>
    set((state) => {
      const layerMap = new Map(state.layers.map((l) => [l.id, l]));
      const reordered = layerIds
        .map((id, index) => {
          const layer = layerMap.get(id);
          return layer ? { ...layer, order: index } : null;
        })
        .filter(Boolean) as Layer[];
      return { layers: reordered };
    }),

  addElement: (element) =>
    set((state) => {
      const newLayers = state.layers.map((layer) =>
        layer.id === state.activeLayerId
          ? { ...layer, elements: [...layer.elements, element] }
          : layer
      );
      const newHistory = {
        past: [...state.history.past, { ...state, layers: state.layers }],
        future: [],
      };
      return { layers: newLayers, history: newHistory };
    }),

  updateElement: (elementId, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) => ({
        ...layer,
        elements: layer.elements.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el
        ),
      })),
    })),

  removeElement: (elementId) =>
    set((state) => ({
      layers: state.layers.map((layer) => ({
        ...layer,
        elements: layer.elements.filter((el) => el.id !== elementId),
      })),
      selectedElements: state.selectedElements.filter((id) => id !== elementId),
    })),

  removeElements: (elementIds) =>
    set((state) => {
      const idsSet = new Set(elementIds);
      return {
        layers: state.layers.map((layer) => ({
          ...layer,
          elements: layer.elements.filter((el) => !idsSet.has(el.id)),
        })),
        selectedElements: state.selectedElements.filter((id) => !idsSet.has(id)),
      };
    }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),

  setPan: (pan) => set({ pan }),

  selectElements: (elementIds) => set({ selectedElements: elementIds }),

  clearSelection: () => set({ selectedElements: [] }),

  copySelected: () =>
    set((state) => {
      const selectedEls = state.layers
        .flatMap((l) => l.elements)
        .filter((el) => state.selectedElements.includes(el.id));
      return { clipboard: selectedEls };
    }),

  paste: () =>
    set((state) => {
      if (state.clipboard.length === 0) return state;

      const newElements = state.clipboard.map((el) => ({
        ...el,
        id: `${el.id}-copy-${Date.now()}`,
        x: el.x + 20,
        y: el.y + 20,
        layerId: state.activeLayerId,
      }));

      const newLayers = state.layers.map((layer) =>
        layer.id === state.activeLayerId
          ? { ...layer, elements: [...layer.elements, ...newElements] }
          : layer
      );

      return { layers: newLayers };
    }),

  undo: () =>
    set((state) => {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        ...previous,
        history: {
          past: newPast,
          future: [{ ...state, history: state.history }, ...state.history.future],
        },
      };
    }),

  redo: () =>
    set((state) => {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        ...next,
        history: {
          past: [...state.history.past, { ...state, history: state.history }],
          future: newFuture,
        },
      };
    }),

  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  resetCanvas: () =>
    set({
      layers: [createInitialLayer()],
      activeLayerId: 'layer-1',
      settings: defaultSettings,
      zoom: 1,
      pan: { x: 0, y: 0 },
      selectedElements: [],
      clipboard: [],
      history: { past: [], future: [] },
    }),

  loadCanvas: (state) =>
    set((currentState) => ({
      ...currentState,
      ...state,
    })),
}));
