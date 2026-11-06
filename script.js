/* =========================================
   Ripon Portfolio — shared by index.html and resume.html
   Language toggle (class-based) + mobile menu + scroll reveal
   All text lives in the HTML; this file only switches visibility.
   ========================================= */

const STORAGE_KEY = "ripon-lang";
const root = document.documentElement;

function setLanguage(lang) {
  const isEn = lang === "en";
  root.classList.toggle("lang-en", isEn);
  root.lang = isEn ? "en" : "ja";

  document.querySelectorAll("[data-lang-opt]").forEach((opt) => {
    opt.classList.toggle("active", opt.dataset.langOpt === root.lang);
  });

  const toggle = document.getElementById("langToggle");
  if (toggle) toggle.setAttribute("aria-label", isEn ? "日本語に切り替え" : "Switch to English");

  try { localStorage.setItem(STORAGE_KEY, root.lang); } catch (e) { /* storage blocked — ignore */ }
}

document.addEventListener("DOMContentLoaded", () => {
  // The inline <head> script already applied ?lang= / localStorage / default.
  // Sync the toggle UI with that state (and remember a ?lang= choice).
  setLanguage(root.classList.contains("lang-en") ? "en" : "ja");

  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      setLanguage(root.classList.contains("lang-en") ? "ja" : "en");
    });
  }

  // ----- Mobile menu (only on pages that have one) -----
  const menuBtn = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    const setMenu = (open) => {
      navLinks.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    };
    menuBtn.addEventListener("click", () => {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  // ----- Footer year -----
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ----- Fade-in on scroll -----
  const targets = document.querySelectorAll(".section-title, .project-card, .gallery-item, .skill-block, .service-card, .about-text");
  if ("IntersectionObserver" in window) {
    targets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((el) => io.observe(el));
  }
});
