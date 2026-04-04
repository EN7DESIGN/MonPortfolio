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
        img.style.cursor = 'zoom-in';
        img.onclick = () => openLightbox(img.src, false);
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
  
        // Tri chronologique des mois (décroissant)
        const monthOrder = {
          'Janvier': 1, 'Février': 2, 'Mars': 3, 'Avril': 4, 'Mai': 5, 'Juin': 6,
          'Juillet': 7, 'Août': 8, 'Septembre': 9, 'Octobre': 10, 'Novembre': 11, 'Décembre': 12
        };
        
        const months = Object.keys(project.groups[year]).sort((a, b) => {
          return (monthOrder[b] || 0) - (monthOrder[a] || 0);
        });
  
        months.forEach((month, mIndex) => {
          const monthDiv = document.createElement('div');
          // On ouvre le premier mois (le plus récent) uniquement si c'est la première année (la plus récente)
          const isMonthActive = (index === 0 && mIndex === 0);
          monthDiv.className = `accordion-month ${isMonthActive ? 'active' : ''}`;
  
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
            gridItem.style.cursor = 'zoom-in';
  
            const isVideo = src.match(/\.(mp4|webm|ogg|mov)$|^data:video/i);
            if (isVideo) {
              const video = document.createElement('video');
              video.src = getImageUrl(src);
              video.muted = true;
              video.loop = true;
              video.playsInline = true;
              video.autoplay = true; // Auto-play muted as requested/implied for visual wow
              gridItem.appendChild(video);
              gridItem.onclick = () => openLightbox(video.src, true);
            } else {
              const img = document.createElement('img');
              img.src = getImageUrl(src);
              img.loading = 'lazy';
              img.alt = `${year} - ${month}`;
              gridItem.appendChild(img);
              gridItem.onclick = () => openLightbox(img.src, false);
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
  
    // --- Système de Lightbox ---
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <div class="lightbox-content"></div>
    `;
    document.body.appendChild(lightbox);
  
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
  
    function openLightbox(src, isVideo) {
      lightboxContent.innerHTML = '';
      if (isVideo) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        lightboxContent.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        lightboxContent.appendChild(img);
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Empêcher le scroll
    }
  
    function closeLightbox() {
      lightbox.classList.remove('active');
      lightboxContent.innerHTML = ''; // Arrêter la vidéo si présente
      document.body.style.overflow = '';
    }
  
    lightbox.onclick = (e) => {
      if (e.target === lightbox || e.target === lightboxClose) {
        closeLightbox();
      }
    };
  
    // --- Fin Lightbox ---
  
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