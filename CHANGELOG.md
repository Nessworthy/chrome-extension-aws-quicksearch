# Changelog

## Next Release

### Additions

* Add shortcut list and introductory message as a page action.
* Add shortcut to trigger account menu (<kbd>Alt</kbd> + <kbd>P</kbd>)
* Add shortcut to trigger support menu (<kbd>Alt</kbd> + <kbd>A</kbd>)
* Add Chrome store screenshots to the repo (but not the package).
* Ignore npm modules in the repo (doesn't affect the package).
* Include a signature in the manifest file on build (does not affect package functionality).

### Changes

* Shortcuts no longer rely on <kbd>Shift</kbd>, because I now realise how dumb that is. <kbd>Alt</kbd> is used instead.
* Shortcut for services is now <kbd>Alt</kbd> + <kbd>S</kbd>.
* Update feature support section in readme file.
* Shortcuts removed from plugin description.

### Fixes

* Correctly tear down region filter on menu closure in the new UI.
* Fix shortcuts not working on specific pages (e.g. EC2 home page).
* Use correct directory for ignoring node modules (doesn't affect the package).

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
