import { ToolbarPosition } from './toolbar-position.enum';

export interface ToolbarOptions {
    position: ToolbarPosition;
    drawMarker?: boolean;
    drawCircleMarker?: boolean;
    drawPolyline?: boolean;
    drawRectangle?: boolean;
    drawPolygon?: boolean;
    drawCircle?: boolean;
    editMode?: boolean;
    dragMode?: boolean;
    cutPolygon?: boolean;
    removalMode?: boolean;
}
