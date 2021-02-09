import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayerTypes } from '../../types/layer-types.enum';
import { Layer } from '../../types/layer.model';

@Component({
    selector: 'aui-layer-management',
    templateUrl: './layer-management.component.html',
    styleUrls: ['./layer-management.component.scss'],
})
export class LayerManagementComponent implements OnInit {
    @Input() operationalLayer: Layer;
    @Input() supportingLayers: Layer[];

    @Output() layerVisibilityChange = new EventEmitter<LayerTypes>();
    @Output() layerManagementClosed = new EventEmitter<void>();

    layerTypes = LayerTypes;
    constructor() {}

    ngOnInit() {}

    onLayerVisibilityChange(layerType: LayerTypes) {
        this.layerVisibilityChange.emit(layerType);
    }

    toggleLayermanagement() {
        this.layerManagementClosed.emit();
    }
}
