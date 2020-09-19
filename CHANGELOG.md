# Changelog

## Next Release

### Additions

* Add shortcut to trigger support panel (<kbd>shift</kbd> + <kbd>S</kbd>)
* Add shortcut to trigger account panel (<kbd>shift</kbd> + <kbd>A</kbd>)
* Add Chrome store screenshots to the repo (but not the package).
* Ignore npm modules in the repo (doesn't affect the package).
* Include a signature in the manifest file on build (does not affect package functionality).

### Changes

* Update feature support section in readme file.
* Shortcuts removed from plugin description (will find another place for these shortly).

### Fixes

* Correctly tear down region filter on menu closure in the new UI.
* Fix shortcuts not working on specific pages (e.g. EC2 home page).

## 1.1.0

Looking at region filter support for the old UI.

### Additions

* Region filter / navigation support for the old UI.
Still a little buggy on the current region element.

### Fixes

* Stop region text search / navigation from breaking on the new UI if the region dropdown list
hasn't been created yet.  

## 1.0.2

Focus around the build pipeline. No extension changes.

### Additions
* New build scripts, manifest fields now based on `package.json`.

### Changes
* Extension source moved to `src/`.
* Readme updated for building.
* Changelog reformatted.
* Extension size trimmed down due to addition of build scripts.

## 1.0.1

No changes - just README updates :-).

## 1.0.0

Initial release. Hello world!
