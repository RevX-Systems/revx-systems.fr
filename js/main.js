/* ================================================
   REVX Systems - JavaScript
   Theme Toggle & Mobile Navigation
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Theme Toggle
    // ============================================
    
    const themeToggle = document.getElementById('themeToggle');
    const themeModern = document.getElementById('theme-modern');
    const themeV1 = document.getElementById('theme-v1');
    const toggleOptions = document.querySelectorAll('.toggle-option');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('revx-theme') || 'modern';
    
    // Apply saved theme on load
    applyTheme(savedTheme);
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            const clickedOption = e.target.closest('.toggle-option');
            if (clickedOption) {
                const theme = clickedOption.dataset.theme;
                applyTheme(theme);
                localStorage.setItem('revx-theme', theme);
            }
        });
    }
    
    function applyTheme(theme) {
        if (theme === 'v1') {
            themeModern.disabled = true;
            themeV1.disabled = false;
        } else {
            themeModern.disabled = false;
            themeV1.disabled = true;
        }
        
        // Update toggle buttons
        toggleOptions.forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    // ============================================
    // Mobile Navigation
    // ============================================
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ============================================
    // Header Scroll Effect
    // ============================================
    
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add shadow on scroll
            if (currentScroll > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // Intersection Observer for Animations
    // ============================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.domain-card, .feature-card, .method-step, .approach-item, .value-item, .contact-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Add styles for visible state
    const style = document.createElement('style');
    style.textContent = `
        .is-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // Stagger Animation for Grid Items
    // ============================================
    
    const grids = document.querySelectorAll('.domains-grid, .features-grid, .method-grid, .approach-grid, .values-grid, .contact-grid');
    
    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
    
});

// ============================================
// Console Branding
// ============================================

console.log('%c REVX Systems ', 'background: #3fb950; color: #0d1117; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
console.log('%c Expertise ECU & Solutions Techniques ', 'color: #7d8590; font-size: 12px;');
