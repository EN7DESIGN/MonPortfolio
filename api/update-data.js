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
      let targetId = generateProjectId(data.title);

      // Pour visual-design, on essaie de fusionner si le projet existe déjà avec le même titre
      const isVisualDesign = data.category === 'visual-design';
      
      if (isVisualDesign && currentContent.projects[targetId]) {
          // Fusionner dans le projet existant
          const project = currentContent.projects[targetId];
          if (!project.groups) project.groups = {};
          if (!project.groups[data.year]) project.groups[data.year] = {};
          
          // On concatène les nouvelles images/vidéos au mois spécifié
          if (!project.groups[data.year][data.month]) {
            project.groups[data.year][data.month] = [];
          }
          project.groups[data.year][data.month] = [...project.groups[data.year][data.month], ...data.images];
          
          // Mise à jour de la miniature si fournie (optionnel)
          if (data.thumbnail) {
            project.thumbnail = data.thumbnail;
          }
          message = `Mise à jour (Visual Design) : ${data.title} > ${data.year} > ${data.month}`;
      } else {
          // Création classique ou nouveau projet Visual Design
          let newId = targetId;
          if (!isVisualDesign) {
            let suffix = 1;
            while (currentContent.projects[newId]) {
              newId = `${targetId}-${suffix}`;
              suffix++;
            }
          }

          if (isVisualDesign) {
            currentContent.projects[newId] = {
              title: data.title,
              description: data.description,
              category: data.category,
              layout: "visual-design",
              thumbnail: data.thumbnail || data.images[0], // Utilise la première image si pas de thumbnail
              groups: {
                [data.year]: {
                  [data.month]: data.images
                }
              }
            };
          } else {
            currentContent.projects[newId] = {
              title: data.title,
              description: data.description,
              images: data.images,
              category: data.category,
              link: data.link || ""
            };
          }

          if (!currentContent.categories[data.category].projects) {
            currentContent.categories[data.category].projects = [];
          }
          if (!currentContent.categories[data.category].projects.includes(newId)) {
            currentContent.categories[data.category].projects.push(newId);
          }
      }

    } else if (action === 'delete') {
      const { year, month } = req.body; // Récupérer year et month pour suppression partielle
      
      if (!currentContent.projects[projectId]) {
        throw new Error(`Le projet ${projectId} n'existe pas.`);
      }

      const project = currentContent.projects[projectId];

      if (year && month && project.groups && project.groups[year]) {
        message = `Suppression du mois ${month} (${year}) dans ${projectId}`;
        delete project.groups[year][month];
        // Si l'année est vide, on la supprime aussi
        if (Object.keys(project.groups[year]).length === 0) {
          delete project.groups[year];
        }
      } else if (year && project.groups && project.groups[year]) {
        message = `Suppression de l'année ${year} dans ${projectId}`;
        delete project.groups[year];
      } else {
        // Suppression complète du projet
        message = `Suppression complète du projet : ${projectId}`;
        delete currentContent.projects[projectId];

        Object.keys(currentContent.categories).forEach(catId => {
          const cat = currentContent.categories[catId];
          if (Array.isArray(cat.projects)) {
            cat.projects = cat.projects.filter(id => id !== projectId);
          }
        });
      }

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
