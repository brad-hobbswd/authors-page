/* =========================================================
   BRADLEY HOBBS AUTHOR WEBSITE
   MASTER JAVASCRIPT

   Pages:
   index.html
   about.html
   library.html
   contact.html

   Features:
   • Mobile navigation
   • Current year
   • Library search
   • Library category filtering
   • Combined search + category filtering
   • Collection visibility
   • Accessible navigation states
   • Smooth internal navigation
   • External link handling
   • Image error handling
========================================================= */


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       01. CURRENT YEAR
    ===================================================== */

    const yearElements =
        document.querySelectorAll("#year");

    yearElements.forEach((element) => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       02. MOBILE NAVIGATION
    ===================================================== */

    const navToggle =
        document.querySelector(".nav-toggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (navToggle && navLinks) {


        navToggle.addEventListener("click", () => {

            const isOpen =
                navToggle.getAttribute(
                    "aria-expanded"
                ) === "true";


            navToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );


            navToggle.classList.toggle(
                "is-open",
                !isOpen
            );


            navLinks.classList.toggle(
                "is-open",
                !isOpen
            );

        });


        /* -------------------------------------------------
           Close navigation after selecting a link
        ------------------------------------------------- */

        navLinks
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        navToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        navToggle.classList.remove(
                            "is-open"
                        );

                        navLinks.classList.remove(
                            "is-open"
                        );

                    }
                );

            });


        /* -------------------------------------------------
           Close navigation when clicking outside
        ------------------------------------------------- */

        document.addEventListener(
            "click",
            (event) => {

                if (
                    !navLinks.contains(event.target) &&
                    !navToggle.contains(event.target)
                ) {

                    navToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    navToggle.classList.remove(
                        "is-open"
                    );

                    navLinks.classList.remove(
                        "is-open"
                    );

                }

            }
        );


        /* -------------------------------------------------
           Close navigation with Escape
        ------------------------------------------------- */

        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {

                    navToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    navToggle.classList.remove(
                        "is-open"
                    );

                    navLinks.classList.remove(
                        "is-open"
                    );

                    navToggle.focus();

                }

            }
        );

    }


    /* =====================================================
       03. LIBRARY ELEMENTS
    ===================================================== */

    const librarySearch =
        document.querySelector("#library-search");


    const libraryCards =
        document.querySelectorAll(
            ".library-card"
        );


    const libraryCollections =
        document.querySelectorAll(
            ".library-collection"
        );


    const resultsCount =
        document.querySelector("#library-count");


    const filterButtons =
        document.querySelectorAll(
            ".filter-button"
        );


    /*
     * The library page uses:
     *
     * #library-search
     * #library-count
     * .filter-button[data-filter]
     * .library-card[data-category]
     *
     * Everything below is designed around those
     * exact elements.
     */


    let activeCategory = "all";


    /* =====================================================
       04. LIBRARY SEARCH HELPERS
    ===================================================== */

    const normalizeText = (value) => {

        return (value || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

    };


    /* -----------------------------------------------------
       Determine whether a card belongs to a category
    ----------------------------------------------------- */

    const matchesCategory = (card) => {

        if (activeCategory === "all") {

            return true;

        }


        const categories =
            normalizeText(
                card.dataset.category
            )
            .split(/\s+/)
            .filter(Boolean);


        return categories.includes(
            activeCategory
        );

    };


    /* -----------------------------------------------------
       Determine whether a card matches the search
    ----------------------------------------------------- */

    const matchesSearch = (
        card,
        searchTerm
    ) => {

        if (!searchTerm) {

            return true;

        }


        /*
         * Search the complete card.
         *
         * This means the visitor can search:
         *
         * • title
         * • description
         * • book type
         * • category wording
         * • any other visible text
         */

        const searchableText =
            normalizeText(
                card.textContent
            );


        /*
         * Split multiple search words.
         *
         * Example:
         *
         * "church healing"
         *
         * requires both words to appear.
         */

        const words =
            normalizeText(searchTerm)
                .split(/\s+/)
                .filter(Boolean);


        return words.every(
            (word) =>
                searchableText.includes(word)
        );

    };


    /* =====================================================
       05. UPDATE LIBRARY
    ===================================================== */

    const updateLibrary = () => {


        const searchTerm =
            librarySearch
                ? normalizeText(
                    librarySearch.value
                )
                : "";


        let visibleCards = 0;


        /* -------------------------------------------------
           Check every book
        ------------------------------------------------- */

        libraryCards.forEach((card) => {


            const searchMatch =
                matchesSearch(
                    card,
                    searchTerm
                );


            const categoryMatch =
                matchesCategory(card);


            const shouldShow =
                searchMatch &&
                categoryMatch;


            if (shouldShow) {

                card.classList.remove(
                    "library-hidden"
                );

                visibleCards++;


            } else {

                card.classList.add(
                    "library-hidden"
                );

            }

        });


        /* -------------------------------------------------
           Hide empty collections
        ------------------------------------------------- */

        libraryCollections.forEach(
            (collection) => {


                const visibleCardsInCollection =
                    collection.querySelectorAll(
                        ".library-card:not(.library-hidden)"
                    );


                if (
                    visibleCardsInCollection.length === 0
                ) {

                    collection.classList.add(
                        "library-hidden"
                    );


                } else {

                    collection.classList.remove(
                        "library-hidden"
                    );

                }

            }
        );


        /* -------------------------------------------------
           Update result count
        ------------------------------------------------- */

        if (resultsCount) {


            if (
                searchTerm === "" &&
                activeCategory === "all"
            ) {

                resultsCount.textContent =
                    "Showing all books.";


            } else if (
                visibleCards === 1
            ) {

                resultsCount.textContent =
                    "1 book found.";


            } else {

                resultsCount.textContent =
                    `${visibleCards} books found.`;

            }

        }


        /* -------------------------------------------------
           No results message
        ------------------------------------------------- */

        let noResults =
            document.querySelector(
                "#noResults"
            );


        if (!noResults) {


            noResults =
                document.createElement("p");


            noResults.id =
                "noResults";


            noResults.className =
                "library-no-results";


            noResults.setAttribute(
                "role",
                "status"
            );


            noResults.textContent =
                "No books found. Try another title, subject, or description.";


            const controlsSection =
                document.querySelector(
                    ".library-controls-section"
                );


            if (controlsSection) {

                controlsSection.appendChild(
                    noResults
                );

            }

        }


        noResults.hidden =
            visibleCards !== 0;

    };


    /* =====================================================
       06. SEARCH EVENTS
    ===================================================== */

    if (librarySearch) {


        librarySearch.addEventListener(
            "input",
            updateLibrary
        );


        /*
         * Escape clears the search.
         */

        librarySearch.addEventListener(
            "keydown",
            (event) => {


                if (
                    event.key === "Escape" &&
                    librarySearch.value !== ""
                ) {

                    librarySearch.value =
                        "";


                    updateLibrary();

                }

            }
        );

    }


    /* =====================================================
       07. CATEGORY FILTER BUTTONS
    ===================================================== */

    filterButtons.forEach((button) => {


        /*
         * Make sure the accessibility state exists.
         */

        button.setAttribute(
            "aria-pressed",
            button.classList.contains("active")
                ? "true"
                : "false"
        );


        button.addEventListener(
            "click",
            () => {


                /*
                 * IMPORTANT:
                 *
                 * library.html uses:
                 *
                 * data-filter="healing"
                 *
                 * not:
                 *
                 * data-category="healing"
                 */

                activeCategory =
                    normalizeText(
                        button.dataset.filter ||
                        "all"
                    );


                /* -----------------------------------------
                   Update active button
                ----------------------------------------- */

                filterButtons.forEach(
                    (filter) => {


                        const isActive =
                            filter === button;


                        filter.classList.toggle(
                            "active",
                            isActive
                        );


                        filter.setAttribute(
                            "aria-pressed",
                            isActive
                                ? "true"
                                : "false"
                        );

                    }
                );


                /*
                 * Do NOT clear the search.
                 *
                 * Search and category filters are allowed
                 * to work together.
                 */

                updateLibrary();

            }
        );

    });


    /* =====================================================
       08. INITIAL LIBRARY STATE
    ===================================================== */

    if (libraryCards.length > 0) {

        updateLibrary();

    }


    /* =====================================================
       09. SMOOTH INTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach((link) => {


            link.addEventListener(
                "click",
                (event) => {


                    const targetID =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetID ||
                        targetID === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetID
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });


                    /*
                     * Update URL without causing
                     * another page jump.
                     */

                    history.pushState(
                        null,
                        "",
                        targetID
                    );

                }
            );

        });


    /* =====================================================
       10. EXTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach((link) => {


            if (
                !link.hasAttribute("rel")
            ) {

                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );

            }

        });


    /* =====================================================
       11. IMAGE ERROR HANDLING
    ===================================================== */

    document
        .querySelectorAll("img")
        .forEach((image) => {


            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-error"
                    );

                }
            );

        });


    /* =====================================================
       12. PAGE READY
    ===================================================== */

    document.documentElement.classList.add(
        "js-ready"
    );


});
