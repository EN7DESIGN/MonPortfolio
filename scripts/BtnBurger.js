document.querySelectorAll('.BtnBurger').forEach(btn => {
    btn.addEventListener('click', e => {
        btn.classList.toggle('active');
        const menuMobile = document.querySelector('.Menu-Mobile');
        if (btn.classList.contains('active')) {
            menuMobile.style.left = '0';
        } else {
            menuMobile.style.left = '360%';
        }
    });
});

document.querySelectorAll('.Menu-Mobile .ListMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.Menu-Mobile').style.left = '360%';
        document.querySelectorAll('.BtnBurger').forEach(btn => btn.classList.remove('active'));
    });
});