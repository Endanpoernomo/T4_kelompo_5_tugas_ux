document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const liveRegion = document.getElementById("live-region");

  function notifyScreenReader(text) {
    liveRegion.innerHTML = `<div class="live-toast" role="status">${text}</div>`;
    setTimeout(() => {
      liveRegion.innerHTML = "";
    }, 3500);
  }

  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    primaryNav.classList.toggle("is-open");
  });

  // 2. Theme Switcher (Terang, Gelap, Kontras Tinggi)
  const themeBtns = document.querySelectorAll(".theme-btn");
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.themeVal;
      root.setAttribute("data-theme", theme);
      themeBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      notifyScreenReader(`Mode tampilan diubah ke ${btn.textContent}`);
    });
  });

  // 3. Dynamic Font Size Resizer
  let scale = 1;
  function applyScale(newScale) {
    scale = Math.min(Math.max(newScale, 0.85), 1.3);
    root.style.setProperty("--font-scale", scale);
    notifyScreenReader(
      `Ukuran teks diubah menjadi ${Math.round(scale * 100)} persen`,
    );
  }

  document
    .getElementById("btn-font-up")
    .addEventListener("click", () => applyScale(scale + 0.1));
  document
    .getElementById("btn-font-down")
    .addEventListener("click", () => applyScale(scale - 0.1));
  document
    .getElementById("btn-font-reset")
    .addEventListener("click", () => applyScale(1));

  // 4. Accessible FAQ Accordion
  document.querySelectorAll(".faq-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const content = document.getElementById(
        btn.getAttribute("aria-controls"),
      );
      btn.setAttribute("aria-expanded", !expanded);
      btn.querySelector("span[aria-hidden]").textContent = expanded ? "+" : "−";
      content.hidden = expanded;
    });
  });

  // 5. Accessible Contact Form Validation
  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [
      {
        input: document.getElementById("client-name"),
        err: document.getElementById("err-name"),
        msg: "Nama lengkap atau perusahaan wajib diisi.",
      },
      {
        input: document.getElementById("client-email"),
        err: document.getElementById("err-email"),
        msg: "Masukkan alamat email yang valid.",
        isEmail: true,
      },
      {
        input: document.getElementById("client-msg"),
        err: document.getElementById("err-msg"),
        msg: "Jelaskan kebutuhan proyek Anda.",
      },
    ];

    let firstErrorField = null;

    fields.forEach((item) => {
      const val = item.input.value.trim();
      const valid = item.isEmail
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        : val.length > 0;

      if (!valid) {
        item.input.setAttribute("aria-invalid", "true");
        item.input.setAttribute("aria-describedby", item.err.id);
        item.err.textContent = `⚠ ${item.msg}`;
        item.err.hidden = false;
        if (!firstErrorField) firstErrorField = item.input;
      } else {
        item.input.removeAttribute("aria-invalid");
        item.err.hidden = true;
      }
    });

    if (firstErrorField) {
      firstErrorField.focus();
      notifyScreenReader(
        "Formulir belum lengkap. Silakan periksa kolom yang ditandai.",
      );
    } else {
      notifyScreenReader(
        "Terima kasih! Permintaan konsultasi Anda telah terkirim.",
      );
      contactForm.reset();
    }
  });
});
