import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isEqual } from 'lodash-es';
import { LayerTypes } from '../../../types/layer-types.enum';
import { Layer } from '../../../types/layer.model';
import { Translations } from '../../../types/translations.model';
import { DUTCH_TRANSLATIONS } from '../../../translations';

@Component({
    selector: 'aui-layer',
    templateUrl: './layer.component.html',
    styleUrls: ['./layer.component.scss'],
})
export class LayerComponent implements OnChanges {
    @Input() layer: Layer;
    @Input() layerType: LayerTypes;
    @Input() translations: Translations = DUTCH_TRANSLATIONS;
    @Output() layerVisibiltyChange = new EventEmitter<LayerTypes>();

    open = true;
    imageUrl: SafeUrl;
    constructor(private domSanitizer: DomSanitizer) {}

    public ngOnChanges(changes: SimpleChanges): void {
        // tslint:disable-next-line: forin
        for (const propName in changes) {
            const change = changes[propName];

            if (!isEqual(change.previousValue, change.currentValue)) {
                switch (propName) {
                    case 'layer':
                        this.initImageUrl();
                        break;
                    default:
                        break;
                }
            }
        }
    }

    showLayers(): boolean {
        return this.layer && this.layer.layers && this.layer.layers.length > 0;
    }

    showLegend(): boolean {
        return this.layer && this.layer.legend && this.layer.legend.length > 1;
    }

    onChangeVisibility() {
        this.layerVisibiltyChange.emit(this.layerType);
    }

    private initImageUrl(): void {
        if (this.layer && this.layer.legend && this.layer.legend.length === 1) {
            this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(
                `data: ${this.layer.legend[0].contentType};base64, ${this.layer.legend[0].imageData}`,
            );
        }
    }
}
