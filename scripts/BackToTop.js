document.addEventListener("DOMContentLoaded", () => {
    // Création du bouton
    const btn = document.createElement("button");
    btn.className = "BtnBackToTop";
    btn.setAttribute("aria-label", "Retour en haut");
    btn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
    `;
    
    // Ajout au corps de la page
    document.body.appendChild(btn);

    // Gestion du scroll
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    };

    // Gestion du clic
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    window.addEventListener("scroll", toggleVisibility);
    btn.addEventListener("click", scrollToTop);
});
