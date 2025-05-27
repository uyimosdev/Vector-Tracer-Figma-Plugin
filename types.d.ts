// Type definitions for Vector Tracer Figma Plugin

interface TracingSettings {
    threshold: number;      // 0-255
    smoothness: number;     // 0-100
    detail: number;         // 1-10
    invert: boolean;
    fill: boolean;
    stroke: boolean;
}

interface Point {
    x: number;
    y: number;
}

interface Contour extends Array<Point> { }

type TracingMode = 'color' | 'bw' | 'mask';

interface PluginMessage {
    type: 'preview' | 'trace' | 'selection-changed' | 'trace-complete' | 'trace-error' | 'preview-ready';
    mode?: TracingMode;
    settings?: TracingSettings;
    hasImage?: boolean;
    error?: string;
    previewData?: string;
}

interface ProcessedImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}

interface VectorPath {
    windingRule: 'NONZERO' | 'EVENODD';
    data: string;
}

// Extend global interfaces for plugin context
declare global {
    interface Window {
        onmessage: (event: MessageEvent<{ pluginMessage: PluginMessage }>) => void;
    }
}

// Plugin-specific utility types
type ImageProcessingFunction = (imageData: ImageData, settings: TracingSettings) => ImageData;
type ContourTracingFunction = (mask: boolean[], width: number, height: number, settings: TracingSettings) => Contour[];
type PathSimplificationFunction = (points: Point[], tolerance: number) => Point[];

export {
    TracingSettings,
    Point,
    Contour,
    TracingMode,
    PluginMessage,
    ProcessedImageData,
    VectorPath,
    ImageProcessingFunction,
    ContourTracingFunction,
    PathSimplificationFunction
}; 