import { Component, Input, OnInit } from '@angular/core';
import { LayerTypes } from '../../types/layer-types.enum';
import { Layer } from '../../types/layer.model';

@Component({
    selector: 'aui-layer-management',
    templateUrl: './layer-management.component.html',
    styleUrls: ['./layer-management.component.css'],
})
export class LayerManagementComponent implements OnInit {
    @Input() operationalLayer: Layer;
    @Input() supportingLayer: Layer;

    layerTypes = LayerTypes;
    constructor() {}

    ngOnInit() {}
}
