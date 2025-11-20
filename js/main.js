/* ============================================
   PragatiXSphere - Dynamic JavaScript Features
   ============================================ */

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initCounters();
    initFormValidation();
    initSmoothScroll();
});

// ========== Navigation ==========
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ========== Scroll Animations ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if element has counter
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
    
    // Add fade-in class to cards
    document.querySelectorAll('.card, .service-card, .provider-card').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// ========== Animated Counters ==========
function initCounters() {
    // This will be triggered by scroll animations
}

function animateCounter(element) {
    const counterElement = element.querySelector('.stat-number');
    if (!counterElement || counterElement.dataset.animated) return;
    
    counterElement.dataset.animated = 'true';
    const target = parseInt(counterElement.textContent.replace(/\D/g, ''));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counterElement.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            counterElement.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// ========== Form Validation ==========
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate name
        if (!validateName(nameInput.value)) {
            showError(nameInput, 'Please enter a valid name (at least 2 characters)');
            isValid = false;
        } else {
            clearError(nameInput);
        }
        
        // Validate email
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        // Validate phone
        if (phoneInput && !validatePhone(phoneInput.value)) {
            showError(phoneInput, 'Please enter a valid phone number');
            isValid = false;
        } else if (phoneInput) {
            clearError(phoneInput);
        }
        
        // Validate message
        if (!validateMessage(messageInput.value)) {
            showError(messageInput, 'Please enter a message (at least 10 characters)');
            isValid = false;
        } else {
            clearError(messageInput);
        }
        
        if (isValid) {
            // Show success message
            showSuccessMessage();
            form.reset();
        }
    });
    
    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (this.value && !validateName(this.value)) {
                showError(this, 'Please enter a valid name');
            } else {
                clearError(this);
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            } else {
                clearError(this);
            }
        });
    }
}

// Validation functions
function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.trim().length >= 10 && phoneRegex.test(phone);
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

function showError(input, message) {
    const formGroup = input.parentElement;
    let errorElement = formGroup.querySelector('.form-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
    input.style.borderColor = '#f5576c';
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    input.style.borderColor = '#e2e8f0';
}

function showSuccessMessage() {
    const form = document.querySelector('.contact-form');
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        padding: 1.5rem;
        border-radius: 10px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
        color: #2d3748;
        animation: fadeInUp 0.5s ease;
    `;
    successDiv.textContent = '✓ Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
    
    form.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.transition = 'opacity 0.5s ease';
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 500);
    }, 5000);
}

// ========== Smooth Scroll ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== Service Card Interactions ==========
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle expanded state
            this.classList.toggle('expanded');
        });
    });
});

// ========== Typing Effect for Hero ==========
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========== Particle Background Effect (Optional) ==========
function createParticles(container, count = 50) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            background: rgba(102, 126, 234, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
        `;
        container.appendChild(particle);
    }
}

// ========== Stats Counter on Scroll ==========
let statsAnimated = false;

window.addEventListener('scroll', function() {
    if (statsAnimated) return;
    
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    
    const statsPosition = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;
    
    if (statsPosition < screenPosition) {
        statsAnimated = true;
        document.querySelectorAll('.stat-item').forEach(item => {
            animateCounter(item);
        });
    }
});

// ========== Dynamic Year in Footer ==========
window.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// ========== Service Filter (for Services page) ==========
function initServiceFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            serviceCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize service filter if on services page
if (document.querySelector('.filter-btn')) {
    initServiceFilter();
}

// ========== Copy to Clipboard ==========
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: fadeInUp 0.5s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s ease';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ========== Preloader (Optional) ==========
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 500);
    }
});

// Export functions for use in HTML
window.PragatiXSphere = {
    copyToClipboard,
    showNotification,
    createParticles,
    typeWriter
};
