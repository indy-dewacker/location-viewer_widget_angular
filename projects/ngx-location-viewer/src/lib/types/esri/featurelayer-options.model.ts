export interface FeatureLayerOptions {
    url: string,
    style: (feature) => void,
    pointToLayer: (feature, latlng) => void,
    onEachFeature: (feature, layer) => void,
    where?: string,
    minZoom?: number,
    maxZoom?: number
}