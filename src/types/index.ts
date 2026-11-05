export type MeasurementSystem = 'imperial' | 'metric';

export type CategoryMode = 'fabric' | 'construction';

export interface BOMItem {
  id: string;
  name: string;
  category: 'fabric' | 'construction';
  calculatorType: string;
  primaryQuantity: number;
  primaryUnit: string;
  secondarySummary: string;
  unitPrice: number;
  notes?: string;
  timestamp: number;
}

export interface FabricCutPiece {
  id: string;
  label: string;
  length: number; // in inches or cm
  width: number;  // in inches or cm
  quantity: number;
  allowRotation: boolean;
  color?: string;
}

export interface PlacedPiece {
  pieceId: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  color: string;
}

export interface FabricLayoutResult {
  usableWidth: number;
  totalLengthNeeded: number; // inches or cm
  yardsNeeded: number;
  metersNeeded: number;
  totalFabricArea: number; // sq in or sq cm
  usedArea: number;
  wasteArea: number;
  wastePercentage: number;
  placedPieces: PlacedPiece[];
  unplacedCount: number;
  repeatAdjustedLength?: number;
}

export type BedShape = 'rectangle' | 'circle' | 'ring' | 'triangle' | 'direct_area';

export interface MulchResult {
  areaSqFt: number;
  areaSqM: number;
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuM: number;
  weightTons: number;
  weightTonnes: number;
  bags2CuFt: number;
  bags3CuFt: number;
  bags1_5CuFt: number;
  bags1CuFt: number;
}

export interface AggregateResult {
  volumeCuYd: number;
  volumeCuM: number;
  volumeCuFt: number;
  weightTons: number;
  weightTonnes: number;
  bags50lb: number;
  truckLoads10Yd: number;
}

export interface ConcreteResult {
  volumeCuYd: number;
  volumeCuM: number;
  volumeCuFt: number;
  bags40lb: number;
  bags60lb: number;
  bags80lb: number;
  portlandBags94lb: number;
  sandCuFt: number;
  gravelCuFt: number;
  waterGallons: number;
}
