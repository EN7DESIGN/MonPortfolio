// admin/update-data.js

// 🔑 Remplace par ton vrai token GitHub (celui que tu as copié)
import { GITHUB_TOKEN } from './config.js';

// 🔧 Remplace par ton nom d'utilisateur et nom de repo
const USERNAME = 'EN7DESIGN';
const REPO = 'MonPortfolio';

// Fonction pour générer un ID de projet basé sur le titre
function generateProjectId(title) {
  // Convertir en minuscules et remplacer les espaces et caractères spéciaux par des tirets
  let id = title
    .replace(/<[^>]*>/g, " ") // Remplace les balises HTML (ex: <br>, <b>) par un espace
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux sauf les espaces et tirets
    .replace(/[\s_-]+/g, '-') // Remplacer les espaces et underscores multiples par un seul tiret
    .replace(/^-+|-+$/g, ''); // Supprimer les tirets au début et à la fin

  // S'assurer que l'ID commence par 'project-' pour rester cohérent avec le format existant
  id = 'project-' + id;

  // Remplacer les doubles tirets par un seul tiret
  id = id.replace(/--+/g, '-');

  return id;
}

// Fonction pour mettre à jour data.json
export async function addProjectToData(newProjectData) {
  const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/data.json`;

  // 1. Récupérer le fichier actuel
  const response = await fetch(apiUrl, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la lecture de data.json');
  }

  const fileData = await response.json();
  const currentContent = JSON.parse(atob(fileData.content));

  // 2. Générer un nouvel ID unique basé sur le titre du projet
  let newId = generateProjectId(newProjectData.title);

  // Vérifier si l'ID existe déjà et ajouter un suffixe si nécessaire
  let suffix = 1;
  const originalId = newId;
  while (currentContent.projects[newId]) {
    newId = `${originalId}-${suffix}`;
    suffix++;
  }

  // 3. Ajouter le projet
  currentContent.projects[newId] = {
    title: newProjectData.title,
    description: newProjectData.description,
    images: newProjectData.images,
    category: newProjectData.category
  };

  // 4. Ajouter l’ID à la catégorie
  if (!currentContent.categories[newProjectData.category].projects) {
    currentContent.categories[newProjectData.category].projects = [];
  }
  currentContent.categories[newProjectData.category].projects.push(newId);

  // 5. Encoder le nouveau contenu en base64
  const updatedContent = btoa(JSON.stringify(currentContent, null, 2));

  // 6. Envoyer la mise à jour
  const updateResponse = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Ajout du projet : ${newProjectData.title}`,
      content: updatedContent,
      sha: fileData.sha  // nécessaire pour mettre à jour
    })
  });

  if (!updateResponse.ok) {
    throw new Error('Échec de la mise à jour de data.json');
  }

  return newId;
}