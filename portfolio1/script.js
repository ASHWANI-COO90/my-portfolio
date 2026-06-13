// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  /* ============================================
     1. TYPING ANIMATION
     ============================================ */
  const roles = [
    "Full-Stack Developer",
    "Backend Enthusiast",
    "Open-Source Contributor",
    "Problem Solver",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedEl = document.getElementById("typed");

  if (typedEl) {
    function typeEffect() {
      const current = roles[roleIndex];

      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeEffect, 500);
          return;
        }
        setTimeout(typeEffect, 50);
      } else {
        typedEl.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(typeEffect, 1500);
          return;
        }
        setTimeout(typeEffect, 100);
      }
    }
    typeEffect();
  }

  /* ============================================
     2. THEME TOGGLE (with localStorage)
     ============================================ */
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  // Apply saved theme on page load
  const savedTheme = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", savedTheme);

  // Update icon based on current theme
  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.innerHTML =
        theme === "dark"
          ? '<i class="fas fa-moon"></i>'
          : '<i class="fas fa-sun"></i>';
    }
  }
  updateThemeIcon(savedTheme);

  // Toggle theme on click
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const newTheme = current === "dark" ? "light" : "dark";

      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }

  /* ============================================
     3. HAMBURGER MENU (Mobile)
     ============================================ */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    // Toggle menu on hamburger click
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent document click from firing
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    // Close menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  }

  /* ============================================
     4. SCROLL REVEAL ANIMATION
     ============================================ */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 },
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* ============================================
     5. SMOOTH SCROLL FOR NAV LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight =
          document.querySelector(".navbar")?.offsetHeight || 0;
        const offsetTop = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  /* ============================================
     6. CONTACT FORM HANDLER (Web3Forms) ✅ FIXED
     ============================================ */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalHTML = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      contactForm.classList.add("sending");

      // Prepare form data
      const formData = new FormData(contactForm);

      try {
        // Send to Web3Forms API
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          // ✅ SUCCESS
          contactForm.classList.remove("sending");
          contactForm.classList.add("success");
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          console.log("✅ Form submitted successfully!", result);

          // Reset form after 4 seconds
          setTimeout(() => {
            contactForm.classList.remove("success");
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            contactForm.reset();
          }, 4000);
        } else {
          // ❌ SERVER ERROR
          throw new Error(result.message || "Form submission failed");
        }
      } catch (error) {
        // ❌ NETWORK/ERROR STATE
        console.error("❌ Form error:", error);
        contactForm.classList.remove("sending");
        contactForm.classList.add("error");
        submitBtn.innerHTML =
          '<i class="fas fa-exclamation-triangle"></i> Failed - Try Again';
        submitBtn.disabled = false;

        setTimeout(() => {
          contactForm.classList.remove("error");
          submitBtn.innerHTML = originalHTML;
        }, 3000);
      }
    });
  }

  /* ============================================
     7. ANIMATED COUNTERS (for Contributions)
     ============================================ */
  const counters = document.querySelectorAll(".counter");
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            const counter = entry.target;
            const target = +counter.getAttribute("data-target");
            const duration = 2000;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            counter.dataset.counted = "true";

            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, stepTime);
              } else {
                counter.textContent = target;
              }
            };
            updateCounter();
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ============================================
     8. NAVBAR SHRINK ON SCROLL
     ============================================ */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  /* ============================================
     9. ACTIVE NAV LINK HIGHLIGHT
     ============================================ */
  const sections = document.querySelectorAll("section[id]");
  const navLinksAll = document.querySelectorAll(".nav-links a");

  if (sections.length > 0 && navLinksAll.length > 0) {
    window.addEventListener("scroll", () => {
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });

      navLinksAll.forEach((link) => {
        link.classList.remove("active-link");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active-link");
        }
      });
    });
  }

  /* ============================================
     10. CONSOLE EASTER EGG 😎
     ============================================ */
  console.log(
    "%c👋 Hey there!",
    "color: #6366f1; font-size: 24px; font-weight: bold;",
  );
  console.log(
    "%cLike my portfolio? Let's connect!",
    "color: #ec4899; font-size: 14px;",
  );
  console.log(
    "%c📧 your.email@example.com",
    "color: #94a3b8; font-size: 12px;",
  );
}); // End DOMContentLoaded
