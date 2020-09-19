# Chrome Extension: AWS QuickSearch

Quickly switch services & regions in AWS.

## Usage / Features

### Keyboard Shortcuts

<kbd>shift</kbd>, <kbd>shift</kbd> (in quick succession): Toggles service selector.

<kbd>shift</kbd> + <kbd>R</kbd>: Toggles region selector.

<kbd>shift</kbd> + <kbd>S</kbd>: Toggles support menu.

### Region Searching

![Region Quick Searching](features/region-quick-search.gif)

* Adds a search box to filter region selection. Start typing as soon as the region list is open!
* Use arrow keys to navigate between regions, and the filter box. Loops from top to bottom, and bottom to top.

## Feature Support

* All features supported in old and new UI console versions.

## Bugs / Issues / Feature Requests

Please use the GitHub issue tracker to report any feedback. 

## Developing

The extension source code is in `src/`.

The extension files and manifest are built using a simple script.

Install required modules with `npm install` and build with `npm run build`.
