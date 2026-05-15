import { projects } from '../data/projects.js';

const projectList = document.getElementById('project-list');
const cursorGlow = document.querySelector('.cursor-glow');

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

if (window.matchMedia('(pointer: fine)').matches) {
  let rafId = null;
  let pointerX = 0;
  let pointerY = 0;

  const updateGlow = () => {
    cursorGlow.style.left = `${pointerX}px`;
    cursorGlow.style.top = `${pointerY}px`;
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
