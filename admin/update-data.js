// admin/update-data.js

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

// Helpers pour gérer l'encodage/décodage Base64 avec support UTF-8 (accents, etc.)
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binString = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  return btoa(binString);
}

function base64ToUtf8(str) {
  const binString = atob(str);
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Fonction pour mettre à jour data.json
export async function addProjectToData(newProjectData, token) {
  if (!token) throw new Error("Token GitHub manquant.");

  const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/data.json`;

  const response = await fetch(apiUrl, {
    headers: { Authorization: `token ${token}` }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
       throw new Error('Token GitHub invalide ou expiré.');
    }
    throw new Error('Erreur lors de la lecture de data.json');
  }

  const fileData = await response.json();
  const currentContent = JSON.parse(base64ToUtf8(fileData.content));

  let newId = generateProjectId(newProjectData.title);

  let suffix = 1;
  const originalId = newId;
  while (currentContent.projects[newId]) {
    newId = `${originalId}-${suffix}`;
    suffix++;
  }

  currentContent.projects[newId] = {
    title: newProjectData.title,
    description: newProjectData.description,
    images: newProjectData.images,
    category: newProjectData.category,
    link: newProjectData.link || ""
  };

  if (!currentContent.categories[newProjectData.category].projects) {
    currentContent.categories[newProjectData.category].projects = [];
  }
  currentContent.categories[newProjectData.category].projects.push(newId);

  const updatedContent = utf8ToBase64(JSON.stringify(currentContent, null, 2));

  const updateResponse = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Ajout du projet : ${newProjectData.title}`,
      content: updatedContent,
      sha: fileData.sha
    })
  });

  if (!updateResponse.ok) {
    throw new Error('Échec de la mise à jour de data.json');
  }

  return newId;
}

// Fonction pour supprimer un projet par son ID
export async function deleteProject(projectId, token) {
  if (!token) throw new Error("Token GitHub manquant.");

  const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/data.json`;

  const response = await fetch(apiUrl, {
    headers: { Authorization: `token ${token}` }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
       throw new Error('Token GitHub invalide ou expiré.');
    }
    throw new Error('Erreur lors de la lecture de data.json');
  }

  const fileData = await response.json();
  const currentContent = JSON.parse(base64ToUtf8(fileData.content));

  if (!currentContent.projects[projectId]) {
    throw new Error(`Le projet ${projectId} n'existe pas.`);
  }

  delete currentContent.projects[projectId];

  Object.keys(currentContent.categories).forEach(catId => {
    const cat = currentContent.categories[catId];
    if (Array.isArray(cat.projects)) {
      cat.projects = cat.projects.filter(id => id !== projectId);
    }
  });

  const updatedContent = utf8ToBase64(JSON.stringify(currentContent, null, 2));

  const updateResponse = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Suppression du projet : ${projectId}`,
      content: updatedContent,
      sha: fileData.sha
    })
  });

  if (!updateResponse.ok) {
    throw new Error('Échec de la mise à jour de data.json pour la suppression');
  }

  return projectId;
}

// Fonction pour mettre à jour un projet existant (ex: ajouter un lien)
export async function updateProject(projectId, updatedData, token) {
  if (!token) throw new Error("Token GitHub manquant.");

  const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/data.json`;

  // 1. Récupérer le fichier actuel
  const response = await fetch(apiUrl, {
    headers: { Authorization: `token ${token}` }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
       throw new Error('Token GitHub invalide ou expiré.');
    }
    throw new Error('Erreur lors de la lecture de data.json');
  }

  const fileData = await response.json();
  const currentContent = JSON.parse(base64ToUtf8(fileData.content));

  // 2. Vérifier que le projet existe
  if (!currentContent.projects[projectId]) {
    throw new Error(`Le projet ${projectId} n'existe pas.`);
  }

  // 3. Mettre à jour les données (fusionner avec l'existant)
  currentContent.projects[projectId] = {
    ...currentContent.projects[projectId],
    ...updatedData
  };

  // 4. Encoder le nouveau contenu en base64
  const updatedContent = utf8ToBase64(JSON.stringify(currentContent, null, 2));

  // 5. Envoyer la mise à jour
  const updateResponse = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Mise à jour du projet : ${projectId}`,
      content: updatedContent,
      sha: fileData.sha
    })
  });

  if (!updateResponse.ok) {
    throw new Error('Échec de la mise à jour de data.json');
  }

  return projectId;
}