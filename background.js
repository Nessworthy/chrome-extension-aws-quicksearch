/**
 * States for the double shift shortcut to trigger the service box.
 * A bit messy. Should be scoped a bit more locally.
 */
let inTime = false;
let inTimeTimer = false;

/**
 * Applied classes to the region break and list items to hide them from view.
 */
const hideRegionClassName = 'aws-quick-search-region--hide';
const hideBreakClassName = 'aws-quick-search-break--hide';

/**
 * Region functionality handlers are kept here to be bound and unbound as needed.
 * It's a little messy.
 */
let regionQuickSearchHandler = null;
let regionQuickSelectHandler = null;

/**
 * Creates an event handler to allow arrow keys to navigate through visible regions in the regions box.
 * WARNING: This forcibly nullifies the down/up arrow events because AWS' own arrow code screws with this one.
 * @param {HTMLElement} searchElement
 * @param {HTMLElement} menuElement
 * @returns {function(...[*]=)}
 */
function createRegionQuickSelectHandler(searchElement, menuElement) {
    // We have to internally keep tabs on the "currently focused item" because AWS' handlers screw with ours here.
    // This was added last minute, so the function below is messy as hell.
    let currentActiveElement = null;

    function focusOnFirstItem(visibleRegions)
    {
        visibleRegions[0].firstChild.focus();
        currentActiveElement = document.activeElement;
    }

    function focusOnLastItem(visibleRegions)
    {
        visibleRegions[visibleRegions.length-1].firstChild.focus();
        currentActiveElement = document.activeElement;
    }

    function focusOnNextItem(current)
    {
        while (current = current.nextSibling) {
            if (current.nodeName !== 'LI' || current.classList.contains(hideRegionClassName)) {
                continue;
            }
            current.firstChild.focus();
            currentActiveElement = current.firstChild;
            return false;
        }
        // Reached the end?
        focusOnSearchBar()
    }

    function focusOnPreviousItem(current)
    {
        while (current = current.previousSibling) {
            if (current.nodeName !== 'LI' || current.classList.contains(hideRegionClassName)) {
                continue;
            }
            current.firstChild.focus();
            currentActiveElement = current.firstChild;
            return false;
        }
        // Reached the start?
        focusOnSearchBar()
    }

    function focusOnSearchBar()
    {
        searchElement.focus()
        currentActiveElement = searchElement;
    }

    return function (event) {
        if (event.code !== "ArrowDown" && event.code !== "ArrowUp") {
            return true;
        }

        // Suppress further key event handlers, because they screw with this. >:O
        // TODO: Let's not do this?
        event.preventDefault();

        let visibleRegions = menuElement.querySelectorAll('li:not(.' + hideRegionClassName + ')');

        let active = currentActiveElement || searchElement;

        if (active === searchElement) {
            if (event.code === 'ArrowDown') {
                focusOnFirstItem(visibleRegions)
            } else {
                focusOnLastItem(visibleRegions)
            }
            return false;
        }

        let current = active.parentElement;

        if (active.nodeName === 'A') {
            current = active.parentElement;
        }

        if (current.nodeName !== 'LI') {
            // Unknown element - focus on the first menu item.
            focusOnFirstItem(visibleRegions);
            return false;
        }

        if (event.code === 'ArrowDown') {
            focusOnNextItem(current);
        } else {
            focusOnPreviousItem(current);
        }

        return false;
    }
}

/**
 * Creates an event handler for the region filter box to update the visible regions.
 * @param {object} regions
 * @param {HTMLElement} searchElement
 * @param {HTMLElement} menuElement
 * @returns {function(*): boolean}
 */
function createRegionQuickSearchHandler(regions, searchElement, menuElement) {
    return function () {
        let text = searchElement.value.toLowerCase();

        let toShow = [];
        let toHide = [];
        Object.keys(regions).forEach(key => {
            if (key.match(escapeRegex(text))) {
                toShow.push(regions[key]);
            } else {
                toHide.push(regions[key]);
            }
        });

        toShow.forEach(e => {
            if (e.classList.contains(hideRegionClassName)) {
                e.classList.remove(hideRegionClassName)
            }
        })
        toHide.forEach(e => {
            if (!e.classList.contains(hideRegionClassName)) {
                e.classList.add(hideRegionClassName)
            }
        })

        let anyPreviouslyVisible = false;
        let lastVisibleHr = null;

        menuElement.childNodes.forEach(e => {
            if (e.nodeName === "HR") {
                if (!anyPreviouslyVisible) {
                    if (!e.classList.contains(hideBreakClassName)) {
                        e.classList.add(hideBreakClassName)
                    }
                } else {
                    lastVisibleHr = e;
                    if (e.classList.contains(hideBreakClassName)) {
                        e.classList.remove(hideBreakClassName)
                    }
                }
                anyPreviouslyVisible = false;
            } else if (e.nodeName === "LI") {
                if (!e.classList.contains(hideRegionClassName)) {
                    anyPreviouslyVisible = true;
                }
            }
        });

        if (!anyPreviouslyVisible) {
            if (!lastVisibleHr.classList.contains(hideBreakClassName)) {
                lastVisibleHr.classList.add(hideBreakClassName)
            }
        } else {
            if (lastVisibleHr.classList.contains(hideBreakClassName)) {
                lastVisibleHr.classList.remove(hideBreakClassName)
            }
        }

        return true;
    }
}

/**
 * Silly function to escape a string for regex.
 * All credit to user bobince of StackOverflow
 * @link https://stackoverflow.com/a/3561711/2274710
 * @param string
 * @returns {*}
 */
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Unbinds the events to handle quick searching in the region box.
 */
function unbindRegionQuickSearch() {
    window.removeEventListener('input', regionQuickSearchHandler);
    window.removeEventListener('keydown', regionQuickSelectHandler);
    document.querySelector('#aws_quick_search_pane').remove();
    document.querySelectorAll('.' + hideRegionClassName).forEach(e => e.classList.remove(hideRegionClassName))
    document.querySelectorAll('.' + hideBreakClassName).forEach(e => e.classList.remove(hideBreakClassName))
}

/**
 * Binds the events to handle quick searching in the region box.
 * This function expects the region box to be visible to the user.
 */
function bindRegionQuickSearch() {
    let menuRegions = document.querySelector('#menu--regions');
    if (!menuRegions) {
        return;
    }
    let parent = menuRegions.parentElement;
    let searchPane = document.createElement('div');
    let searchInput = document.createElement('input');

    searchPane.id = "aws_quick_search_pane";

    searchInput.type = "search";
    searchInput.placeholder = "Type to filter...";

    let regionElementsByString = {};
    document.querySelectorAll('#menu--regions > li').forEach(e => {
        regionElementsByString[e.innerText.toLowerCase()] = e
    });

    setTimeout(() => {
        searchPane.prepend(searchInput)
        parent.prepend(searchPane)
        searchInput.value = "";
        searchInput.focus();
    }, 10);

    regionQuickSearchHandler = createRegionQuickSearchHandler(regionElementsByString, searchInput, menuRegions);
    regionQuickSelectHandler = createRegionQuickSelectHandler(searchInput, menuRegions);

    window.addEventListener('input', regionQuickSearchHandler);
    window.addEventListener('keydown', regionQuickSelectHandler);
}

/**
 * Toggles the AWS service box after being triggered twice in quick succession (500ms).
 * Supports the old and new layout.
 * TODO: Move second trigger logic to outside of this function.
 */
function toggleServiceBox() {

    if (inTime) {
        clearTimeout(inTimeTimer);
        inTime = false;

        // Trigger search window.
        let element = document.querySelector('#nav-servicesMenu') || document.querySelector('[data-testid="aws-services-list-button"]');

        if (!element) {
            return true;
        }

        element.click();
    }

    inTime = true;
    inTimeTimer = setTimeout(() => {
        inTime = false
    }, 500)
}

/**
 * Toggle the AWS region box.
 * Supports the old and new layout.
 */
function toggleRegionBox() {
    let element = document.querySelector('[aria-controls="menu--regions"]') || document.querySelector('#nav-regionMenu');

    if (!element) {
        return;
    }

    element.focus();
    element.click();
}

/**
 * Set up the bind and unbind hooks for the region quick-filter / search functionality.
 *
 * The mutation observer acts as the hacky way to watch for AWS's menu open/close actions.
 * While AWS does have a custom "awsc-menu-open" event, there's no close, so it's been done this way.
 *
 * What we do is watch the "aria-expanded" on the region button for changes, and work it that way.
 *
 * Currently only supported with the "new" bar.
 */
function setupObserverForRegionQuickSearch() {
    if (!document.querySelector('[aria-controls="menu--regions"]')) {
        return;
    }

    const observer = new MutationObserver(function (mutationsList, observer) {
        let change = false
        let isOpen = false;

        mutationsList.forEach(mutation => {
            if (mutation.attributeName === 'aria-expanded') {
                change = true;
                let attribute = mutation.target.attributes.getNamedItem('aria-expanded');
                isOpen = attribute && attribute.value === "true"
            }
        });

        if (!change) {
            return;
        }

        if (isOpen) {
            bindRegionQuickSearch();
        } else {
            unbindRegionQuickSearch();
        }
    })

    observer.observe(document.querySelector('[aria-controls="menu--regions"]'), {
        attributes: true,
    })
}

/**
 * Bind the shortcode triggers to the window.
 * Shift + Shift = toggle service menu
 * Shift + R = toggle region window
 */
window.addEventListener('keydown', event => {
    if (event.key === "Shift") {
        toggleServiceBox();
        return true;
    }

    if (event.key === "R" && event.shiftKey === true) {
        toggleRegionBox();
        return true;
    }
});

setupObserverForRegionQuickSearch();
