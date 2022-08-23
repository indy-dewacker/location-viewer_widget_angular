export interface FeatureLayerOptions {
    url: string,
    style: (feature) => void,
    pointToLayer: (feature, latlng) => void,
    where?: string
}