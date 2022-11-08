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

### Fixed
- Fixed issue that arcgis layer (polygon) with renderer info type 'simple' failed to load

## [1.6.0] - 2022-08-26

### Added
- Added new 'where' property to allow server side (mapserver) filtering of operational layer


## [1.5.1] - 2022-06-29

### Fixed
- Fixed that operationallayeroptions isVisible property overrules the default visibility setting of arcgis layer


## [1.5.0] - 2022-03-07

### Added
- Option to set visibility supportinglayers through visible property by passing layerids

### Fixed
- Added output property for layer visibility changes


## [1.4.3] - 2022-02-09

### Fixed
- Fixed error that would be added twice.


## [1.4.2] - 2022-02-09

### Fixed
- Fixed that operationallayer wouldn't show if default visibility of arcgis layer was false
- Fixed error after adding layer when map wasn't initialized


## [1.4.1] - 2022-02-01

### Fixed
- Fixed issue that filterLayers did not update correcty on change
- Fixed issue that legend icon operational layer failed to load on config change


## [1.4.0] - 2021-08-13

### Added
- Added visible property to supportinglayeroptions to overrule default visibility setting of arcgis layer
### Fixed
- Fixed issue that operational layer with custom markers and without clustering did not emit click event


## [1.3.1] - 2021-06-15

### Fixed
- Check for value (instead of reference) changes on supportingLayerOptions, operationalLayerOptions or filterLayers input params


## [1.3.0] - 2021-04-28

### Added
- Made FilterLayerOptions properties optional: name, popupLabel and propertyToDisplay. If one of these properties is null, information will be retrieved from mapserver (name & displayfield).


## [1.2.0] - 2021-03-03

### Fixed
- apply marker filtering to all polygons inside feature
- if operational marker icon is null fallback to default 'fa-map-marker' instead of using 'fa-null'

### Added
- zoomOnMarkerSelect: After clicking on a marker (operational layer) the map will be centered on the marker and zoomlevel will be applied.


## [1.1.0] - 2021-03-03

### Changed
- Supportinglayeroptions changed the way to pass layerIds: only add child id's or parent id to add all child layers

### Added
- After clicking on a marker (operational layer) event will be emitted through filteredResult.


## [1.0.2] - 2021-01-29

### Fixed
- Added close button to close layer management


## [1.0.1] - 2021-01-25

### Fixed
- Changed dependency injection services (compatibility angular 6)


## [1.0.1] - 2021-01-25
- Initial release.


[Unreleased]: https://github.com/digipolisantwerp/smart-table_widget_angular/compare/v1.6.0...HEAD
[1.6.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.4.3...v1.5.0
[1.4.3]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.0
