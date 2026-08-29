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

    document.querySelectorAll("#year").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    /* =====================================================
       02. MOBILE NAVIGATION
    ===================================================== */

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {

        const closeMenu = () => {
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.classList.remove("is-open");
            navLinks.classList.remove("is-open");
        };

        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!isOpen));
            navToggle.classList.toggle("is-open", !isOpen);
            navLinks.classList.toggle("is-open", !isOpen);
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    /* =====================================================
       03. LIBRARY SEARCH + FILTERING
    ===================================================== */

    const librarySearch = document.querySelector("#library-search");
    const libraryCards = document.querySelectorAll(".library-card");
    const libraryCollections = document.querySelectorAll(".library-collection");
    const resultsCount = document.querySelector("#library-count");
    const filterButtons = document.querySelectorAll(".filter-button");

    let activeCategory = "all";

    const normalizeText = (value) => {
        return (value || "")
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    const getSearchableText = (card) => {
        const title = card.dataset.title || "";
        const category = card.dataset.category || "";
        const visibleText = card.textContent || "";

        return normalizeText(
            `${title} ${category} ${visibleText}`
        );
    };

    const matchesCategory = (card) => {
        if (activeCategory === "all") {
            return true;
        }

        const categories = normalizeText(card.dataset.category)
            .split(" ")
            .filter(Boolean);

        return categories.includes(activeCategory);
    };

    const matchesSearch = (card, searchTerm) => {
        if (!searchTerm) {
            return true;
        }

        const searchableText = getSearchableText(card);
        const words = normalizeText(searchTerm)
            .split(" ")
            .filter(Boolean);

        return words.every((word) => searchableText.includes(word));
    };

    const updateLibrary = () => {
        const searchTerm = librarySearch
            ? normalizeText(librarySearch.value)
            : "";

        let visibleCards = 0;

        libraryCards.forEach((card) => {
            const shouldShow =
                matchesSearch(card, searchTerm) &&
                matchesCategory(card);

            card.classList.toggle("library-hidden", !shouldShow);

            if (shouldShow) {
                visibleCards++;
            }
        });

        libraryCollections.forEach((collection) => {
            const hasVisibleCard =
                collection.querySelector(".library-card:not(.library-hidden)") !== null;

            collection.classList.toggle("library-hidden", !hasVisibleCard);
        });

        if (resultsCount) {
            if (!searchTerm && activeCategory === "all") {
                resultsCount.textContent = "Showing all books.";
            } else if (visibleCards === 1) {
                resultsCount.textContent = "1 book found.";
            } else {
                resultsCount.textContent = `${visibleCards} books found.`;
            }
        }

        let noResults = document.querySelector("#noResults");

        if (!noResults) {
            noResults = document.createElement("p");
            noResults.id = "noResults";
            noResults.className = "library-no-results";
            noResults.setAttribute("role", "status");
            noResults.textContent =
                "No books found. Try another title, subject, or description.";

            const controlsSection = document.querySelector(".library-controls-section");
            const firstCollection = document.querySelector(".library-collection");

            if (controlsSection) {
                controlsSection.appendChild(noResults);
            } else if (firstCollection?.parentElement) {
                firstCollection.parentElement.insertBefore(noResults, firstCollection);
            }
        }

        noResults.hidden = visibleCards !== 0;
    };

    if (librarySearch) {
        librarySearch.addEventListener("input", updateLibrary);

        librarySearch.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && librarySearch.value) {
                librarySearch.value = "";
                updateLibrary();
            }
        });
    }

    filterButtons.forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            button.classList.contains("active") ? "true" : "false"
        );

        button.addEventListener("click", () => {
            activeCategory = normalizeText(button.dataset.filter || "all");

            filterButtons.forEach((filter) => {
                const isActive = filter === button;
                filter.classList.toggle("active", isActive);
                filter.setAttribute("aria-pressed", isActive ? "true" : "false");
            });

            updateLibrary();
        });
    });

    if (libraryCards.length) {
        updateLibrary();
    }

    /* =====================================================
       04. SMOOTH INTERNAL LINKS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetID = link.getAttribute("href");

            if (!targetID || targetID === "#") {
                return;
            }

            const target = document.querySelector(targetID);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.pushState(null, "", targetID);
        });
    });

    /* =====================================================
       05. EXTERNAL LINKS
    ===================================================== */

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        const currentRel = link.getAttribute("rel") || "";
        const relValues = new Set(currentRel.split(/\s+/).filter(Boolean));

        relValues.add("noopener");
        relValues.add("noreferrer");

        link.setAttribute("rel", Array.from(relValues).join(" "));
    });

    /* =====================================================
       06. IMAGE ERROR HANDLING
    ===================================================== */

    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.classList.add("image-error");
        });
    });

    /* =====================================================
       07. PAGE READY
    ===================================================== */

    document.documentElement.classList.add("js-ready");

});
