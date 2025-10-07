document.addEventListener('DOMContentLoaded', function() {
    // Mainīgie
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const themeToggle = document.getElementById('theme-toggle');
    const mainContent = document.getElementById('main-content');
    const dropdownContent = document.getElementById('dropdown-content');
    const mainLink = document.getElementById('main-link');
    const mainLogo = document.getElementById('main-logo');
    
    // Sākotnējais iestatījums - rādām galveno saturu
    showMainContent();
    
    // Funkcija, lai parādītu galveno saturu
    function showMainContent() {
        mainContent.style.display = 'block';
        dropdownContent.style.display = 'none';
        
        // Paslēpjam visas dropdown sadaļas
        const dropdownSections = document.querySelectorAll('.dropdown-section');
        dropdownSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Atjaunojam aktīvo navigācijas saiti
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        mainLink.classList.add('active');
        
        // Ritinām uz lapas augšu
        window.scrollTo(0, 0);
    }
    
    // Funkcija, lai parādītu dropdown saturu
    function showDropdownContent(sectionId) {
        mainContent.style.display = 'none';
        dropdownContent.style.display = 'block';
        
        // Paslēpjam visas dropdown sadaļas
        const dropdownSections = document.querySelectorAll('.dropdown-section');
        dropdownSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Parādām izvēlēto sadaļu
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Ritinām uz lapas augšu
        window.scrollTo(0, 0);
    }
    
    // Mobilās izvēlnes atvēršana un aizvēršana
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Animējam hamburger ikonu uz X un atpakaļ
        const spans = menuToggle.querySelectorAll('span');
        if (mainNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg)';
        } else {
            spans[0].style.transform = 'rotate(0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0)';
        }
    });
    
    // Dark mode pārslēgšana
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        
        // Saglabājam lietotāja izvēli localStorage
        if (themeToggle.checked) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Pārbaudām, vai lietotājam ir iepriekš izvēlēts dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    
    // Galvenās lapas rādīšana
    mainLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMainContent();
    });
    
    // Logo klikšķis - atgriežas uz galveno lapu
    mainLogo.addEventListener('click', function(e) {
        e.preventDefault();
        showMainContent();
    });
    
    // Notikumu delegācija visam dokumentam
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // "Atpakaļ uz galveno lapu" saitēm
        if (target.classList.contains('back-to-main') || target.closest('.back-to-main')) {
            e.preventDefault();
            showMainContent();
            return;
        }
        
        // Dropdown navigācijas apstrāde (tikai "Par mums" apakšpunktiem)
        if (target.hasAttribute('data-section')) {
            e.preventDefault();
            const sectionId = target.getAttribute('data-section');
            showDropdownContent(sectionId);
            
            // Aizvērt mobilā izvēlne, ja tā ir atvērta
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'rotate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0)';
            }
            return;
        }
        
        // Parastās navigācijas saitēm (kas ved uz galveno lapu)
        if (target.getAttribute('href') && target.getAttribute('href').startsWith('#')) {
            // Pārliecināmies, ka esam galvenajā lapā
            if (mainContent.style.display === 'none') {
                e.preventDefault();
                showMainContent();
                
                // Pārejam uz attiecīgo sadaļu pēc īsa laika
                setTimeout(() => {
                    const targetSection = document.querySelector(target.getAttribute('href'));
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        }
    });
    
    // Aktīvās navigācijas saites atjaunināšana ritinot (tikai galvenajā lapā)
    const sections = document.querySelectorAll('#main-content section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', function() {
        // Tikai ja esam galvenajā lapā
        if (mainContent.style.display !== 'none') {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
            
            // Ja nav aktīvas saites, rādam "Sākums" kā aktīvu
            if (!document.querySelector('nav a.active')) {
                mainLink.classList.add('active');
            }
        }
    });
});