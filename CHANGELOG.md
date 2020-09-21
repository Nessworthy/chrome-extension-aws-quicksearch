# Changelog

## [Unreleased]

### Added
- Create both unpacked and packed files during build process (doesn't affect the package).
- Leverage github actions for releases

### Changed
- Changelog format changed to keepachangelog's standard.

## [1.2.1] - 2020-09-20

Looking at bug fixes and cleanup, finally found out why the shortcuts weren't working in EC2 🙌. 

### Added

- Add a security policy to the repo (doesn't affect the package).

### Changed

- Stop fiddling with event cancelling during region navigation.
- Remove unused `folder-hash` npm package in the build process (doesn't affect the package).

### Fixed

- Allow shortcuts to trigger in child frames (some service pages use these).

## [1.2.0] - 2020-09-19

Breaking changes in this one - now using <kbd>Alt</kbd>, from <kbd>Shift</kbd>, and added support for a help popup.

### Added

- Add shortcut list and introductory message as a page action.
- Add shortcut to trigger account menu (<kbd>Alt</kbd> + <kbd>P</kbd>)
- Add shortcut to trigger support menu (<kbd>Alt</kbd> + <kbd>A</kbd>)
- Add Chrome store screenshots to the repo (but not the package).
- Ignore npm modules in the repo (doesn't affect the package).
- Include a signature in the manifest file on build (does not affect package functionality).

### Changed

- Shortcuts no longer rely on <kbd>Shift</kbd>, because I now realise how dumb it is. <kbd>Alt</kbd> is used instead.
- Shortcut for services is now <kbd>Alt</kbd> + <kbd>S</kbd>.
- Update feature support section in readme file.
- Shortcuts removed from plugin description.

### Fixed

- Correctly tear down region filter on menu closure in the new UI.
- Fix shortcuts not working on specific pages (e.g. EC2 home page).
- Use correct directory for ignoring node modules (doesn't affect the package).

## [1.1.0] - 2020-09-17

Looking at region filter support for the old UI.

### Added

- Region filter / navigation support for the old UI. It's still a little buggy on the current region element.

### Fixed

- Stop region text search / navigation from breaking on the new UI if the region dropdown list
hasn't been created yet.  

## [1.0.2] - 2020-09-16

Focus around the build pipeline. No extension changes.

### Added
- New build scripts, manifest fields now based on `package.json`.

### Changed
- Extension source moved to `src/`.
- Readme updated for building.
- Changelog reformatted.
- Extension size trimmed down due to addition of build scripts.

## [1.0.1] - 2020-09-16

No changes - just README updates :-).

## [1.0.0] - 2020-09-16

Initial release. Hello world!
