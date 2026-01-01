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

  document.getElementById('project-title').innerHTML = project.title;
  document.getElementById('project-description').innerHTML = project.description;

  const imagesContainer = document.getElementById('project-images');
  imagesContainer.innerHTML = '';
  const imagesToDisplay = (project.images && project.images.length > 1) 
    ? project.images.slice(1) 
    : (project.images || []);

  imagesToDisplay.forEach(imgSrc => {
    const img = document.createElement('img');
    img.src = `./public/assets/images/${imgSrc}`;
    img.alt = project.title;
    imagesContainer.appendChild(img);
  });

  // Cacher le loader
  document.getElementById('loader').classList.add('hidden');
});