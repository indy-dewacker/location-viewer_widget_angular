# Changelog

All notable changes to this project will be documented in this file.

<!--
"### Added" for new features.
"### Changed" for changes in existing functionality.
"### Deprecated" for soon-to-be removed features.
"### Removed" for now removed features.
"### Fixed" for any bug fixes.
"### Security" in case of vulnerabilities.
-->

## [Unreleased]
## [3.1.0] - 2023-07-03

### Added
- Option to pass currentPosition to initialise component with a position marker
- Updating the value of currentPosition will redraw te position marker
- Using the currentPosition will overrule the mapCenter position on load
- Updated the example app with a locate me button

## [3.0.0] - 2023-06-15

## Changed

-   Out of beta

## [3.0.0-beta.3] - 2023-06-15

## Fixed

-   Fix build

## [3.0.0-beta.2] - 2023-06-15

## Changed

-   Use latest ngx-leaflet version everywhere

## [3.0.0-beta.1] - 2023-06-15

## Changed

-   Use latest ngx-icon version

## [3.0.0-beta.0] - 2023-06-15

## Changed

-   Update to Node 18 and Core Branding v6

## [2.5.0] - 2023-01-30

### Added

-   Option to pass minZoom and maxZoom params when layer should be visible (performance)
-   Option to pass layerColor (style options) to override default from mapserver

## [2.4.1] - 2023-01-30 - Published incorrectly

## [2.4.0] - 2022-10-11

### Changed

-   Toggle sidebar functionality to work with hasSidebar property

### Added

-   ShowSidebar property to set default visibility of sidebar
-   Translations property to override default translations
-   Added new 'where' property to allow server side (mapserver) filtering of operational layer

## [2.3.1] - 2022-06-17

### Fixed

-   Fix error Invalid LatLng object that was thrown after rendering polygon/polyline operationallayer (since esri-leaflet 3.0.5)

### Changed

-   Format parameter ARCGIS from pjson to json for small performance improvement
-   Renamed registerOperationalLayerClickEvent and made public method for accessibility

## [2.3.0] - 2022-03-17

### Fixed

-   Webpack 5 import errors on esri-leaflet & esri-leaflet-cluster packages

### Added

-   Option to set visibility supportinglayers through visible property by passing layerids
-   Option to add tooltips on operationalLayer

## [2.2.3] - 2022-01-28

### Fixed

-   Fixed issue that legend icon operational layer failed to load on config change
-   Fixed issue that filterLayers did not update correcty on change

## [2.2.2] - 2021-11-16

### Fixed

-   Fixed issue that arcgis layer (polygon) with renderer info type 'simple' failed to load

## [2.2.1] - 2021-09-13

### Fixed

-   Fixed issue that operational layer with layerid 0 threw validation error

## [2.2.0] - 2021-08-13

### Added

-   Added visible property to supportinglayeroptions to overrule default visibility setting of arcgis layer

### Fixed

-   Fixed issue that operational layer with custom markers and without clustering did not emit click event

## [2.1.0] - 2021-07-29

### Added

-   Added new eventemitter markerClicked that emits the marker object after clicking on operational marker

### Fixed

-   Fixed that operationallayer wouldn't show if default visibility of arcgis layer was false
-   Fixed that operationallayeroptions isVisible property overrules the default visibility setting of arcgis layer

## [2.0.1] - 2021-06-17

### Fixed

-   Fixed the way dependencies are resolved

## [2.0.0] - 2021-06-17

### Changed

-   [BREAKING] Upgraded the component to work with Angular 8
-   [BREAKING] Replaced FontAwesome icons with all new Streamline icons
-   [BREAKING] Upgraded to core branding v5
-   Improved styling

### Fixed

-   Prevented unwanted selection of hidden sidebar items

## [1.3.1] - 2021-06-15

### Fixed

-   Check for value (instead of reference) changes on supportingLayerOptions, operationalLayerOptions or filterLayers input params

## [1.3.0] - 2021-04-28

### Added

-   Made FilterLayerOptions properties optional: name, popupLabel and propertyToDisplay. If one of these properties is null, information will be retrieved from mapserver (name & displayfield).

## [1.2.0] - 2021-03-03

### Fixed

-   apply marker filtering to all polygons inside feature
-   if operational marker icon is null fallback to default 'fa-map-marker' instead of using 'fa-null'

### Added

-   zoomOnMarkerSelect: After clicking on a marker (operational layer) the map will be centered on the marker and zoomlevel will be applied.

## [1.1.0] - 2021-03-03

### Changed

-   Supportinglayeroptions changed the way to pass layerIds: only add child id's or parent id to add all child layers

### Added

-   After clicking on a marker (operational layer) event will be emitted through filteredResult.

## [1.0.2] - 2021-01-29

### Fixed

-   Added close button to close layer management

## [1.0.1] - 2021-01-25

### Fixed

-   Changed dependency injection services (compatibility angular 6)

## [1.0.1] - 2021-01-25

-   Initial release.

[Unreleased]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.5.0...HEAD
[2.5.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.3.1...v2.4.0
[2.3.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.2.3...v2.3.0
[2.2.3]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.2.2...v2.2.3
[2.2.2]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.2.0...v2.2.1
[2.1.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.3.1...v2.0.0
[1.3.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.0
