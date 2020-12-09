import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LayerService } from '../../../services/layer.service';
import { LayerTypes } from '../../../types/layer-types.enum';
import { Layer } from '../../../types/layer.model';

@Component({
    selector: 'aui-layer',
    templateUrl: './layer.component.html',
    styleUrls: ['./layer.component.css'],
})
export class LayerComponent implements OnInit {
    @Input() layer: Layer;
    @Input() layerType: LayerTypes;

    open = true;
    imageUrl: SafeUrl;
    constructor(private layerService: LayerService, private domSanitizer: DomSanitizer) {}

    ngOnInit() {
        if (this.layer && this.layer.legend && this.layer.legend.length === 1) {
            this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(
                `data: ${this.layer.legend[0].contentType};base64, ${this.layer.legend[0].imageData}`,
            );
        }
    }

    showLayers(): boolean {
        return this.layer && this.layer.layers.length > 0;
    }

    showLegend(): boolean {
        return this.layer && this.layer.legend && this.layer.legend.length > 1;
    }

    onChangeVisibility() {
        this.layerService.setLayerVisibilityChange(this.layerType);
    }
}
