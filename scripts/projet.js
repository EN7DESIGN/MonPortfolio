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

  if (project.layout === 'visual-design' && project.groups) {
    // Rendu spécifique Visual Design
    renderVisualDesign(project, imagesContainer);
  } else {
    // Rendu classique
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
  }

  function renderVisualDesign(project, container) {
    const accordionContainer = document.createElement('div');
    accordionContainer.className = 'accordion-container';

    // Trier les années par ordre décroissant
    const years = Object.keys(project.groups).sort((a, b) => b - a);

    years.forEach((year, index) => {
      const yearDiv = document.createElement('div');
      yearDiv.className = `accordion-year ${index === 0 ? 'active' : ''}`; // Première année ouverte par défaut

      const yearTitle = document.createElement('div');
      yearTitle.className = 'accordion-year-title';
      yearTitle.innerHTML = `<span>${year}</span>`;
      yearTitle.onclick = () => yearDiv.classList.toggle('active');

      const yearContent = document.createElement('div');
      yearContent.className = 'accordion-year-content';

      // Trier les mois (on pourrait faire un tri chronologique plus précis, mais ici alphabétique ou manuel)
      const months = Object.keys(project.groups[year]);

      months.forEach((month, mIndex) => {
        const monthDiv = document.createElement('div');
        monthDiv.className = `accordion-month ${mIndex === 0 ? 'active' : ''}`;

        const monthTitle = document.createElement('div');
        monthTitle.className = 'accordion-month-title';
        monthTitle.innerHTML = `<span>${month}</span>`;
        monthTitle.onclick = () => monthDiv.classList.toggle('active');

        const monthContent = document.createElement('div');
        monthContent.className = 'accordion-month-content';

        const pinterestGrid = document.createElement('div');
        pinterestGrid.className = 'pinterest-grid';

        const medias = project.groups[year][month];
        medias.forEach(src => {
          const gridItem = document.createElement('div');
          gridItem.className = 'grid-item';

          const isVideo = src.match(/\.(mp4|webm|ogg|mov)$|^data:video/i);
          if (isVideo) {
            const video = document.createElement('video');
            video.src = getImageUrl(src);
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true; // Auto-play muted as requested/implied for visual wow
            gridItem.appendChild(video);
          } else {
            const img = document.createElement('img');
            img.src = getImageUrl(src);
            img.loading = 'lazy';
            img.alt = `${year} - ${month}`;
            gridItem.appendChild(img);
          }
          pinterestGrid.appendChild(gridItem);
        });

        monthContent.appendChild(pinterestGrid);
        monthDiv.appendChild(monthTitle);
        monthDiv.appendChild(monthContent);
        yearContent.appendChild(monthDiv);
      });

      yearDiv.appendChild(yearTitle);
      yearDiv.appendChild(yearContent);
      accordionContainer.appendChild(yearDiv);
    });

    container.appendChild(accordionContainer);
  }

  // Affichage du bouton lien si présent
  if (project.link) {
    const linkContainer = document.getElementById('project-link-container');
    const linkBtn = document.createElement('a');
    linkBtn.href = project.link;
    linkBtn.target = '_blank';
    linkBtn.className = 'Project-BtnLink Button01 Primary Medium';
    linkBtn.textContent = 'Voir le projet en ligne';
    linkContainer.appendChild(linkBtn);
  }
});