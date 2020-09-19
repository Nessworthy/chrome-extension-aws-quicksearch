# Security Policy

## App Usage

* This extension works by using Chrome's API to safely add a javascript file and stylesheet to your AWS console.
* This extension does not read, store, or use any credentials or other information. I don't even collect metrics on usage.
* This extension does not make any external requests, or fetch any external resources.
* This extension does not rely on any non-native, external, third party libraries (e.g. jQuery).
* This extension doesn't do anything dumb like mine bitcoin, nor does it contain any ads.
* This extension is stateless outside of a page load - it does not store data across pages, sessions, etc.
* The version of the extension in the help popup **should** be a reference to the tagged version/release in the source repository.

### Permissions

* `declarativeContent` - The extension needs to state when the help popup is clickable (i.e. only when visiting the AWS console).
    The only way to do this is by using Chrome's declarative API.

If you notice this app differing or extending beyond the usage declared above, please see below on reporting vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.2.0   | :white_check_mark: |
| < 1.2.0 | :x:                |

## Reporting a Vulnerability

In the strange event that there's security issues or concerns with this extension, please send details to sean@nessworthy.me directly.

I'm just one dude, but I endeavour to confirm and fix any vulnerabilities as soon as possible.

If a situation arises where I cannot fix an issue in the immediate / short term, I will happily pull this plugin
from the Chrome store until the issue is resolved. 
