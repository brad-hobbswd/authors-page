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
   • Collection visibility
   • Accessible navigation states
   • Smooth internal navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. CURRENT YEAR
    ===================================================== */

    const yearElements = document.querySelectorAll("#year");

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });


    /* =====================================================
       02. MOBILE NAVIGATION
    ===================================================== */

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {

        navToggle.addEventListener("click", () => {

            const isOpen =
                navToggle.getAttribute("aria-expanded") === "true";

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


        /* Close navigation after selecting a link */

        navLinks.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

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

            });

        });


        /* Close navigation when clicking outside */

        document.addEventListener("click", (event) => {

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

        });


        /* Close navigation with Escape */

        document.addEventListener("keydown", (event) => {

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

        });

    }


    /* =====================================================
       03. LIBRARY SEARCH
    ===================================================== */

    const librarySearch =
        document.querySelector("#librarySearch");

    const libraryCards =
        document.querySelectorAll(".library-card");

    const libraryCollections =
        document.querySelectorAll(".library-collection");

    const resultsCount =
        document.querySelector("#libraryResults");

    const noResults =
        document.querySelector("#noResults");


    if (
        librarySearch &&
        libraryCards.length > 0
    ) {

        const updateLibrary = () => {

            const searchTerm =
                librarySearch.value
                    .trim()
                    .toLowerCase();

            let visibleCards = 0;


            libraryCards.forEach((card) => {

                const searchableText =
                    card.textContent
                        .toLowerCase();

                const matchesSearch =
                    searchTerm === "" ||
                    searchableText.includes(
                        searchTerm
                    );


                if (matchesSearch) {

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


            /*
             * Show or hide each collection depending
             * on whether it contains visible books.
             */

            libraryCollections.forEach(
                (collection) => {

                    const visibleCollectionCards =
                        collection.querySelectorAll(
                            ".library-card:not(.library-hidden)"
                        );

                    if (
                        searchTerm !== "" &&
                        visibleCollectionCards.length === 0
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


            /* Results message */

            if (resultsCount) {

                if (searchTerm === "") {

                    resultsCount.textContent =
                        "Browse the complete library.";

                } else if (visibleCards === 1) {

                    resultsCount.textContent =
                        "1 book found.";

                } else {

                    resultsCount.textContent =
                        `${visibleCards} books found.`;

                }

            }


            /* No-results message */

            if (noResults) {

                if (
                    searchTerm !== "" &&
                    visibleCards === 0
                ) {

                    noResults.hidden = false;

                } else {

                    noResults.hidden = true;

                }

            }

        };


        librarySearch.addEventListener(
            "input",
            updateLibrary
        );


        /*
         * Allow Escape to clear the search.
         */

        librarySearch.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    librarySearch.value !== ""
                ) {

                    librarySearch.value = "";

                    updateLibrary();

                }

            }
        );


        updateLibrary();

    }


    /* =====================================================
       04. LIBRARY CATEGORY FILTERS
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(
            ".filter-button"
        );


    if (
        filterButtons.length > 0 &&
        libraryCards.length > 0
    ) {

        filterButtons.forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const selectedCategory =
                        button.dataset.category;


                    /*
                     * Update active button
                     */

                    filterButtons.forEach(
                        (filter) => {

                            filter.classList.remove(
                                "active"
                            );

                            filter.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );

                    button.setAttribute(
                        "aria-pressed",
                        "true"
                    );


                    /*
                     * Filter cards
                     */

                    let visibleCards = 0;


                    libraryCards.forEach(
                        (card) => {

                            const cardCategory =
                                card.dataset.category;


                            const matchesCategory =
                                selectedCategory === "all" ||
                                cardCategory === selectedCategory;


                            if (
                                matchesCategory
                            ) {

                                card.classList.remove(
                                    "library-hidden"
                                );

                                visibleCards++;

                            } else {

                                card.classList.add(
                                    "library-hidden"
                                );

                            }

                        }
                    );


                    /*
                     * Hide collections that have
                     * no matching books.
                     */

                    libraryCollections.forEach(
                        (collection) => {

                            const matchingCards =
                                collection.querySelectorAll(
                                    `.library-card[data-category="${selectedCategory}"]:not(.library-hidden)`
                                );


                            if (
                                selectedCategory !== "all" &&
                                matchingCards.length === 0
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


                    /*
                     * Update result count.
                     */

                    if (resultsCount) {

                        if (
                            selectedCategory === "all"
                        ) {

                            resultsCount.textContent =
                                "Browse the complete library.";

                        } else if (
                            visibleCards === 1
                        ) {

                            resultsCount.textContent =
                                "1 book found in this category.";

                        } else {

                            resultsCount.textContent =
                                `${visibleCards} books found in this category.`;

                        }

                    }


                    /*
                     * Reset no-results state.
                     */

                    if (noResults) {

                        noResults.hidden =
                            visibleCards !== 0;

                    }


                    /*
                     * Clear search when selecting
                     * a category.
                     */

                    if (librarySearch) {

                        librarySearch.value = "";

                    }

                }
            );

        });

    }


    /* =====================================================
       05. COMBINED SEARCH + CATEGORY FILTER
    ===================================================== */

    /*
     * If your library contains both a search field
     * and category filters, this function allows them
     * to work together.
     */

    const applyLibraryFilters = () => {

        if (libraryCards.length === 0) {
            return;
        }


        const searchTerm =
            librarySearch
                ? librarySearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const activeFilter =
            document.querySelector(
                ".filter-button.active"
            );


        const selectedCategory =
            activeFilter
                ? activeFilter.dataset.category
                : "all";


        let visibleCards = 0;


        libraryCards.forEach((card) => {

            const cardText =
                card.textContent.toLowerCase();

            const cardCategory =
                card.dataset.category || "";


            const matchesSearch =
                searchTerm === "" ||
                cardText.includes(searchTerm);


            const matchesCategory =
                selectedCategory === "all" ||
                cardCategory === selectedCategory;


            const shouldShow =
                matchesSearch &&
                matchesCategory;


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


        /*
         * Update collection visibility.
         */

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


        /*
         * Update results.
         */

        if (resultsCount) {

            if (
                searchTerm === "" &&
                selectedCategory === "all"
            ) {

                resultsCount.textContent =
                    "Browse the complete library.";

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


        /*
         * No results.
         */

        if (noResults) {

            noResults.hidden =
                visibleCards !== 0;

        }

    };


    if (librarySearch) {

        librarySearch.addEventListener(
            "input",
            applyLibraryFilters
        );

    }


    filterButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                requestAnimationFrame(
                    applyLibraryFilters
                );

            }
        );

    });


    /* =====================================================
       06. SMOOTH INTERNAL LINKS
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
                        link.getAttribute("href");


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
                     * Update URL without jumping.
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
       07. EXTERNAL LINKS
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
       08. IMAGE ERROR HANDLING
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
       09. PAGE READY
    ===================================================== */

    document.documentElement.classList.add(
        "js-ready"
    );

});