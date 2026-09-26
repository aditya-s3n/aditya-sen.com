import type { LoadProgress } from '../types';

export interface LoadingStage {
  id: string;
  label: string;
  weight: number;
}

/** Turns weighted init stages into one 0..1 progress value for the loading screen. */
export class LoadingTracker {
  private done = new Map<string, number>();
  private totalWeight: number;

  constructor(private stages: LoadingStage[], private onProgress: (p: LoadProgress) => void) {
    this.totalWeight = stages.reduce((sum, s) => sum + s.weight, 0);
  }

  update(stageId: string, fraction: number): void {
    this.done.set(stageId, Math.min(1, Math.max(0, fraction)));
    const stage = this.stages.find((s) => s.id === stageId);
    const value = this.stages.reduce((sum, s) => sum + s.weight * (this.done.get(s.id) ?? 0), 0);
    this.onProgress({ stage: stage?.label ?? '', value: value / this.totalWeight });
  }

  complete(stageId: string): void {
    this.update(stageId, 1);
  }
}
