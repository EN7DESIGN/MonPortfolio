// scripts/load-data.js

// Fonction pour charger data.json
export async function loadData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement de data.json');
    }
    return await response.json();
  } catch (error) {
    console.error('⚠️ Impossible de charger data.json :', error);
    // En cas d’erreur, on peut retourner des données vides ou un fallback
    return { categories: {}, projects: {} };
  }
}

// Fonction utilitaire pour obtenir l'URL d'une image
export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) {
    return path;
  }
  return `./public/assets/images/${path}`;
}