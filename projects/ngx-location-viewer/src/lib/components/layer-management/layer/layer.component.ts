import { Component, Input, OnInit } from '@angular/core';
import { Layer } from '../../../types/layer.model';

@Component({
  selector: 'aui-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {
  @Input() layer: Layer;

  open = true;
  constructor() { }

  ngOnInit() {
  }

  showLayers(): boolean {
    return this.layer && this.layer.layers.length > 0;
  }
}
