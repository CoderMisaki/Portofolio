import { projects } from '../data/projects.js';

const projectList = document.getElementById('project-list');

const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
};

// Sentinel: HTML escaping function to prevent XSS
const escapeHTML = (str) => {
  if (str == null) return '';
  return String(str).replace(/[&<>'"]/g, tag => htmlEntities[tag]);
};

// Validate URL protocol to prevent javascript: XSS
const sanitizeURL = (url) => {
  const str = String(url).trim();
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
const cursorGlow = document.querySelector('.cursor-glow');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');
const emailLink = document.getElementById('email-link');
const linkedInLink = document.getElementById('linkedin-link');
const githubLink = document.getElementById('github-link');

projectList.innerHTML = projects
  .map(
    (project) => `
      <article class="project-card works-card">
        <div class="project-preview-wrap works-preview">
          <iframe
            class="project-preview"
            src="${escapeHTML(sanitizeURL(project.link))}"
            title="Preview ${escapeHTML(project.name)}"
            loading="lazy"
            referrerpolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
        <div class="works-content">
          <h3>${escapeHTML(project.name)}</h3>
          <span class="tag works-tag">${escapeHTML(project.type)}</span>
          <p>${escapeHTML(project.description)}</p>
          <a class="works-link" href="${escapeHTML(sanitizeURL(project.link))}" target="_blank" rel="noreferrer noopener" aria-label="View ${escapeHTML(project.name)}">
            <span class="icon-arrow">→</span>
          </a>
        </div>
      </article>
    `
  )
  .join('');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (window.matchMedia('(pointer: fine)').matches) {
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
}

if (emailLink) {
  const mailbox = ['echo', 'mfadillah.eu.cc'].join('@');
  emailLink.setAttribute('href', `mailto:${mailbox}`);
}

if (linkedInLink) {
  const profile = ['muhammad', 'fadilah', '7b6898243'].join('-');
  linkedInLink.setAttribute('href', `https://www.linkedin.com/in/${profile}`);
}

if (githubLink) {
  githubLink.setAttribute('href', 'https://github.com/CoderMisaki/');
}

export { sanitizeURL };
