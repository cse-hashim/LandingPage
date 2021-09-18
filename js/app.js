/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
*/

/**
 * Define Global letiables
 *
*/

/**
 *
 * @description placeholder for the navigation bar unordered list
 * @type {HTMLElement}
 *
 */
let navBarList;// = document.getElementById('navbar__list');
/**
 * @description placeholder for the sections
 * @type {HTMLElement[]}
 */
let sectionList;
/**
 * @description shortname for visualViewport object
 * @type {VisualViewport}
 */
let vv = visualViewport;
/**
 * @description our navbar
 * @type {HTMLElement}
 */
let navBarMenu = document.getElementsByClassName('navbar__menu')[0];
/**
 * @description a flag to handle hover over the navBar
 * @type {Boolean}
 */
let fired1 = false;
/**
 * @description counter made for debugging and to act as a flag for the navBar behaviour on scroll
 * @type {Number}
 */
let navCounter = 0;
/**
 * @description a memoization for the old page scrolling position to differentiate between upward and downward scrolling
 * @type {Number}
 */
let oldPgOffset = window.pageYOffset;




/**
 * End Global letiables
 * Start Helper Functions
 *
*/
/**
 * 
 */
/**
 * End Helper Functions
 * Begin Main Functions
 *
*/
/**
 * @description the starting point of our logic
 */
const init = () => {
    navBarList = document.getElementById('navbar__list');
    sectionList = document.querySelectorAll('section');
    buildNav();
};

// build the nav
/**
 * @description create the nav menu and append it into the document
 */
const buildNav = () => {
    let frag = document.createDocumentFragment();
    sectionList.forEach(elem => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.className = 'menu__link';
        a.href = `#${elem.getAttribute('id')}`;
        a.innerHTML = `${elem.getAttribute('data-nav')}`;
        li.addEventListener('click', () => {
            // elem.scrollIntoView(true);
            jumpToSection(elem);
            setActive(elem);
        });

        li.appendChild(a);
        frag.appendChild(li);
    });
    navBarList.append(frag);
};

// Add class 'active' to section when near top of viewport
/**
 * @description add active while srolling if section changed
 * @param {1|2} selector - 0 for downward scrolling - 1 for upward scrolling
 * @returns {HTMLElement} the element that must be activated if any
 */
const addActive = (selector) => {
    if (selector === 1) {
        for (let i = 0; i <= sectionList.length - 1; i++) {
            const gbcr = sectionList[i].getBoundingClientRect();
            if (gbcr.top > 0 && gbcr.top < vv.height) {
                return sectionList[i];
            }
            else if (gbcr.top > (0.05) * vv.height && gbcr.top < (0.95) * vv.height) {
                return sectionList[i];
            }
            else if (gbcr.bottom > navBarMenu.clientHeight + 50) {
                return sectionList[i];
            }
        }
    }

    if (selector === 2) {
        for (let i = 0; i <= sectionList.length - 1; i++) {
            const gbcr = sectionList[i].getBoundingClientRect();
            if (gbcr.top > 0 && gbcr.top < vv.height) {
                return sectionList[i];
            }
        }
        for (let i = 0; i <= sectionList.length - 1; i++) {
            const gbcr = sectionList[i].getBoundingClientRect();
            if (gbcr.top > 0 && gbcr.top < (.95) * vv.height) {
                return sectionList[i];
            }
            else if (gbcr.top > (0.05) * vv.height && gbcr.top < (0.95) * vv.height) {
                return sectionList[i];
            }
            else if (gbcr.bottom > navBarMenu.clientHeight + 50) {
                return sectionList[i];
            }
        }
    }
};

// Scroll to anchor ID using scrollTO event
/**
 * End Main Functions
 * Begin Events
 *
*/
const onScroll = () => {
    //Active Logic
    const currentPgOffset = window.pageYOffset;
    setActive(addActive(currentPgOffset > oldPgOffset ? 1 : 2));
    oldPgOffset = currentPgOffset;

    //navBar collapse logic
    navBarMenu.style.top = '0';
    new Promise((resolve) => {
        setTimeout(() => {
            if (navCounter < 1) {
                navCounter++;
                if (navBarMenu.matches(':hover')) {
                    navBarMenu.style.top = '0';
                } else {
                    navBarMenu.style.top = `${-navBarMenu.clientHeight + 4}px`;
                }
            }
            resolve(1);
        }, 1500);
    }).then(() => {
        setTimeout(() => {
            if (navCounter > 0) {
                navCounter = 0;
            }
        }, 900);

    });

    //TOP btn logic
    const topBtn = document.getElementsByClassName('top-btn')[0];
    if (topBtn) {
        if (vv.pageTop > 200) {
            topBtn.style.visibility = 'visible';
        } else {
            topBtn.style.visibility = 'hidden';
        }
    }
};

// Build menu @see buildNav

// Scroll to section on link click
/**
 * @description scroll to the given element
 * @param {HTMLElement} elem
 */
const jumpToSection = (elem) => {
    elem.scrollIntoView(true);
};

// Set sections as active
/**
 * @description set the given element to Active
 * @param {HTMLElement} elem
 */
const setActive = (elem) => {
    if (!elem.classList.contains('active')) {
        sectionList.forEach(elem1 => {
            elem1.classList.remove('active');
        });
        elem.classList.add('active');
    }
};
/**
 * @description returns the current Active section
 * @returns {HTMLElement}
 */
const getCurrentActive = () => {
    let result = sectionList[0];
    sectionList.forEach(elem1 => {
        if (elem1.classList.contains('active')) {
            result = elem1;
        }
    });
    return result;
};

//starting point
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        new Promise((resolve) => {
            setTimeout(() => {
                init();
                resolve(1);
            }, 0);
        }).then(() => {
            //section collapse logic
            setTimeout(() => {
                sectionList.forEach((section) => {
                    section.querySelector('h2').addEventListener('click', () => {
                        if (!section.classList.contains('active')) {
                            setActive(section);
                        }
                        section.classList.toggle('uncollapsed');
                        section.querySelectorAll('p').forEach((p) => {
                            if (p.style.maxHeight) {
                                p.style.maxHeight = null;
                                section.style.minHeight = null;
                            } else {
                                p.style.maxHeight = p.scrollHeight + 'px';
                                section.style.minHeight = '80vh';
                            }
                        });
                    });
                });
                sectionList.forEach((section) => { section.querySelector('h2').click(); });
            }, 0);
        }).then(() => {
            //create the TOP button
            setTimeout(() => {
                let topBtn = document.createElement('button');
                topBtn.innerHTML = 'TOP';
                topBtn.classList.add('top-btn');
                topBtn.addEventListener('click', () => {
                    document.body.scrollTop = 0;
                    setActive(sectionList[0]);
                });
                topBtn.style.visibility = 'hidden';
                document.body.append(topBtn);
            }, 0);
        }).then(() => {
            //nav bar hover prevent hide on start
            if (!navBarMenu.matches(':hover')) {
                setTimeout(() => {
                    navBarMenu.style.top = `${-navBarMenu.clientHeight + 4}px`;
                }, 1500);
            }
        }).then(() => {
            navBarMenu.addEventListener('mouseout focusout', () => {
                if (fired1) {
                    setTimeout(() => {
                        navBarMenu.style.top = `${-navBarMenu.clientHeight + 4}px`; fired1 = false;
                    }, 1500);
                }
                if (!fired1) {
                    fired1 = true;
                }
            });
            navBarMenu.addEventListener('mouseenter', () => {
                navBarMenu.style.top = '0';
            });
            navBarMenu.addEventListener('mousemove', () => {
                navBarMenu.style.top = '0';
            });
            navBarMenu.addEventListener('mouseover', () => {
                navBarMenu.style.top = '0';
            });

        }).then(() => {
            setTimeout(() => {
                document.addEventListener('scroll', onScroll);
            }, 0);
        });
    });
})();
