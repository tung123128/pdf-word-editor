export type SupportedFileType = 'pdf' | 'docx' | 'image';

export type ToolType = 
  | 'select' 
  | 'redact' 
  | 'erase' 
  | 'text' 
  | 'draw' 
  | 'rectangle' 
  | 'circle' 
  | 'arrow';

export interface BaseAnnotation {
  id: string;
  pageIndex: number;
  type: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fillColor?: string;
  strokeWidth: number;
  opacity: number;
}

export interface RedactAnnotation extends BaseAnnotation {
  type: 'redact';
  color: string; // usually #000000 or #ffffff
}

export interface ErasePathAnnotation extends BaseAnnotation {
  type: 'erase';
  points: { x: number; y: number }[];
  brushSize: number;
}

export interface DrawPathAnnotation extends BaseAnnotation {
  type: 'draw';
  points: { x: number; y: number }[];
}

export interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  isBold?: boolean;
  isItalic?: boolean;
  textAlign?: 'left' | 'center' | 'right';
}

export interface ShapeAnnotation extends BaseAnnotation {
  type: 'rectangle' | 'circle' | 'arrow';
}

export type Annotation = 
  | RedactAnnotation 
  | ErasePathAnnotation 
  | DrawPathAnnotation 
  | TextAnnotation 
  | ShapeAnnotation;

export interface DocumentPage {
  index: number;
  width: number;
  height: number;
  renderCanvas?: HTMLCanvasElement;
  thumbnailDataUrl?: string;
  wordHtml?: string;
  isRendered?: boolean;
}

export interface DocumentState {
  file: File | null;
  fileType: SupportedFileType | null;
  fileName: string;
  fileSize: number;
  numPages: number;
  currentPageIndex: number;
  pages: DocumentPage[];
  annotations: Record<number, Annotation[]>; // pageIndex -> annotations
  history: Record<number, Annotation[][]>; // pageIndex -> history stack
  historyIndex: Record<number, number>; // pageIndex -> pointer in history
  zoom: number;
  rotation: number;
  selectedAnnotationId: string | null;
  activeTool: ToolType;
  // Tool properties
  currentColor: string;
  fillColor: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  isProcessing: boolean;
  statusMessage: string;
}

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'organize' | 'optimize' | 'convert-to' | 'convert-from' | 'edit' | 'security' | 'ai';
  categoryLabel: string;
  color: string; // color badge/accent
  badge?: string;
  targetUrl: string;
  fileTypes: string[];
}
