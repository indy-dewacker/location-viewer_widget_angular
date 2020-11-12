import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LayerLegendInfo } from '../../../types/mapserver/legend-response/layer-legend-info.model';

@Component({
    selector: 'aui-layer-legend',
    templateUrl: './layer-legend.component.html',
    styleUrls: ['./layer-legend.component.css'],
})
export class LayerLegendComponent implements OnInit {
    @Input() layerLegend: LayerLegendInfo;

    imageUrl: SafeUrl;
    constructor(private domSanitizer: DomSanitizer) {}

    ngOnInit() {
        if (this.layerLegend) {
            this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(
                `data: ${this.layerLegend.contentType};base64, ${this.layerLegend.imageData}`,
            );
        }
    }
}
