import { Layer, CanvasElement } from "../types/canvas.types";

export function transformCanvasData(data: any): { layers: Layer[] } {
  if (!data) {
    return { layers: [createDefaultLayer()] };
  }

  if (data.layers && Array.isArray(data.layers) && data.layers.length > 0) {
    return { layers: data.layers };
  }

  if (data.elements && Array.isArray(data.elements)) {
    const elements: CanvasElement[] = data.elements.map((el: any) => ({
      id: el.id,
      type: el.type || "pen",
      layerId: "layer-1",
      x: el.x || 0,
      y: el.y || 0,
      width: el.width,
      height: el.height,
      radius: el.radius,
      points: el.points,
      color: el.color || "#000000",
      fillColor: el.fillColor,
      strokeWidth: el.strokeWidth || 2,
      opacity: el.opacity || 1,
      text: el.text,
      fontSize: el.fontSize,
      fontFamily: el.fontFamily,
    }));

    const defaultLayer = createDefaultLayer();
    defaultLayer.elements = elements;

    return { layers: [defaultLayer] };
  }

  return { layers: [createDefaultLayer()] };
}

export function createDefaultLayer(): Layer {
  return {
    id: "layer-1",
    name: "Layer 1",
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: "normal",
    elements: [],
    order: 0,
  };
}

export function serializeCanvasData(layers: Layer[]): { layers: Layer[] } {
  return { layers };
}
