// api/update-data.js
// Vercel Serverless Function to update data.json in GitHub

export default async function handler(req, res) {
  // Configurer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  const { action, password, data, projectId, updatedData } = req.body;

  // 🛡️ Vérification du mot de passe admin
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Accès refusé. Mot de passe incorrect.' });
  }

  // 🔑 Récupération du token GitHub
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const USERNAME = process.env.GITHUB_USERNAME || 'EN7DESIGN';
  const REPO = process.env.GITHUB_REPO || 'MonPortfolio';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'Configuration serveur manquante (GITHUB_TOKEN).' });
  }

  try {
    const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/data.json`;

    // 1. Lire le fichier data.json actuel
    const response = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    if (!response.ok) {
        throw new Error(`Erreur GitHub (Lecture) : ${response.statusText}`);
    }

    const fileData = await response.json();
    const contentUtf8 = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const currentContent = JSON.parse(contentUtf8);

    let message = '';

    // 2. Appliquer l'action demandée
    if (action === 'add') {
      message = `Ajout du projet : ${data.title}`;
      let newId = generateProjectId(data.title);

      let suffix = 1;
      const originalId = newId;
      while (currentContent.projects[newId]) {
        newId = `${originalId}-${suffix}`;
        suffix++;
      }

      currentContent.projects[newId] = {
        title: data.title,
        description: data.description,
        images: data.images,
        category: data.category,
        link: data.link || ""
      };

      if (!currentContent.categories[data.category].projects) {
        currentContent.categories[data.category].projects = [];
      }
      currentContent.categories[data.category].projects.push(newId);

    } else if (action === 'delete') {
      if (!currentContent.projects[projectId]) {
        throw new Error(`Le projet ${projectId} n'existe pas.`);
      }
      message = `Suppression du projet : ${projectId}`;
      delete currentContent.projects[projectId];

      Object.keys(currentContent.categories).forEach(catId => {
        const cat = currentContent.categories[catId];
        if (Array.isArray(cat.projects)) {
          cat.projects = cat.projects.filter(id => id !== projectId);
        }
      });

    } else if (action === 'update') {
      if (!currentContent.projects[projectId]) {
        throw new Error(`Le projet ${projectId} n'existe pas.`);
      }
      message = `Mise à jour du projet : ${projectId}`;
      currentContent.projects[projectId] = {
        ...currentContent.projects[projectId],
        ...updatedData
      };
    } else {
      throw new Error("Action non supportée.");
    }

    // 3. Ré-encoder et sauvegarder
    const updatedContentBase64 = Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64');

    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        content: updatedContentBase64,
        sha: fileData.sha
      })
    });

    if (!updateResponse.ok) {
        const errJson = await updateResponse.json();
        throw new Error(`Erreur GitHub (Ecriture) : ${errJson.message}`);
    }

    return res.status(200).json({ success: true, message });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

// Helpers ---------------------------------------------------------------------

function generateProjectId(title) {
  let id = title
    .replace(/<[^>]*>/g, " ") 
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/[\s_-]+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
  id = 'project-' + id;
  id = id.replace(/--+/g, '-');
  return id;
}
