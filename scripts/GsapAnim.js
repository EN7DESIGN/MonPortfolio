// Split Text -------------------------
  // Fonction pour séparer les lettres d'un élément
  // Fonction mise à jour pour séparer les lettres de PLUSIEURS éléments
  function splitText(selector) {
      // Utiliser querySelectorAll pour trouver TOUS les éléments
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
          const text = element.textContent;
          const newHTML = text.split('').map(letter => {
              if (letter === ' ') {
                  // Important : conserver le caractère d'espace
                  return '<span class="letter">&nbsp;</span>';
              }
              return '<span class="letter">' + letter + '</span>';
          }).join('');
          
          element.innerHTML = newHTML;
      });
  }
  
  // 1. Appliquer le splitting à TOUS les éléments ciblés
  splitText('.SplitText'); 

  // 2. Sélectionner TOUS les conteneurs animés
  const animatedTitles = document.querySelectorAll('.SplitText');

  // 3. Boucler sur chaque titre/paragraphe pour créer son animation
  animatedTitles.forEach((title, index) => {
      // Sélectionner uniquement les lettres du titre ACTUEL
      const letters = title.querySelectorAll('.letter');

      gsap.from(letters, {
          y: 50,         
          opacity: 0,    
          duration: 0.5, 
          ease: "back.out(1.7)",
          stagger: 0.04, 
          delay: 0.5 
      });
  });
// ------------------------------------

// Split mot ----------------------
  // Fonction pour séparer les mots d'un élément
  function splitWords(selector) {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
          const text = element.textContent;
          
          // 1. On sépare par les espaces pour obtenir les mots
          const words = text.split(' '); 
          
          // 2. On crée un conteneur <span> pour chaque mot
          const newHTML = words.map(word => {
              // Important : chaque mot doit être dans un <span> avec une classe
              return '<span class="word">' + word + '</span>';
          }).join('<span class="space">&nbsp;</span>'); // 3. On remet les espaces entre les mots
          
          element.innerHTML = newHTML;
      });
  }
  // 1. Appliquer le splitting mot par mot
  splitWords('.intro-words'); 

  // 2. Cibler tous les mots générés
  const introWords = document.querySelectorAll('.intro-words .word');

  // 3. Créer l'animation mot par mot au chargement
  gsap.from(introWords, {
      // --- État Initial ---
      y: 20,         // Décaler légèrement vers le bas
      opacity: 0,    // Invisible
      duration: 0.5, // Durée de chaque mot
      ease: "power1.out",
      
      // --- Séquence mot par mot ---
      stagger: 0.1,  // Intervalle de 0.1 seconde entre le début de chaque mot
      
      // Délai pour que l'animation commence après votre titre lettre par lettre
      delay: 0.2 // Ajustez ce délai pour qu'il s'enchaîne bien avec le reste
  });
// --------------------------------


// L'animation pour le  P3 -----
  gsap.from(".P3", {
      // --- État Initial de l'animation ---
      
      // Décalage : commence à 100 pixels à gauche de sa position finale
      y: 100, 
      
      // Opacité : commence à invisible
      opacity: 0, 
      
      // Durée de l'animation en secondes
      duration: 0.8, 
      
      // Type d'amortissement pour le mouvement (rend le mouvement plus naturel)
      ease: "power2.out", 
      
      // Délai avant que l'animation ne commence (laisse le temps au navigateur de charger)
      delay: 0.6 
  });
// -----------------------------

// L'animation pour le  TitleBloc-2 -----
  gsap.from(".TitleBloc-2", {
      // --- État Initial de l'animation ---
      
      // Décalage : commence à 100 pixels à gauche de sa position finale
      x: 100, 
      
      // Opacité : commence à invisible
      opacity: 0, 
      
      // Durée de l'animation en secondes
      duration: 0.9, 
      
      // Type d'amortissement pour le mouvement (rend le mouvement plus naturel)
      ease: "power2.out", 
      
      // Délai avant que l'animation ne commence (laisse le temps au navigateur de charger)
      delay: 0.7 
  });
// --------------------------------------

// L'animation pour le bouton -----
  gsap.from("#slideBtn", {
      x: 100, 
      opacity: 0, 
      duration: 0.9, 
      ease: "power2.out", 
      delay: 0.8 
  });
// --------------------------------

// L'animation pour Tof ---------------
  gsap.from(".Tof", {
      // --- État Initial de l'animation ---
      
      // Décalage : commence à 100 pixels à gauche de sa position finale
      x: -100, 
      
      // Opacité : commence à invisible
      opacity: 0, 
      
      // Durée de l'animation en secondes
      duration: 1.5, 
      
      // Type d'amortissement pour le mouvement (rend le mouvement plus naturel)
      ease: "power2.out", 
      
      // Délai avant que l'animation ne commence (laisse le temps au navigateur de charger)
      delay: 0.5 
  });
// -------------------------------------

// Animation scroll illust --------------------------
gsap.registerPlugin(ScrollTrigger);

const revealElements = document.querySelectorAll('.scroll-reveal');

revealElements.forEach(element => {
  gsap.from(element, {
    opacity: 0,
    x: 100,
    duration: 0.8,
    
    // On utilise onComplete : une fonction qui se déclenche 
    // exactement quand l'animation est finie
    onComplete: () => {      
      // 2. IMPORTANT : On supprime l'attribut style pour rendre
      // la main totalement à ton fichier CSS
      element.removeAttribute('style');
    },

    scrollTrigger: {
      trigger: element,
      start: "top 50%",
      toggleActions: "play none none none",
    }
  });
});
// --------------------------------------------------