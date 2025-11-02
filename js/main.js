document.addEventListener('DOMContentLoaded', function() {
    // ==================== DARK MODE TOGGLE ====================
        const themeToggleBtn = document.getElementById('theme-toggle');
        const htmlEl = document.documentElement;
      
        // Fonction pour appliquer le thème
        const applyTheme = (isDark) => {
          if (isDark) {
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
          updateButtonIcon(isDark);
        };
      
        // Mise à jour de l'icône du bouton
        const updateButtonIcon = (isDark) => {
          if (!themeToggleBtn) return;
          themeToggleBtn.querySelector('.fa-moon').classList.toggle('hidden', isDark);
          themeToggleBtn.querySelector('.fa-sun').classList.toggle('hidden', !isDark);
        };
      
        // Vérification du thème initial
        const getPreferredTheme = () => {
          const storedTheme = localStorage.getItem('theme');
          if (storedTheme) return storedTheme === 'dark';
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        };
      
        // Initialisation
        applyTheme(getPreferredTheme());
      
        // Gestion du clic
        if (themeToggleBtn) {
          themeToggleBtn.addEventListener('click', () => {
            const isDark = !htmlEl.classList.contains('dark');
            applyTheme(isDark);
            
            // Animation
            themeToggleBtn.classList.add('animate-pulse');
            setTimeout(() => themeToggleBtn.classList.remove('animate-pulse'), 300);
          });
        }
     

    // ==================== MOBILE MENU TOGGLE ====================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
        });
        
        // Fermer le menu mobile lors du clic sur un lien
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            });
        });
    }

    // ==================== SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== ACTIVE NAV LINK HIGHLIGHT ====================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ==================== BACK TO TOP BUTTON ====================
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) { // La vérification est bonne, on la garde
        const formResult = document.getElementById('form-result');
        const submitButton = document.getElementById('contact-submit-btn');
        const submitButtonText = submitButton.querySelector('.btn-text');

        contactForm.addEventListener('submit', async function (e) {
          e.preventDefault();
          
          const formData = new FormData(contactForm);
          const object = Object.fromEntries(formData);
          const json = JSON.stringify(object);

          formResult.innerHTML = "Envoi en cours...";
          formResult.className = 'text-gray-500 dark:text-gray-400';
          submitButton.disabled = true;
          submitButtonText.textContent = 'Envoi...';

          try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            const result = await response.json();
            if (result.success) {
                formResult.innerHTML = "Message envoyé avec succès ! Merci.";
                formResult.className = 'text-green-500';
                contactForm.reset();
            } else {
                formResult.innerHTML = "Erreur: " + result.message;
                formResult.className = 'text-red-500';
            }
          } catch (error) {
            formResult.innerHTML = "Une erreur est survenue. Veuillez réessayer.";
            formResult.className = 'text-red-500';
          } finally {
            submitButton.disabled = false;
            submitButtonText.textContent = 'Envoyer le message';
          }
        });    
    }

    // ==================== PROJECT CARD HOVER EFFECT ====================
    document.querySelectorAll('.project-card').forEach(card => {
        const content = card.querySelector('.project-content');
        
        if (content) {
            card.addEventListener('mousemove', (e) => {
                const x = e.layerX;
                const y = e.layerY;
                
                const centerX = card.offsetWidth / 2;
                const centerY = card.offsetHeight / 2;
                
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;
                
                content.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                content.style.transform = 'rotateX(0) rotateY(0)';
            });
        }
    });

    // ==================== ANIMATE ON SCROLL ====================
    const animateElementsOnScroll = function() {
        const elements = document.querySelectorAll('.project-card, .skill-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    };
    
    window.addEventListener('scroll', animateElementsOnScroll);
    animateElementsOnScroll();
});