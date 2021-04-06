export class FilterLayerOptions {
    url: string;
    layerId: number;
    /**
     * Filter layer name, if not provided layer name (mapserver) will be used.
     */
    name?: string;
    /**
     * After click on feature this label will be displayed (popup). If not provided display layer displayField (mapserver) will be used.
     */
    popupLabel?: string;
    /**
     * After click on feature value of this property will be displayed (popup). If not provided display layer displayField value (mapserver) will be used.
     */
    propertyToDisplay?: string;
}
