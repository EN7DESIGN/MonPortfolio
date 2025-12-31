import { loadData } from './load-data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('cat');

  // Charger les données
  const data = await loadData();
  const { categories, projects } = data;

  if (!categoryId || !categories[categoryId]) {
    alert("Catégorie non trouvée");
    window.location.href = "index.html";
    return;
  }

  const category = categories[categoryId];

  // Mise à jour du header
  document.getElementById('category-title').innerHTML = category.title;
  document.getElementById('category-bg').style.backgroundImage = `url(./public/assets/images/${category.background})`;

  // Filtrer les projets de cette catégorie
  const categoryProjects = {};
  if (category.projects && Array.isArray(category.projects)) {
    category.projects.forEach(projectId => {
      if (projects[projectId]) {
        categoryProjects[projectId] = projects[projectId];
      }
    });
  }

  // Générer les cards
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = '';
  Object.entries(categoryProjects).forEach(([projectId, project]) => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <h3>${project.title}</h3>
      <img src="./public/assets/images/${project.images[0]}" alt="${project.title}" />
    `;
    projectCard.addEventListener('click', () => {
      window.location.href = `projet.html?project=${projectId}`;
    });
    projectsList.appendChild(projectCard);
  });

  // Cacher le loader
  document.getElementById('loader').classList.add('hidden');
});
