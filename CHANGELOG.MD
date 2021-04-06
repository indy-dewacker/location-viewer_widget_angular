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


[Unreleased]: https://github.com/digipolisantwerp/smart-table_widget_angular/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.2...v1.2.0
[1.1.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/digipolisantwerp/location-viewer_widget_angular/compare/v1.0.0
