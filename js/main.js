import { projects } from '../data/projects.js';

const projectList = document.getElementById('project-list');
const cursorGlow = document.querySelector('.cursor-glow');

projectList.innerHTML = projects
  .map(
    (project) => `
      <article class="project-card">
        <span class="tag">${project.type}</span>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank" rel="noreferrer noopener">Kunjungi Project ↗</a>
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

window.addEventListener('pointermove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});
