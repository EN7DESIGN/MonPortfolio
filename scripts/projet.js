import { loadData } from './load-data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project');

  const data = await loadData();
  const project = data.projects[projectId];

  if (!projectId || !project) {
    alert("Projet non trouvé");
    window.location.href = "index.html";
    return;
  }

  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-description').textContent = project.description;

  const imagesContainer = document.getElementById('project-images');
  imagesContainer.innerHTML = '';
  project.images.forEach(imgSrc => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = project.title;
    imagesContainer.appendChild(img);
  });

  // Cacher le loader
  document.getElementById('loader').classList.add('hidden');
});