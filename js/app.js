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
  openExternalLinks();
});

function openExternalLinks() {
  const outerPageLinks = document.querySelectorAll(".outerPageLink")
  outerPageLinks.forEach((outerLink) => {
    outerLink.addEventListener("click", (e) => {
      e.preventDefault();
  e.stopPropagation();

  const goTo = outerLink.href;

  confirmAction(
    "Open external link",
    `This link will take you to another page. Continue to ${goTo}?`,
    [
      { label: "Cancel", type: "cancel" },
      {
        label: "Continue",
        type: "confirm",
        onClick: () => window.open(goTo, "_blank", "noopener,noreferrer"),
      },
    ],
  );
})
})
    }