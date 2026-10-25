import { loadComponent } from "https://ui.scybud.com/js/ui.js";
import { openLoginModal } from "https://app.loghue.com/js/utils/modals.js";
import { autoExpandTextarea } from "https://app.loghue.com/js/utils/textarea.js";
import {
  handleConcentEvents,
  loadAnalytics,
} from "https://loghue.com/analytics.js";
import { attachSignoutEvents } from "./auth/auth.js";
import { sessionReady } from "./session.js";
import { confirmAction } from "https://app.loghue.com/js/utils/modals.js";

window.addEventListener("DOMContentLoaded", async () => {
  await sessionReady;

  // Analytics
  await loadComponent("../components/modals/cookies-banner", "infoDisplay");
  const saved = localStorage.getItem("consent-preferences");
  if (saved) {
    const prefs = JSON.parse(saved);
    const consentBanner = document.getElementById("consent-banner");
    if (consentBanner) consentBanner.remove();

    if (prefs.analytics) loadAnalytics();
  }

  handleConcentEvents();
  attachSignoutEvents();

  openLoginModal();

  autoExpandTextarea();

  makeLinksExternal();
  openExternalLinks();
});

function openExternalLinks() {
  const outerPageLinks = document.querySelectorAll(".outerPageLink");
  outerPageLinks.forEach((outerLink) => {
    outerLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const goTo = outerLink.href;
      const domain = new URL(goTo).hostname;

      confirmAction(
        "Open external link?",
        `You're about to leave LogHue Tasks and visit ${domain}. Do you want to continue?`,
        [
          { label: "Cancel", type: "cancel" },
          {
            label: "Open link",
            type: "confirm",
            onClick: () => window.open(goTo, "_blank", "noopener,noreferrer"),
          },
        ],
      );
    });
  });
}

function makeLinksExternal() {
  const taskCards = document.querySelectorAll(".taskCard");

  taskCards.forEach((card) => {
    const links = card.querySelectorAll("a");

    links.forEach((link) => {

      if (link.href.startsWith("https://")) {
        link.classList.add("outerPageLink");
      }
    });
  });
}