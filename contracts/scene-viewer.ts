import type { PointXZ, ProjectScene } from './project.ts';
import type { EditorSelection } from './queue-editor.ts';

/** Interface comum entre o fluxo guiado e a cena R3F. Coordenadas sempre métricas. */
export interface SceneViewerProps {
  scene: ProjectScene;
  view?: 'perspective' | 'top';
  className?: string;
  onFloorPoint?: (point: PointXZ) => void;
  selection?: EditorSelection | null;
  onSelectEntity?: (selection: EditorSelection | null) => void;
  /** Delta XZ em metros desde o início do arraste; aplicado somente ao soltar. */
  onMoveEntity?: (selection: EditorSelection, delta: PointXZ) => void;
}
