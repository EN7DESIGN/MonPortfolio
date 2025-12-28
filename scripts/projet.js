document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project');

  if (!projectId || !portfolioData.projects[projectId]) {
    alert("Projet non trouvé");
    window.location.href = "index.html";
    return;
  }

  const project = portfolioData.projects[projectId];

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

  // Attendre que TOUTES les images du projet soient chargées + délai min
  await showLoaderUntilReady(project.images, 600, 5000);

  document.getElementById('loader').classList.add('hidden');
});