export interface OperationalLayerOptions extends BaseOperationalLayerOptions{
    url: string;
    layerId: number;
}

export interface CustomOperationalLayerOptions extends BaseOperationalLayerOptions {
    name: string;
    visible: boolean;
    markers: OperationalMarker[];
}

export interface OperationalMarker {
    coordinate: OperationalMarkerCoordinate;
    color?: string;
    icon: string;
    size?: string;
    data: any;
}

export interface OperationalMarkerCoordinate {
    lat: number;
    lon: number;
}

interface BaseOperationalLayerOptions {
    enableClustering: boolean;
}