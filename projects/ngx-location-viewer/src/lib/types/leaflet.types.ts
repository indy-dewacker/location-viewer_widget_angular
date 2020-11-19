export interface LatLng {
    Lat: number;
    Lng: number;
    distanceTo(point: LatLng): number;
}

export enum DrawEvents {
    drawstart = 'pm:drawstart',
    drawend = 'pm:drawend',
    create = 'pm:create',
}

export enum PopupEvents {
    popupopen = 'popupopen',
    popupclose = 'popupclose',
    autopanstart = 'autopanstart'
}

export interface Intake {
    layer: any;
    shape: string;
}
