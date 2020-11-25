Then import the component inside your module:

```ts
import {LocationPickerModule} from '@acpaas-ui-widgets/ngx-location-viewer';

@NgModule({
  imports: [
    ...,
    LocationViewerModule
  ],
  ...
})
```

Finally include the required styles:

Add Antwerp core branding stylesheet in your index.html file:

```html
<link rel="stylesheet" href="https://cdn.antwerpen.be/core_branding_scss/4.1.1/main.min.css">
```

Add required leaflet styles in your angular.json file.

```
"styles": [
    "node_modules/leaflet/dist/leaflet.css",
    "node_modules/leaflet-draw/dist/leaflet.draw.css",
    "node_modules/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css",
    "node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css",
    "node_modules/leaflet.markercluster/dist/MarkerCluster.css"
]
```