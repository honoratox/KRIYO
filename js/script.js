/* =========================
   FUNÇÃO DE INICIALIZAÇÃO DO MENU HAMBÚRGUER
========================= */
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-center');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');

  if (hamburgerBtn && navMenu) {
    // Evita múltiplos listeners caso a função seja chamada mais de uma vez
    hamburgerBtn.onclick = null;
    
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Fecha o menu ao clicar em qualquer link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }
}

/* =========================
   IMPORTAR HEADER
========================= */
const headerContainer = document.querySelector('[data-header]');
if (headerContainer) {
  fetch('components/header.html')
    .then(res => res.text())
    .then(html => {
      headerContainer.innerHTML = html;
      // Inicializa os eventos do menu assim que o HTML for injetado
      initHamburgerMenu();
    })
    .catch(err => console.error('Erro ao carregar header:', err));
} else {
  // Caso o header não seja dinâmico e já esteja presente no HTML
  document.addEventListener('DOMContentLoaded', initHamburgerMenu);
}

const canvas = document.getElementById('mask');
const ctx = canvas ? canvas.getContext('2d') : null;
const hero = document.querySelector('.hero');
const cursor = document.querySelector('.custom-cursor');

let dpr = window.devicePixelRatio || 1;

/* =========================
   BARRA DE PROGRESSO NO SCROLL
========================= */
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('progressBar') || document.getElementById('progress-bar');
  if (!progressBar) return;

  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;

  progressBar.style.width = scrolled + '%';
});

/* =========================
   RESIZE (limitado à hero)
========================= */
function resize() {
  if (!hero || !canvas || !ctx) return;
  const rect = hero.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, rect.width, rect.height);
}

resize();
window.addEventListener('resize', resize);

/* =========================
   REVEAL SOMENTE NA HERO
========================= */
if (hero && canvas && ctx) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const radius = 120;

    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, radius
    );

    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0.6)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  hero.addEventListener('mouseleave', () => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
}

/* =========================
   CURSOR PERSONALIZADO
========================= */
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

/* =========================
   FADE SUAVE (SÓ NA HERO)
========================= */
function fade() {
  if (canvas && ctx) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,0.035)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(fade);
}

fade();

/* =========================
   INTERAÇÃO DO CURSOR (clique/hover)
========================= */
function setupCursorInteractions() {
  if (!cursor) return;
  const interactiveElements = document.querySelectorAll('.project-item, .project-card-small, .brand-card, .testimonial-card');

  interactiveElements.forEach(item => {
    item.addEventListener('mouseenter', () => {
      cursor.style.width = '45px';
      cursor.style.height = '45px';
      cursor.style.border = '1px solid rgba(255, 255, 255, 1)';
      cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    });

    item.addEventListener('mouseleave', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.border = '2px solid rgba(169, 169, 169, 0.6)';
      cursor.style.backgroundColor = 'transparent';
    });
  });
}

setupCursorInteractions();

/* =========================
   IMPORTAR FOOTER
========================= */
const footerContainer = document.querySelector('[data-footer]');
if (footerContainer) {
  fetch('components/footer.html')
    .then(res => res.text())
    .then(html => {
      footerContainer.innerHTML = html;
    })
    .catch(err => console.error('Erro ao carregar o footer:', err));
}