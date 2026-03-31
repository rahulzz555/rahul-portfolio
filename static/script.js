document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // ELEMENTS
  // =========================
  const body = document.body;

  const themeToggle = document.getElementById("themeToggle");
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const scrollProgress = document.getElementById("scrollProgress");
  
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById("submitBtn") || (contactForm ? contactForm.querySelector('button[type="submit"]') : null);

  const successPopup = document.getElementById("successPopup");
  const closeSuccess = document.getElementById("closeSuccess");

  const entriesList = document.getElementById("entriesList");

  const assistantBtn = document.getElementById("assistantBtn");
  const assistantPanel = document.getElementById("assistantPanel");
  const closeAssistant = document.getElementById("closeAssistant");
  const assistantInput = document.getElementById("assistantInput");
  const assistantSend = document.getElementById("assistantSend");
  const assistantBody = document.getElementById("assistantBody");

  const systemOverride = document.getElementById("systemOverride");
  const overrideFill = document.getElementById("overrideFill");
  const overridePercent = document.getElementById("overridePercent");

  const spotlight = document.getElementById("spotlight");
  const customCursor = document.getElementById("customCursor");
  const matrixCanvas = document.getElementById("matrixCanvas");

  // =========================
  // DARK MODE
  // =========================
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    });
  }

  // =========================
  // MOBILE MENU
  // =========================
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
      });
    });
  }

  // =========================
  // SCROLL PROGRESS
  // =========================
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateScrollProgress);
  updateScrollProgress();

  // =========================
  // SPOTLIGHT FOLLOW
  // =========================
  if (spotlight) {
    window.addEventListener("mousemove", (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });
  }

  // =========================
  // CUSTOM CURSOR
  // =========================
  if (customCursor) {
    window.addEventListener("mousemove", (e) => {
      customCursor.style.left = `${e.clientX}px`;
      customCursor.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll("a, button, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        customCursor.style.width = "26px";
        customCursor.style.height = "26px";
      });
      el.addEventListener("mouseleave", () => {
        customCursor.style.width = "16px";
        customCursor.style.height = "16px";
      });
    });
  }

  // =========================
  // SYSTEM OVERRIDE LOADER
  // =========================
  let progress = 0;
  if (systemOverride) {
      let interval = setInterval(() => {
          progress += Math.floor(Math.random() * 15) + 5; // Random jump
          
          if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              
              // Fade out the preloader when it hits 100%
              setTimeout(() => {
                  systemOverride.style.transition = "opacity 0.5s ease";
                  systemOverride.style.opacity = '0';
                  
                  setTimeout(() => {
                      systemOverride.style.display = 'none';
                  }, 500);
              }, 300);
          }
          
          if (overridePercent) overridePercent.innerText = progress + '%';
          if (overrideFill) overrideFill.style.width = progress + '%';
          
      }, 150);
  }

  // =========================
  // MATRIX CANVAS EFFECT
  // =========================
  function startMatrix() {
    if (!matrixCanvas) return;

    const ctx = matrixCanvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const letters = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    let columns = Math.floor(matrixCanvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function resetColumns() {
      columns = Math.floor(matrixCanvas.width / fontSize);
      drops = Array(columns).fill(1);
    }

    window.addEventListener("resize", resetColumns);

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = "#00ff88";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  startMatrix();

  // =========================
  // RENDER SINGLE ENTRY CARD
  // =========================
  function formatDate(dateString) {
    if (!dateString) return "Just now";
    const d = new Date(dateString.replace(" ", "T"));
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString();
  }

  function createEntryCard(entry) {
    const card = document.createElement("div");
    card.className = "entry-card";

    const safeName = entry.name || "Anonymous";
    const safeEmail = entry.email || "";
    const safeSubject = entry.subject && entry.subject.trim() ? entry.subject : "";
    const safeMessage = entry.message || "";
    const safeTime = formatDate(entry.created_at);

    card.innerHTML = `
      <div class="entry-top">
        <h4>${safeName}</h4>
        <span class="entry-time">${safeTime}</span>
      </div>
      <div class="entry-email">${safeEmail}</div>
      ${safeSubject ? `<div class="entry-email"><strong>Subject:</strong> ${safeSubject}</div>` : ""}
      <p class="entry-message">${safeMessage}</p>
    `;

    return card;
  }

  // =========================
  // LOAD EXISTING ENTRIES
  // =========================
  async function loadEntries() {
    if (!entriesList) return;

    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();

      entriesList.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        entriesList.innerHTML = `
          <div class="empty-entry">
            No messages yet. Your submitted message will appear here.
          </div>
        `;
        return;
      }

      data.forEach((entry) => {
        const card = createEntryCard(entry);
        entriesList.appendChild(card);
      });
    } catch (error) {
      console.error("Failed to load entries:", error);
      entriesList.innerHTML = `
        <div class="empty-entry">
          Unable to load messages right now.
        </div>
      `;
    }
  }

  loadEntries();

  // =========================
  // SUCCESS POPUP LOGIC
  // =========================
  function showSuccessPopup() {
    if (!successPopup) return;
    successPopup.classList.add("show");
  }

  function hideSuccessPopup() {
    if (!successPopup) return;
    successPopup.classList.remove("show");
  }

  if (closeSuccess) {
    closeSuccess.addEventListener("click", hideSuccessPopup);
  }

  if (successPopup) {
    successPopup.addEventListener("click", (e) => {
      if (e.target === successPopup) {
        hideSuccessPopup();
      }
    });
  }

  // =========================
  // CONTACT FORM SUBMIT
  // =========================
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Stop page reload

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        // 1. Get data from the form
        const formData = {
            name: contactForm.querySelector('[name="name"]')?.value,
            email: contactForm.querySelector('[name="email"]')?.value,
            subject: contactForm.querySelector('[name="subject"]')?.value,
            message: contactForm.querySelector('[name="message"]')?.value
        };

        // 2. Send JSON to Flask backend
        const res = await fetch("/submit", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        // 3. Check if Flask returned "status: success"
        if (data.status === "success") {
          // Reset form
          contactForm.reset();
          
          // Show success popup
          showSuccessPopup();

          // Reload the entries list to show the new message
          loadEntries();
        } else {
          alert(data.message || "Failed to send message.");
        }
      } catch (error) {
        console.error("Submit error:", error);
        alert("Something went wrong while sending the message.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message"; // Reset button text
        }
      }
    });
  }

  // =========================
  // ASSISTANT PANEL TOGGLE
  // =========================
  if (assistantBtn && assistantPanel) {
    assistantBtn.addEventListener("click", () => {
      assistantPanel.classList.toggle("open");
    });
  }

  if (closeAssistant && assistantPanel) {
    closeAssistant.addEventListener("click", () => {
      assistantPanel.classList.remove("open");
    });
  }

  // =========================
  // ASSISTANT CHAT
  // =========================
  function appendAssistantMessage(text, type = "bot") {
    if (!assistantBody) return;

    const msg = document.createElement("div");
    msg.className = `assistant-msg ${type}`;
    msg.textContent = text;
    assistantBody.appendChild(msg);
    assistantBody.scrollTop = assistantBody.scrollHeight;
  }

  async function sendAssistantMessage() {
    if (!assistantInput) return;

    const text = assistantInput.value.trim();
    if (!text) return;

    appendAssistantMessage(text, "user");
    assistantInput.value = "";

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      if (data.reply) {
        appendAssistantMessage(data.reply, "bot");
      } else {
        appendAssistantMessage("Sorry, something went wrong.", "bot");
      }
    } catch (error) {
      console.error("AI chat error:", error);
      appendAssistantMessage("Server error. Please try again later.", "bot");
    }
  }

  if (assistantSend) {
    assistantSend.addEventListener("click", sendAssistantMessage);
  }

  if (assistantInput) {
    assistantInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendAssistantMessage();
      }
    });
  }

  // =========================
  // SIMPLE REVEAL ANIMATION
  // =========================
  const revealEls = document.querySelectorAll(
    ".section, .project-card, .skill-card, .exp-card, .timeline-item, .contact-box, .widget-card"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    revealObserver.observe(el);
  });
});