
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------
     1) DARK MODE
     - อ่านค่าที่เคยเลือกไว้จาก localStorage
     - ถ้าไม่เคยเลือก ใช้ค่าตามการตั้งค่าระบบ (prefers-color-scheme)
     --------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const THEME_KEY = 'site-theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------------------------------------------
     2) BACK TO TOP
     - โผล่มาเมื่อ scroll ลงมาเกิน 400px
     - คลิกแล้วเลื่อนขึ้นบนสุดแบบ smooth
     --------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');

  function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------
     3) SCROLL PROGRESS BAR + เงา header เมื่อเลื่อน
     --------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress');
  const headerEl = document.querySelector('header');

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = percent + '%';
    if (headerEl) headerEl.classList.toggle('scrolled', scrollTop > 8);
  }

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  /* ---------------------------------------------
     4) TYPING EFFECT — พิมพ์ชื่อทีละตัวอักษรบน hero
     --------------------------------------------- */
  const typedEl = document.getElementById('typed-name');

  function typeText(el, text, speed = 90) {
    let i = 0;
    el.textContent = '';
    (function step() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(step, speed);
      } else {
        el.classList.add('done');
      }
    })();
  }

  if (typedEl) {
    const fullText = typedEl.getAttribute('data-full-text') || typedEl.textContent;
    typeText(typedEl, fullText);
  }

  /* ---------------------------------------------
     5) คลิกอีเมล/เบอร์โทรเพื่อคัดลอก
     --------------------------------------------- */
  const copyFields = document.querySelectorAll('.copy-field');

  copyFields.forEach(field => {
    field.addEventListener('click', async () => {
      const value = field.getAttribute('data-copy') || field.textContent.trim();
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        // เบราว์เซอร์เก่า/ไม่มีสิทธิ์ clipboard: ทำ fallback แบบ select ข้อความแทน
        const range = document.createRange();
        range.selectNodeContents(field);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }

      field.classList.add('copied');
      setTimeout(() => field.classList.remove('copied'), 1600);
    });
  });

  /* ---------------------------------------------
     6) SCROLL-REVEAL ANIMATION
     - ใส่ class "reveal" ให้ block หลักๆ ของหน้า
     - ใช้ IntersectionObserver เช็คว่าธาตุเลื่อนเข้ามาในจอหรือยัง
     --------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.about, .background .columns .col, footer .footer-col'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    // เบราว์เซอร์เก่าที่ไม่รองรับ ก็แสดงผลปกติ
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------------------------------------
     7) ไฮไลต์เมนูตาม section ที่กำลังดูอยู่
     --------------------------------------------- */
  const sections = document.querySelectorAll('main section[id], footer[id]');
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

});
