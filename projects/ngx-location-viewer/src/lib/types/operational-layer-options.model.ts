export interface OperationalLayerOptions {
    enableClustering: boolean;
    url?: string;
    layerId?: number;
    name?: string;
    markers?: OperationalMarker[]
    isVisible?: boolean;
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
