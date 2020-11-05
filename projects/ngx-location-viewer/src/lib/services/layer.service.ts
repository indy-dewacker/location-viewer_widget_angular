import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Layer } from '../types/layer.model';
import { LayerInfo } from '../types/mapserver/info-response/layer-info.model';
import { MapServerService } from './mapserver.service';

@Injectable()
export class LayerService {
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

                layer.layers = this.buildChildLayer(parentLayer[0].id, layerIds, info.layers);

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

    private buildChildLayer(parentLayerId: number, layerIds: number[], layers: LayerInfo[]): Layer[] {
        const childLayers: Layer[] = [];
        layers.filter((x) => x.parentLayerId === parentLayerId).forEach(childLayer => {
            // instantiate layer object
            const layer: Layer = {
                id: childLayer.id,
                name: childLayer.name,
                visible: childLayer.defaultVisibility,
                layers: []
            };

            if (layers.filter(x => x.parentLayerId === childLayer.id).length > 0) {
                layer.layers = this.buildChildLayer(childLayer.id, layerIds, layers);
            }

            childLayers.push(layer);
        });

        return childLayers;
    }
}
