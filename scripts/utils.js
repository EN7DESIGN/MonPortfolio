// utils.js

/**
 * Affiche un loader pendant un temps minimum, 
 * mais pas plus qu’un timeout max, 
 * et seulement après que les ressources soient chargées.
 * 
 * @param {string[]} imageSources - Tableau d’URLs d’images à précharger
 * @param {number} minDuration - Délai minimum en ms (ex: 600)
 * @param {number} maxTimeout - Timeout de sécurité en ms (ex: 5000)
 * @returns {Promise}
 */
function showLoaderUntilReady(imageSources = [], minDuration = 600, maxTimeout = 5000) {
  // 1. Précharger les images (avec gestion d'erreur)
  const preloadPromises = imageSources.map(src => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve; // même en erreur, on continue (pas de blocage)
      img.src = src;
    });
  });

  const preloadDone = Promise.all(preloadPromises);

  // 2. Délai minimum garanti
  const minDelay = new Promise(resolve => setTimeout(resolve, minDuration));

  // 3. Timeout de sécurité
  const safetyTimeout = new Promise(resolve => setTimeout(resolve, maxTimeout));

  // On attend soit le préchargement + délai min, soit le timeout
  return Promise.race([
    Promise.all([preloadDone, minDelay]),
    safetyTimeout
  ]);
}