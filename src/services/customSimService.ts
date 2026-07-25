export interface SavedSimulation {
  id: string;
  name: string;
  description: string;
  category: string; // e.g. "Physics", "Math", "Chemistry", "Biology", "Technology"
  createdAt: number;
  formula?: string;
  resultName?: string;
  resultUnit?: string;
  variables: {
    name: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit?: string;
    color?: string;
  }[];
  equations: {
    id?: string;
    name: string;
    expression: string;
    label?: string;
    unit?: string;
    enabled?: boolean;
  }[];
  shapes: {
    id: string;
    type: string;
    label?: string;
    color: string;
    strokeWidth?: string;
    behavior?: string;
    sensitivity?: number;
    xExpr?: string;
    yExpr?: string;
    x2Expr?: string; // line
    y2Expr?: string; // line
    x3Expr?: string; // triangle
    y3Expr?: string; // triangle
    widthExpr?: string;
    heightExpr?: string;
    radiusExpr?: string;
    angleExpr?: string; // rotation
    textExpr?: string; // text label
    fontSizeExpr?: string;
    mass?: number;
    restitution?: number;
    friction?: number;
    anchorX?: number;
    anchorY?: number;
    springK?: number;
    damping?: number;
  }[];
  vectors?: {
    id: string;
    targetObjectId: string;
    vectorType: 'velocity' | 'force' | 'acceleration' | 'custom';
    label: string;
    magExpr: string;
    angleExpr: string;
    color: string;
  }[];
  connectors?: {
    id: string;
    fromId: string;
    toId: string;
    type: 'spring' | 'wire' | 'rope' | 'ray';
    color?: string;
  }[];
  questions?: {
    id: string;
    question: string;
    answer: number;
    tolerance: number;
    hint: string;
    unit: string;
  }[];
  dataLogConfig?: {
    enabled: boolean;
    variables: string[];
    maxPoints: number;
    label: string;
  };
}

const LOCAL_STORAGE_KEY = 'cendronyx_custom_simulations';

export const customSimService = {
  getSimulations(): SavedSimulation[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to read custom simulations from localStorage:', e);
      return [];
    }
  },

  getSimulation(id: string): SavedSimulation | undefined {
    const sims = this.getSimulations();
    return sims.find(sim => sim.id === id);
  },

  saveSimulation(sim: SavedSimulation): void {
    try {
      const sims = this.getSimulations();
      const existingIdx = sims.findIndex(s => s.id === sim.id);
      if (existingIdx >= 0) {
        sims[existingIdx] = sim;
      } else {
        sims.push(sim);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sims));
    } catch (e) {
      console.error('Failed to save custom simulation to localStorage:', e);
    }
  },

  deleteSimulation(id: string): void {
    try {
      const sims = this.getSimulations();
      const filtered = sims.filter(sim => sim.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete custom simulation from localStorage:', e);
    }
  }
};
