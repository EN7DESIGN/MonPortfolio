// data.js
const portfolioData = {
  categories: {
    "brand-identity": {
      title: "Brand<br>identity",
      background: "public/assets/images/Texture-Brand.png",
      projects: ["project1", "project2"]
    },
    "ui-ux-design": {
      title: "UI/UX<br>design",
      background: "public/assets/images/Texture-UIUX.png",
      projects: ["project3", "project4"]
    },
    "visual-design": {
      title: "Visual<br>design",
      background: "public/assets/images/Texture-Visual.png",
      projects: ["project5"]
    },
    "graphic-design": {
      title: "Graphic<br>design",
      background: "public/assets/images/Texture-Graphic.png",
      projects: ["project6", "project7"]
    }
  },

//   les projets ------------------------------------
  projects: {
    project1: {
      title: "Logo pour Startup X",
      images: ["public/assets/images/illust-01.png", "public/assets/images/illust-06.png"],
      description: "Création d’une identité visuelle complète..."
    },
    project2: {
      title: "Rebranding Agence Y",
      images: ["public/assets/images/illust-06.png"],
      description: "Refonte complète de l’identité..."
    },
    project3: {
      title: "Application mobile Z",
      images: ["public/assets/images/illust-06.png", "public/assets/images/illust-06.png", "public/assets/images/illust-06.png"],
      description: "Conception d’une interface utilisateur intuitive..."
    }
    // ... ajoute tous tes projets ici
  }
};