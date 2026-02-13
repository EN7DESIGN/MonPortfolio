import { loadData, getImageUrl } from './load-data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project');

  const data = await loadData();
  const project = data.projects[projectId];

  if (!projectId || !project) {
    alert("Projet non trouvé");
    window.location.href = "./index.html";
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
    img.src = getImageUrl(imgSrc);
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = project.title;
    imagesContainer.appendChild(img);
  });

  // Affichage du bouton lien si présent
  if (project.link) {
    const linkContainer = document.getElementById('project-link-container');
    const linkBtn = document.createElement('a');
    linkBtn.href = project.link;
    linkBtn.target = '_blank';
    linkBtn.className = 'Project-BtnLink';
    linkBtn.textContent = 'Voir le projet en ligne';
    linkContainer.appendChild(linkBtn);
  }
});