document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.Card');

  cards.forEach(card => {
    card.addEventListener('click', function() {
      const card = this;
      
      // 1. Ajouter la classe 'is-clicked' pour réduire le scale
      card.classList.add('is-clicked');

      // 2. Supprimer la classe après un court délai
      setTimeout(() => {
        card.classList.remove('is-clicked');
      }, 300); // 300ms correspond à la durée de votre transition pour un effet fluide.
    });
  });
});