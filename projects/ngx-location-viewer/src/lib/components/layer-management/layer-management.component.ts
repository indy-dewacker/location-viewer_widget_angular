import { Component, Input, OnInit } from '@angular/core';
import { Layer } from '../../types/layer.model';

@Component({
    selector: 'aui-layer-management',
    templateUrl: './layer-management.component.html',
    styleUrls: ['./layer-management.component.css'],
})
export class LayerManagementComponent implements OnInit {
    @Input() supportingLayer: Layer;
    constructor() {}

    ngOnInit() {}
}
