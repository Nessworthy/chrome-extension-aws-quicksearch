/**
 * Define available shortcuts, and what keys they are bound to
 */
const keyTriggers = {
    A: toggleAccountMenu,
    R: toggleRegionMenu,
    S: toggleServiceMenu,
    P: toggleSupportMenu
}

/**
 * States for the double shortcut to trigger the service box.
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

    function focusOnFirstItem(visibleRegions) {
        let target = ['A', 'SPAN'].indexOf(visibleRegions[0].nodeName) !== -1 ? visibleRegions[0] : visibleRegions[0].firstChild;
        target.focus();
        currentActiveElement = target;
    }

    function focusOnLastItem(visibleRegions) {
        let lastElement = visibleRegions[visibleRegions.length - 1];
        let target = ['A', 'SPAN'].indexOf(lastElement.nodeName) !== -1 ? lastElement : lastElement.firstChild;
        target.focus();
        currentActiveElement = target;
    }

    function focusOnNextItem(current) {
        while (current = current.nextSibling) {
            if (['LI', 'A', 'SPAN'].indexOf(current.nodeName) === -1 || current.classList.contains(hideRegionClassName)) {
                continue;
            }
            let target = ['A', 'SPAN'].indexOf(current.nodeName) !== -1 ? current : current.firstChild;
            target.focus();
            currentActiveElement = target;
            return false;
        }
        // Reached the end?
        focusOnSearchBar()
    }

    function focusOnPreviousItem(current) {
        while (current = current.previousSibling) {
            if (['LI', 'A', 'SPAN'].indexOf(current.nodeName) === -1 || current.classList.contains(hideRegionClassName)) {
                continue;
            }
            let target = ['A', 'SPAN'].indexOf(current.nodeName) !== -1 ? current : current.firstChild;
            target.focus();
            currentActiveElement = target;
            return false;
        }
        // Reached the start?
        focusOnSearchBar()
    }

    function focusOnSearchBar() {
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

        // New, old
        let visibleRegions = menuElement.querySelectorAll('li:not(.' + hideRegionClassName + '), .region:not(.' + hideRegionClassName + ')');

        let active = currentActiveElement || searchElement;

        if (active === searchElement) {
            if (event.code === 'ArrowDown') {
                focusOnFirstItem(visibleRegions)
            } else {
                focusOnLastItem(visibleRegions)
            }
            return false;
        }

        let current = active;

        // New layout only (hence the exclusion on .region)
        if (!active.classList.contains('region')) {
            current = current.parentElement;
        }

        if (current.nodeName !== 'LI' && !active.classList.contains('region')) {
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
            } else if (["LI", "A", "SPAN"].indexOf(e.nodeName) !== -1) { // Little hacky. :(
                if (!e.classList.contains(hideRegionClassName)) {
                    anyPreviouslyVisible = true;
                }
            }
        });

        if (lastVisibleHr) {
            if (!anyPreviouslyVisible) {
                if (!lastVisibleHr.classList.contains(hideBreakClassName)) {
                    lastVisibleHr.classList.add(hideBreakClassName)
                }
            } else {
                if (lastVisibleHr.classList.contains(hideBreakClassName)) {
                    lastVisibleHr.classList.remove(hideBreakClassName)
                }
            }
        }

        return true;
    }
}

/**
 * Silly function to escape a string for regex.
 * All credit to user bobince of StackOverflow
 * @link https://stackoverflow.com/a/3561711/2274710
 * @param {string} string
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
function bindRegionQuickSearch(menuContainer, menuRegionsContainer, regionItemSelector) {

    let parent = menuContainer;
    let searchPane = document.createElement('div');
    let searchInput = document.createElement('input');

    searchPane.id = "aws_quick_search_pane";

    searchInput.type = "search";
    searchInput.placeholder = "Type to filter...";

    let regionElementsByString = {};
    menuRegionsContainer.querySelectorAll(regionItemSelector).forEach(e => {
        regionElementsByString[e.innerText.toLowerCase()] = e
    });

    setTimeout(() => {
        searchPane.prepend(searchInput)
        parent.prepend(searchPane)
        searchInput.value = "";
        searchInput.focus();
    }, 10);

    regionQuickSearchHandler = createRegionQuickSearchHandler(regionElementsByString, searchInput, menuRegionsContainer);
    regionQuickSelectHandler = createRegionQuickSelectHandler(searchInput, menuRegionsContainer);

    window.addEventListener('input', regionQuickSearchHandler);
    window.addEventListener('keydown', regionQuickSelectHandler);
}

/**
 * Toggles the AWS service box after being triggered twice in quick succession (500ms).
 * Supports the old and new layout.
 */
function toggleServiceMenu() {
    toggleNavigationMenu('services', 'services');
}

/**
 * Generic function to toggle a top level menu.
 * @param {string} ariaControlMenuName The name of the aria control vlaue of the button - e.g. for menu--foo you would pass "foo". New UI
 * @param {string} navMenuName The name included in the ID of the button - e.g. for "nav-fooMenu" you would pass "foo". Old UI.
 */
function toggleNavigationMenu(ariaControlMenuName, navMenuName) {
    let element = document.querySelector(`[aria-controls="menu--${ariaControlMenuName}"]`)
        || document.querySelector(`#nav-${navMenuName}Menu`);

    if (!element) {
        return;
    }

    element.focus();
    element.click();
}

/**
 * Toggle the AWS region menu.
 * Supports the old and new layout.
 */
function toggleRegionMenu() {
    toggleNavigationMenu('regions', 'region')
}

/**
 * Toggle the AWS support menu.
 * Supports the old and new layout.
 */
function toggleSupportMenu() {
    toggleNavigationMenu('support', 'support')
}

/**
 * Toggle the AWS account menu.
 * Supports the old and new layout.
 */
function toggleAccountMenu() {
    toggleNavigationMenu('account', 'account')
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
    let mutationToggleElement;
    let mutationCheck;
    let regionListContainer;
    let regionMenuContainer;
    let regionItemSelector;
    let firstObserverCall = true;
    let uiVersion = 0;
    if (document.querySelector('[aria-controls="menu--regions"]')) {
        uiVersion = 2;
        regionItemSelector = 'li';
        mutationToggleElement = document.querySelector('[aria-controls="menu--regions"]');
        mutationCheck = function(mutation) {
            if (mutation.attributeName !== 'aria-expanded') {
                return null;
            }
            let attribute = mutation.target.attributes.getNamedItem('aria-expanded');
            return !!(attribute && attribute.value === "true");
        }
    } else if (document.querySelector('#nav-regionMenu')) {
        uiVersion = 1;
        regionItemSelector = 'a, span'
        mutationToggleElement = document.querySelector('#nav-regionMenu');
        mutationCheck = function(mutation) {
            if (mutation.attributeName !== 'class') {
                return null;
            }
            return mutation.target.classList.contains('active');
        }
    } else {
        return;
    }

    const observer = new MutationObserver(function (mutationsList) {

        if (firstObserverCall) {
            firstObserverCall = false;
            if (uiVersion === 2) {
                // Newer version?
                regionListContainer = document.querySelector('#menu--regions');
                regionMenuContainer = regionListContainer.parentElement;
            } else if (uiVersion === 1) {
                // Older version?
                regionMenuContainer = document.querySelector('#regionMenuContent');
                regionListContainer = regionMenuContainer;
            }
        }

        let change = false
        let isOpen = false;

        mutationsList.forEach(mutation => {
            let result = mutationCheck(mutation);
            if (result === null) {
                return;
            }
            change = true;
            isOpen = result;
        });

        if (!change) {
            return;
        }

        if (isOpen) {
            bindRegionQuickSearch(regionMenuContainer, regionListContainer, regionItemSelector);
        } else {
            unbindRegionQuickSearch(regionMenuContainer, regionListContainer, regionItemSelector);
        }
    })

    observer.observe(mutationToggleElement, {
        attributes: true,
    })
}

/**
 * Bind the shortcode triggers to the window.
 */
document.addEventListener('keydown', event => {

    if (!event.altKey === false) {
        return true;
    }

    let key = event.key.toUpperCase();

    if (!(key in keyTriggers)) {
        return true;
    }

    keyTriggers[key]();
    return true;
});

setupObserverForRegionQuickSearch()
