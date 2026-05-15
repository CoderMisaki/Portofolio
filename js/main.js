import { projects } from '../data/projects.js';

const projectList = document.getElementById('project-list');
const cursorGlow = document.querySelector('.cursor-glow');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');
const emailLink = document.getElementById('email-link');
const linkedInLink = document.getElementById('linkedin-link');

projectList.innerHTML = projects
  .map(
    (project) => `
      <article class="project-card">
        <div class="project-preview-wrap">
          <iframe
            class="project-preview"
            src="${project.link}"
            title="Preview ${project.name}"
            loading="lazy"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
        <span class="tag">${project.type}</span>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank" rel="noreferrer noopener">Buka Full Project ↗</a>
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
    // ⚡ Bolt Performance Optimization:
    // Using transform: translate3d instead of top/left to use GPU acceleration
    // and avoid layout thrashing on every frame
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
