/* =========================================================
   PROJECT + SKILL ALIGNMENT PATCH
   - Independent See More / See Less
   - Align project summary heights row-by-row
   - Equalize skill-card heights row-by-row
========================================================= */

const projectToggles = document.querySelectorAll(".project-toggle");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const skillCards = Array.from(document.querySelectorAll(".skill-card"));

function groupElementsByRow(elements) {
    const rows = [];
    const tolerance = 6;

    elements.forEach((element) => {
        const top = Math.round(element.getBoundingClientRect().top);

        let row = rows.find((item) => Math.abs(item.top - top) <= tolerance);

        if (!row) {
            row = { top, items: [] };
            rows.push(row);
        }

        row.items.push(element);
    });

    return rows.map((row) => row.items);
}

function syncHeights(elements, childSelector = null, minWidth = 992) {
    const targets = elements
        .map((element) => (childSelector ? element.querySelector(childSelector) : element))
        .filter(Boolean);

    targets.forEach((target) => {
        target.style.minHeight = "";
    });

    if (window.innerWidth < minWidth) {
        return;
    }

    const rows = groupElementsByRow(targets);

    rows.forEach((row) => {
        const maxHeight = Math.max(
            ...row.map((item) => Math.ceil(item.getBoundingClientRect().height))
        );

        row.forEach((item) => {
            item.style.minHeight = `${maxHeight}px`;
        });
    });
}

function syncProjectSummaryHeights() {
    syncHeights(projectCards, ".project-summary", 992);
}

function syncSkillCardHeights() {
    syncHeights(skillCards, null, 992);
}

function runAlignmentSync() {
    syncProjectSummaryHeights();
    syncSkillCardHeights();
}

projectToggles.forEach((toggle) => {
    const detailsId = toggle.getAttribute("aria-controls");
    const details = document.getElementById(detailsId);
    const label = toggle.querySelector(".project-toggle-text");
    const card = toggle.closest(".project-card");

    if (!details || !card) return;

    toggle.addEventListener("click", () => {
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
            toggle.setAttribute("aria-expanded", "false");
            card.classList.remove("is-expanded");

            if (label) {
                label.textContent = "See More";
            }

            details.classList.remove("is-opening");
            details.classList.add("is-closing");

            window.setTimeout(() => {
                details.hidden = true;
                details.classList.remove("is-closing");
                runAlignmentSync();
            }, 240);
        } else {
            toggle.setAttribute("aria-expanded", "true");
            card.classList.add("is-expanded");

            if (label) {
                label.textContent = "See Less";
            }

            details.hidden = false;
            details.classList.remove("is-closing");
            details.classList.add("is-opening");

            window.setTimeout(() => {
                details.classList.remove("is-opening");
                runAlignmentSync();
            }, 320);
        }
    });
});

requestAnimationFrame(runAlignmentSync);

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(runAlignmentSync);
}

window.addEventListener("load", runAlignmentSync);

let resizeTimer;

window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
        runAlignmentSync();
    }, 120);
});
