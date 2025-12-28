document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('cat');

  if (!categoryId || !portfolioData.categories[categoryId]) {
    alert("Catégorie non trouvée");
    window.location.href = "index.html";
    return;
  }

  const category = portfolioData.categories[categoryId];

  // 1. Mise à jour du header
  document.getElementById('category-title').innerHTML = category.title;
  document.getElementById('category-bg').style.backgroundImage = `url(${category.background})`;

  // 2. Générer la liste des projets + collecter les miniatures
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = '';
  const previewImages = [];

  category.projects.forEach(projectId => {
    const project = portfolioData.projects[projectId];
    if (!project) return;

    previewImages.push(project.images[0]); // on preload la 1ère image de chaque projet

    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <h3>${project.title}</h3>
      <img src="${project.images[0]}" alt="${project.title}" />
    `;
    projectCard.addEventListener('click', () => {
      window.location.href = `projet.html?project=${projectId}`;
    });
    projectsList.appendChild(projectCard);
  });

  // 3. Attendre le chargement + délai minimum
  await showLoaderUntilReady(previewImages, 600, 5000);

  // 4. Cacher le loader
  document.getElementById('loader').classList.add('hidden');
});