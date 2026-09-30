(() => {
  "use strict";

  const slides = [...document.querySelectorAll(".slide")];
  const dots = document.getElementById("dots");
  const counter = document.getElementById("counter");
  const progress = document.getElementById("progress");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let current = 0;
  let animating = false;

  // =========================================================
  // SFX SYSTEM
  // برای اضافه کردن صداها در آینده:
  //
  // SFX.files.whoosh = new Audio("assets/whoosh.mp3");
  // SFX.files.pop    = new Audio("assets/pop.mp3");
  // SFX.files.error  = new Audio("assets/error.mp3");
  // SFX.files.hit    = new Audio("assets/cinematic-hit.mp3");
  // =========================================================

  const SFX = {
    enabled: true,

    files: {
      whoosh: null,
      pop: null,
      error: null,
      hit: null
    },

    play(name) {
      if (!this.enabled || !this.files[name]) return;

      try {
        this.files[name].currentTime = 0;
        this.files[name].play().catch(() => {});
      } catch (_) {}
    }
  };

  // دسترسی از بیرون برای اضافه کردن فایل‌های صوتی
  window.SciencePresentationSFX = SFX;


  // =========================================================
  // ساخت Dot Navigation
  // =========================================================

  slides.forEach((_, i) => {

    const button = document.createElement("button");

    button.className =
      "dot-nav" + (i === 0 ? " active" : "");

    button.title = `اسلاید ${i + 1}`;

    button.setAttribute(
      "aria-label",
      `رفتن به اسلاید ${i + 1}`
    );

    button.addEventListener("click", () => {
      goTo(i);
    });

    dots.appendChild(button);
  });


  // =========================================================
  // به‌روزرسانی UI
  // =========================================================

  function updateUI() {

    counter.textContent =
      `${current + 1} / ${slides.length}`;

    progress.style.width =
      `${((current + 1) / slides.length) * 100}%`;

    [...dots.children].forEach((dot, i) => {

      dot.classList.toggle(
        "active",
        i === current
      );

    });
  }


  // =========================================================
  // تغییر اسلاید
  // =========================================================

  function goTo(index, direction = null) {

    if (
      animating ||
      index === current ||
      index < 0 ||
      index >= slides.length
    ) {
      return;
    }

    animating = true;

    const oldIndex = current;

    current = index;

    const oldSlide = slides[oldIndex];
    const newSlide = slides[current];


    // تشخیص جهت حرکت
    if (direction === null) {

      direction =
        current > oldIndex ? 1 : -1;

    }


    // خروج اسلاید قبلی
    oldSlide.classList.remove("active");

    oldSlide.classList.add(
      direction > 0
        ? "exit-left"
        : "exit-right"
    );


    // ورود اسلاید جدید
    newSlide.classList.remove(
      "exit-left",
      "exit-right"
    );

    newSlide.classList.add("active");


    // صدای تغییر اسلاید
    SFX.play("whoosh");


    // صدای مخصوص اسلاید خطا
    if (current === 8) {
      SFX.play("error");
    }


    // صدای مخصوص جمع‌بندی
    if (current === 9) {
      SFX.play("hit");
    }


    updateUI();


    // پایان Transition
    window.setTimeout(() => {

      oldSlide.classList.remove(
        "exit-left",
        "exit-right"
      );

      animating = false;

    }, 780);
  }


  // =========================================================
  // Next / Previous
  // =========================================================

  function next() {

    goTo(
      (current + 1) % slides.length,
      1
    );

  }


  function prev() {

    goTo(
      (current - 1 + slides.length) %
      slides.length,
      -1
    );

  }


  // =========================================================
  // دکمه‌های کنترل
  // =========================================================

  nextBtn.addEventListener(
    "click",
    next
  );

  prevBtn.addEventListener(
    "click",
    prev
  );


  // =========================================================
  // کنترل با کیبورد
  // =========================================================

  window.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "ArrowRight") {
        next();
      }

      if (event.key === "ArrowLeft") {
        prev();
      }

      // رفتن به اولین اسلاید
      if (event.key === "Home") {
        goTo(0);
      }

      // رفتن به آخرین اسلاید
      if (event.key === "End") {
        goTo(slides.length - 1);
      }

    }
  );


  // =========================================================
  // Swipe برای موبایل
  // =========================================================

  let touchStartX = null;


  document.addEventListener(
    "touchstart",
    (event) => {

      touchStartX =
        event.changedTouches[0].clientX;

    },
    { passive: true }
  );


  document.addEventListener(
    "touchend",
    (event) => {

      if (touchStartX === null) {
        return;
      }

      const touchEndX =
        event.changedTouches[0].clientX;

      const deltaX =
        touchEndX - touchStartX;


      // حداقل فاصله لازم برای Swipe
      if (Math.abs(deltaX) > 55) {

        if (deltaX < 0) {
          next();
        } else {
          prev();
        }

      }

      touchStartX = null;

    },
    { passive: true }
  );


  // =========================================================
  // تایمر کوچک اسلاید ۷
  // =========================================================

  const timerMs =
    document.getElementById("timerMs");

  let tick = 12;


  setInterval(() => {

    tick = (tick + 1) % 100;

    if (timerMs) {

      timerMs.textContent =
        String(tick).padStart(2, "0");

    }

  }, 100);


  // =========================================================
  // SFX برای کارت‌های مهم
  // =========================================================

  document
    .querySelectorAll(
      ".tool-card, .summary-grid div, .example-box"
    )
    .forEach(card => {

      card.addEventListener(
        "mouseenter",
        () => {

          SFX.play("pop");

        }
      );

    });


  // =========================================================
  // مقداردهی اولیه
  // =========================================================

  updateUI();

})();