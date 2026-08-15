// improvements.js
// Safer, more accessible JS for The Unimpressed Companion
// Attach to the page after DOM is ready. No globals.

(function () {
  'use strict';

  const roasts = [
    "Your screen time report tomorrow is going to look like an absolute cry for help.",
    "Fascinating. You spent your hard-earned time opening this just to be insulted by code. Respect.",
    "Are we really doing this? Staring at a glowing rectangle when you have actual responsibilities sitting two feet away?",
    "I'd tell you to go touch grass, but let's be honest, you'd just complain about the Wi‑Fi signal out there.",
    "Every time you open this app, an angel loses its patience and a developer sighs.",
    "Your battery is at 42% and dropping, much like your overall motivation levels.",
    "Riveting behavior. Truly a masterclass in procrastination."
  ];

  function qs(id) {
    return document.getElementById(id);
  }

  function stripQuotes(s) {
    return s.replace(/^\"|\"$/g, '');
  }

  function pickRoast(prev) {
    if (!Array.isArray(roasts) || roasts.length === 0) return '';
    if (roasts.length === 1) return roasts[0];
    let candidate;
    do {
      candidate = roasts[Math.floor(Math.random() * roasts.length)];
    } while (candidate === prev);
    return candidate;
  }

  function generateRoast(roastTextEl) {
    const prev = roastTextEl ? stripQuotes(roastTextEl.textContent || '') : '';
    const next = pickRoast(prev);
    if (roastTextEl) {
      // Use textContent to avoid HTML parsing/unsafe content
      roastTextEl.textContent = `"${next}"`;
    }
  }

  function isSecureContextForNotifications() {
    // Notification API requires secure context (https or localhost) in most browsers
    return (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  }

  async function requestPermissions(roastTextEl) {
    if (!('Notification' in window)) {
      alert("Your browser doesn't support background stalking notifications. Consider yourself lucky.");
      return;
    }
    if (!isSecureContextForNotifications()) {
      alert('Notifications require a secure connection (HTTPS). Run locally or serve over HTTPS.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Permission granted. He can now judge your lock screen at random hours. Excellent.');
        try {
          // Only create a basic notification; do not rely on local icons unless present
          new Notification('The Companion', {
            body: "Still scrolling? Your sleep schedule is looking like an absolute structural failure."
          });
        } catch (err) {
          // Some browsers throw when notifications are blocked by user agent policies
          // Fail silently but log for debugging
          // eslint-disable-next-line no-console
          console.warn('Notification display failed:', err);
        }
      } else if (permission === 'denied') {
        alert('Coward. You denied him the right to judge you remotely.');
      } else {
        // permission === 'default'
        alert('Notification permission dismissed. He remains hopeful (and disappointed).');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Notification permission error', err);
      alert('Notifications could not be enabled — check console for details.');
    }
  }

  // Attach event listeners once DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    const roastTextEl = qs('roast-text');
    const btnGenerate = qs('btn-generate');
    const btnNotify = qs('btn-notify');
    const tipLink = qs('tip-link');

    // Ensure roast area is accessible for screen readers
    if (roastTextEl) {
      roastTextEl.setAttribute('aria-live', 'polite');
      roastTextEl.setAttribute('role', 'status');
    }

    if (btnGenerate) {
      btnGenerate.addEventListener('click', function () {
        generateRoast(roastTextEl);
      });
      // allow keyboard activation semantics to remain natural (button element already does)
    }

    if (btnNotify) {
      btnNotify.addEventListener('click', function () {
        requestPermissions(roastTextEl);
      });
    }

    if (tipLink) {
      tipLink.addEventListener('click', function (ev) {
        ev.preventDefault();
        // Small non-modal polite interaction
        // eslint-disable-next-line no-alert
        alert('Thank you for the bribe. He is slightly less disappointed in you now.');
      });
    }

    // Optional: keyboard shortcut (R) to generate a roast — unobtrusive
    document.addEventListener('keydown', function (ev) {
      // ignore when user is focused in an input/textarea
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement && document.activeElement.isContentEditable) return;

      if (ev.key === 'r' || ev.key === 'R') {
        ev.preventDefault();
        generateRoast(roastTextEl);
      }
    });
  });
})();
