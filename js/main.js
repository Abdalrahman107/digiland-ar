// modal video

const toggleBtn = document.getElementById("menu-toggle");
const menu = document.getElementById("mobileMenu");
const icon = document.getElementById("menu-icon");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  // Toggle icon
  icon.classList.toggle("fa-bars-staggered");
  icon.classList.toggle("fa-xmark");
});

const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("videoModal");
const iframe = document.getElementById("youtubeFrame");

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  iframe.src += "?autoplay=1";
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  iframe.src = iframe.src.replace("?autoplay=1", ""); // Stop video
});

// Optional: Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    iframe.src = iframe.src.replace("?autoplay=1", "");
  }
});

//   owl carousal

function initCarousels() {
  const isRTL = document.documentElement.dir === "rtl";
  // Destroy if already initialized (important!)
  if ($(".testimonial-carousel").hasClass("owl-loaded")) {
    $(".testimonial-carousel").trigger("destroy.owl.carousel");
    $(".testimonial-carousel").removeClass("owl-loaded");
  }
  if ($(".brand-carousel").hasClass("owl-loaded")) {
    $(".brand-carousel").trigger("destroy.owl.carousel");
    $(".brand-carousel").removeClass("owl-loaded");
  }

  // Re-initialize testimonial carousel
  $(".testimonial-carousel").owlCarousel({
    loop: true,
    margin: 20,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    rtl: isRTL,
    responsive: {
      0: { items: 1 },
      640: { items: 2 },
      1024: { items: 3 },
    },
  });

  // Re-initialize brand carousel
  $(".brand-carousel").owlCarousel({
    items: 1,
    loop: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 6000,
    rtl: isRTL,
    smartSpeed: 600,
  });
}

$(document).ready(function () {
  initCarousels();
});

// navlinks for sections

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove("text-red-500", "font-semibold");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("text-red-500", "font-semibold");
          }
        });
      }
    });
  },
  { threshold: 0.6 } // Adjust for trigger point
);

sections.forEach((section) => observer.observe(section));

// dark/light mode mode

const toggleThemeBtn = document.getElementById("theme-toggle");
const html = document.documentElement;
const themeIcon = document.getElementById("theme-icon");
localStorage.removeItem("theme");

toggleThemeBtn.addEventListener("click", () => {
  html.classList.toggle("dark");

  // Save preference
  if (html.classList.contains("dark")) {
    themeIcon.innerHTML = '<i class="text-2xl hover:text-red-500 fa-solid fa-sun"></i>';
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.innerHTML = '<i class="text-2xl hover:text-red-500 fa-solid fa-moon"></i>';
    localStorage.setItem("theme", "light");
  }
});

window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("opacity-0", "pointer-events-none");
    }, 1500);
    setTimeout(() => {
      loader.remove();
    }, 2000);
  }
});

// change navbar color with scrolling

if (window.scrollY > 50) {
  navbar.classList.remove("bg-[rgba(0,0,0,0.6)]", "text-white");
  navbar.classList.add("bg-white", "shadow-md", "dark:bg-gray-900", "dark:text-white");
}

window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.remove("bg-[rgba(0,0,0,0.6)]", "text-white");
    navbar.classList.add("bg-white", "shadow-md", "dark:bg-gray-900", "dark:text-white");
  } else {
    navbar.classList.add("bg-[rgba(0,0,0,0.6)]", "text-white");
    navbar.classList.remove("bg-white", "shadow-md", "dark:bg-gray-900");
  }
});

// translation

i18next.init(
  {
    lng: "en",
    debug: true,
    resources: {}, // Empty because you're loading via JSON
  },
  function () {
    // Initial language load will happen on DOMContentLoaded instead
  }
);

// Update all content and layout direction
function updateContent() {
  const lang = i18next.language;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // Update all [data-i18n] elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = i18next.t(key);
  });

  // Optional label and flag UI updates
  const label = document.getElementById("lang-label");
  const flag = document.getElementById("lang-flag");

  if (label && flag) {
    if (lang === "ar") {
      label.textContent = "English";
      flag.textContent = "🇬🇧";
    } else {
      label.textContent = "العربية";
      flag.textContent = "🇸🇦";
    }
  }
}


// Load translation file and switch language
function loadLanguage(lang) {
  fetch(`../public/Locales/${lang}.json`)
    .then((res) => res.json())
    .then((data) => {
      i18next.addResourceBundle(lang, "translation", data, true, true);
      i18next.changeLanguage(lang, () => {
        updateContent(); // Update text and direction
        setTimeout(() => {
          initCarousels(); // Rebuild carousels after DOM updates
        }, 100);
      });
    });
}

// Handle checkbox toggle
const langToggleCheckbox = document.getElementById("lang-toggle");
if (langToggleCheckbox) {
  langToggleCheckbox.addEventListener("change", (e) => {
    const newLang = e.target.checked ? "ar" : "en";
    loadLanguage(newLang);
  });
}

// On page load, load language based on checkbox state
window.addEventListener("DOMContentLoaded", () => {
  const defaultLang = langToggleCheckbox?.checked ? "ar" : "en";
  loadLanguage(defaultLang);
});

// faq section accordian

document.querySelectorAll(".faq-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const content = document.querySelector(targetId);
    const icon = btn.querySelector(".toggle-icon");

    // Close all others
    document.querySelectorAll(".faq-content").forEach((el) => {
      if (el !== content) el.classList.add("hidden");
    });

    document.querySelectorAll(".toggle-icon").forEach((ic) => {
      if (ic !== icon) ic.textContent = "+";
    });

    // Toggle current
    content.classList.toggle("hidden");
    icon.textContent = content.classList.contains("hidden") ? "+" : "-";
  });
});
