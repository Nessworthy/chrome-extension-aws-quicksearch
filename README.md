# Chrome Extension: AWS QuickSearch

Quickly switch services & regions in AWS.

## Usage / Features

### Keyboard Shortcuts

<kbd>Alt</kbd> + <kbd>S</kbd>: Toggles service menu.

<kbd>Alt</kbd> + <kbd>A</kbd>: Toggles account menu.

<kbd>Alt</kbd> + <kbd>R</kbd>: Toggles region menu.

<kbd>Alt</kbd> + <kbd>P</kbd>: Toggles support menu.

You can see these shortcuts at any time by clicking the extension icon in Chrome.

### Region Searching

![Region Quick Searching](features/region-quick-search.gif)

* Adds a search box to filter region selection. Start typing as soon as the region list is open!
* Use arrow keys to navigate between regions, and the filter box. Loops from top to bottom, and bottom to top.

## Feature Support

* All features supported in old and new UI console versions.

## Usage / Security

Concerned about security? Please see the [security policy](SECURITY.md) for more information.

Feel free to get in touch about any concerns you may have.

## Bugs / Issues / Feature Requests

Please use the GitHub issue tracker to report any feedback. 

## Developing

The extension source code is in `src/`.

The extension files and manifest are built using a simple script.

Install required modules with `npm install` and build with `npm run build`.
