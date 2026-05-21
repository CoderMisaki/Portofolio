import { projects } from '../data/projects.js';

const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
};

const safeText = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeHTML = (str) => {
  if (str == null) return '';
  return String(str).replace(/[&<>'"]/g, (tag) => htmlEntities[tag]);
};

const sanitizeURL = (url) => {
  const str = String(url ?? '').trim();
  const normalized = str.toLowerCase().replace(/[\x00-\x20]/g, '');

  let decoded = normalized;
  try {
    decoded = decodeURIComponent(normalized);
  } catch (_) {
    decoded = normalized;
  }

  if (decoded.startsWith('javascript:') || decoded.startsWith('data:')) {
    return 'about:blank';
  }

  try {
    const parsed = new URL(str, window.location.origin);
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return 'about:blank';
    }
  } catch (_) {
    if (normalized.startsWith('javascript:') || normalized.startsWith('data:')) {
      return 'about:blank';
    }
  }

  return str;
};

const renderProjects = (projectItems) => {
  const projectList = document.getElementById('project-list');
  if (!projectList) return;

  if (!Array.isArray(projectItems) || projectItems.length === 0) {
    projectList.innerHTML = '<p class="empty-state">Projects are being prepared.</p>';
    return;
  }

  projectList.innerHTML = projectItems
    .map((project) => {
      const name = safeText(project?.name) || 'Untitled Project';
      const description = safeText(project?.description) || 'Project description is being prepared.';
      const type = safeText(project?.type) || 'Web Project';
      const link = sanitizeURL(project?.link || 'about:blank');
      const hasPreview = link !== 'about:blank';

      return `
      <article class="project-card works-card">
        <div class="project-preview-wrap works-preview">
          ${
            // Menjaga isolasi proses agar halaman portfolio utama tidak ikut melambat.
            hasPreview
              ? `<iframe
                  class="project-preview"
                  src="${escapeHTML(link)}"
                  title="Preview of ${escapeHTML(name)}"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin"
                ></iframe>`
              : `<div class="project-preview-fallback">Preview is not available yet.</div>`
          }
        </div>
        <div class="works-content">
          <h3>${escapeHTML(name)}</h3>
          <span class="tag works-tag">${escapeHTML(type)}</span>
          <p>${escapeHTML(description)}</p>
          <a class="works-link" href="${escapeHTML(link)}" target="_blank" rel="noreferrer noopener nofollow" aria-label="View ${escapeHTML(name)}">
            <span class="icon-arrow">→</span>
          </a>
        </div>
      </article>
    `;
    })
    .join('');
};

const setupMenu = () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    });
  });
};

const setupCursorGlow = () => {
  const cursorGlow = document.querySelector('.cursor-glow');
  if (!cursorGlow || !window.matchMedia('(pointer: fine)').matches) return;

  let rafId = null;
  let pointerX = 0;
  let pointerY = 0;

  const updateGlow = () => {
    cursorGlow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    rafId = null;
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!rafId) {
      rafId = window.requestAnimationFrame(updateGlow);
    }
  });
};

const setupContactLinks = () => {
  const emailLink = document.getElementById('email-link');
  const linkedInLink = document.getElementById('linkedin-link');
  const githubLink = document.getElementById('github-link');

  if (emailLink) emailLink.setAttribute('href', 'mailto:echo@mfadillah.eu.cc');
  if (linkedInLink) linkedInLink.setAttribute('href', 'https://www.linkedin.com/in/muhammad-fadilah-7b6898243');
  if (githubLink) githubLink.setAttribute('href', 'https://github.com/CoderMisaki/');
};

const setupRevealObserver = () => {
  const sections = document.querySelectorAll('.reveal');
  if (!sections.length || typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    },
    { threshold: 0.14 }
  );

  sections.forEach((section) => observer.observe(section));
};

const isBrowser = typeof window !== 'undefined' && typeof location !== 'undefined';
const isDev = isBrowser && (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
if (isBrowser) {
  window.addEventListener('error', (event) => {
    if (isDev) console.warn('Runtime error:', event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    if (isDev) console.warn('Unhandled promise rejection:', event.reason);
  });

  renderProjects(projects);
  setupMenu();
  setupCursorGlow();
  setupContactLinks();
  setupRevealObserver();
}

export { sanitizeURL };
