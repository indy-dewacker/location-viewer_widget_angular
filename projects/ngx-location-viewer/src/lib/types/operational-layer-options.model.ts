export interface OperationalLayerOptions {
  /* if true markers will be clustered */
  enableClustering: boolean;
  /* url to the mapserver containing the required features*/
  url?: string;
  /* layerid of the layer on the provided mapserver url */
  layerId?: number;
  /* if markers are passed by marker array this name will be used to view in layermanagement */
  name?: string;
  /* option to pass custom markers */
  markers?: OperationalMarker[]
  /* set visibility of layer */
  isVisible?: boolean;
}


export interface OperationalMarker {
  /* coordinates used to place marker on map */
  coordinate: OperationalMarkerCoordinate;
  color?: string;
  /* Streamline icon class e.g. 'ai-pin-3'. You have to provide valid icon class otherwise marker won't be visible */
  icon: string;
  /* icon size in pixels, default: 40px */
  size?: string;
  /* Provide additional data, this data object will be returned after filter actions (filter layer) */
  data: any;
}

export interface OperationalMarkerCoordinate {
  lat: number;
  lon: number;
}
