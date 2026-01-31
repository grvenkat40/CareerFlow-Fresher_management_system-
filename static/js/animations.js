// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Header fade-in animation
    const header = document.querySelector('.land_page_header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);

    // Landing section animations
    const firstTextView = document.querySelector('.first_txt_view');
    const firstImgView = document.querySelector('.first_img_view');
    
    if (firstTextView) {
        firstTextView.style.opacity = '0';
        firstTextView.style.transform = 'translateX(-50px)';
        firstTextView.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            firstTextView.style.opacity = '1';
            firstTextView.style.transform = 'translateX(0)';
        }, 300);
    }
    
    if (firstImgView) {
        firstImgView.style.opacity = '0';
        firstImgView.style.transform = 'translateX(50px)';
        firstImgView.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            firstImgView.style.opacity = '1';
            firstImgView.style.transform = 'translateX(0)';
        }, 500);
    }

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // About section animation
    const aboutSite = document.querySelector('.about_site');
    if (aboutSite) {
        aboutSite.style.opacity = '0';
        aboutSite.style.transform = 'translateY(30px)';
        observer.observe(aboutSite);
    }

    // Features staggered animation
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(40px)';
        feature.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(feature);
    });

    // Trigger section animation
    const trigerUser = document.querySelector('.triger_user');
    if (trigerUser) {
        trigerUser.style.opacity = '0';
        trigerUser.style.transform = 'scale(0.95)';
        observer.observe(trigerUser);
    }

    // Button hover effects
    const buttons = document.querySelectorAll('a[href*="login"], a[href*="register"]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Feature cards hover animation
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for image on scroll (optional)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        if (firstImgView) {
            firstImgView.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// CSS class for fade-in-up animation
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature:hover {
        box-shadow: 0 10px 30px rgba(24, 136, 255, 0.15);
    }
`;
document.head.appendChild(style);