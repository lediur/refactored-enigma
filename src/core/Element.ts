type ElementType =
  // | 'ellipse'
  // | 'bitmap'
  // | 'line'
  // | 'polygon'
  // | 'rect'
  // | 'roundrect'
  'image' | 'string';

/**
 * An Element represents a description of something that can be drawn with GDI.
 * It's a tree.
 */
export interface Element {
  children?: Element[];
  type: ElementType;
  fill?: boolean;
}

export interface TextElement extends Element {
  type: 'string';
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  font: FbTodo;
}

export interface ImageElement extends Element {
  type: 'image';
  reference: string;
  x: number;
  y: number;
  width: number;
  height: number;
  srcX?: number;
  srcY?: number;
  srcWidth?: number;
  srcHeight?: number;
  angle?: number;
  alpha?: number;
}
