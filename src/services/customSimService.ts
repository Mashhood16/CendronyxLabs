export interface SavedSimulation {
  id: string;
  name: string;
  description: string;
  category: string; // e.g. "Physics", "Math", "Chemistry", "Biology", "Technology"
  createdAt: number;
  variables: {
    name: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
  }[];
  equations: {
    name: string;
    expression: string;
  }[];
  shapes: {
    id: string;
    type: 'circle' | 'rectangle' | 'line' | 'triangle' | 'text';
    color: string;
    strokeWidth?: string;
    // Equations controlling geometry/properties
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
  }[];
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
