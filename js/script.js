/* =========================
   IMPORTAR HEADER
========================= */
fetch('components/header.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('[data-header]').innerHTML = html;
  });


const canvas = document.getElementById('mask');
const ctx = canvas.getContext('2d');
const hero = document.querySelector('.hero');
const cursor = document.querySelector('.custom-cursor');

let dpr = window.devicePixelRatio || 1;

/* =========================
   RESIZE (limitado à hero)
========================= */
function resize() {
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

/* =========================
   LIMPA AO SAIR DA HERO
========================= */
hero.addEventListener('mouseleave', () => {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

/* =========================
   CURSOR PERSONALIZADO
========================= */
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});


/* =========================
   FADE SUAVE (SÓ NA HERO)
========================= */
function fade() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,0.035)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(fade);
}

fade();

/* =========================
    INTERAÇÃO DO CURSOR (clique)
========================= */

// Função para gerenciar o estado do cursor ao passar sobre elementos interativos
function setupCursorInteractions() {
  // Selecionamos os 2 principais e os cards menores
  const interactiveElements = document.querySelectorAll('.project-item, .project-card-small');

  interactiveElements.forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Expande o cursor e suaviza a borda
      cursor.style.width = '45px';
      cursor.style.height = '45px';
      cursor.style.border = '1px solid rgba(255, 255, 255, 1)';
      cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    });

    item.addEventListener('mouseleave', () => {
      // Retorna ao estado original definido no seu CSS
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.border = '2px solid rgba(169, 169, 169, 0.6)';
      cursor.style.backgroundColor = 'transparent';
    });
  });
}

// Inicia a escuta de eventos
setupCursorInteractions();

/* =========================
   IMPORTAR FOOTER
========================= */
fetch('components/footer.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('[data-footer]').innerHTML = html;
  })
  .catch(err => console.error('Erro ao carregar o footer:', err));