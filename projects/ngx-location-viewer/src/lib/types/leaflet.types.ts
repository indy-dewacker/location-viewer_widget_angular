export interface LatLng {
  lat: number;
  lng: number;
  distanceTo(point: LatLng): number;
}

export enum DrawEvents {
  drawstart = 'pm:drawstart',
  drawend = 'pm:drawend',
  create = 'pm:create',
}

export enum RasterEvents {
  loading = 'loading',
  load = 'load'
}

export enum PopupEvents {
  popupopen = 'popupopen',
  popupclose = 'popupclose',
  autopanstart = 'autopanstart'
}

export enum InteractionEvents {
  click = 'click'
}

export interface Intake {
  layer: any;
  shape: string;
}
