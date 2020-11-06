import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Layer } from '../types/layer.model';
import { LayerInfo } from '../types/mapserver/info-response/layer-info.model';
import { LayerLegend } from '../types/mapserver/legend-response/layer-legend.model';
import { MapServerService } from './mapserver.service';

@Injectable()
export class LayerService {
    private layerVisibilitySub$ = new BehaviorSubject<boolean>(null);
    constructor(private mapserverService: MapServerService) {
    }

    buildLayer(url: string, layerIds: number[]): Observable<Layer> {
        return forkJoin([this.mapserverService.getMapserverInfo(url), this.mapserverService.getMapserverLegend(url)])
        .pipe(take(1),
        map(([info, legend]) => {
            // Build layermanagement from info (only 1 parent layer)
            // get parent layer from info layers
            const parentLayer = info.layers.filter(x =>
                x.parentLayerId === -1 && layerIds.indexOf(x.id) > -1
            );

            if (parentLayer.length === 1) {
                const layer: Layer = {
                    id: parentLayer[0].id,
                    name: parentLayer[0].name,
                    visible: parentLayer[0].defaultVisibility,
                    layers: []
                };
                const layerLegend = legend.layers.filter(x => x.layerId === layer.id);
                if (layerLegend.length === 1) {
                    layer.legend = layerLegend[0].legend;
                }

                layer.layers = this.buildChildLayer(parentLayer[0].id, layerIds, info.layers, legend.layers);

                return layer;
            } else {
                const dummyLayer: Layer = {
                    id: 1,
                    name: 'test',
                    visible: true,
                    layers: []
                };
                return  dummyLayer;
            }
        }));
    }

    /* Fetch visible layerids of layer object */
    getVisibleLayerIds(layer: Layer): number[] {
        let visibleLayerIds: number[] = [];
        if (layer.visible) {
            // Only return id if there are no sublayers, otherwise if parent id is returned, all sub layers will be shown
            if (layer.layers.length === 0) {
                visibleLayerIds.push(layer.id);
            }
            layer.layers.filter(x => x.visible === true).forEach(visibleSubLayer => {
                visibleLayerIds =  [...visibleLayerIds, ...this.getVisibleLayerIds(visibleSubLayer)];
            });
        }

        return visibleLayerIds;
    }


    setLayerVisibilityChange(): void {
        this.layerVisibilitySub$.next(true);
    }

    get layerVisiblityChange$(): Observable<boolean> {
        return this.layerVisibilitySub$.pipe(filter((value: boolean) => !!value));
    }

    private buildChildLayer(parentLayerId: number, layerIds: number[], layers: LayerInfo[], layerLegend: LayerLegend[]): Layer[] {
        const childLayers: Layer[] = [];
        layers.filter((x) => x.parentLayerId === parentLayerId && layerIds.indexOf(x.id) > -1).forEach(childLayer => {
            // instantiate layer object
            const layer: Layer = {
                id: childLayer.id,
                name: childLayer.name,
                visible: childLayer.defaultVisibility,
                layers: []
            };

            const childLegend = layerLegend.filter(x => x.layerId === layer.id);
            if (childLegend.length === 1) {
                layer.legend = childLegend[0].legend;
            }

            if (layers.filter(x => x.parentLayerId === childLayer.id).length > 0) {
                layer.layers = this.buildChildLayer(childLayer.id, layerIds, layers, layerLegend);
            }

            childLayers.push(layer);
        });

        return childLayers;
    }
}
