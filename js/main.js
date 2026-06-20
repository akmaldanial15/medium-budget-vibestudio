/* 
 * Vibe Interior Studio - Main JavaScript
 * Custom Vanilla JS Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Navigation Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking links on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. Portfolio Filtering Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioGrid = document.getElementById('portfolio-grid');

  if (portfolioGrid && filterButtons.length > 0) {
    
    const filterPortfolio = (filterValue) => {
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          // Force layout recalculation then fade in
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Wait for transition to finish before hiding display
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active class on buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        filterPortfolio(filterValue);
      });
    });

    // Check URL parameters for filtering (e.g. portfolio.html?filter=living)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      const targetButton = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
      if (targetButton) {
        // Trigger click to filter automatically
        targetButton.click();
      }
    }
  }

  // 4. Portfolio Lightbox Modal
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (lightbox && portfolioItems.length > 0) {
    let currentActiveItems = [];
    let currentIndex = 0;

    const updateLightboxImage = () => {
      const currentItem = currentActiveItems[currentIndex];
      const imgSrc = currentItem.querySelector('img').getAttribute('src');
      const title = currentItem.getAttribute('data-title');
      const desc = currentItem.getAttribute('data-description');

      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', title);
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;
    };

    // Open Lightbox
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        // Get list of active (visible) items based on the active filter
        currentActiveItems = Array.from(portfolioItems).filter(i => i.style.display !== 'none');
        
        // If the array is empty (no filter applied yet), default to all items
        if (currentActiveItems.length === 0) {
          currentActiveItems = Array.from(portfolioItems);
        }

        currentIndex = currentActiveItems.indexOf(item);
        
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });

    // Close Lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Navigation Controls
    const navigateNext = () => {
      currentIndex = (currentIndex + 1) % currentActiveItems.length;
      updateLightboxImage();
    };

    const navigatePrev = () => {
      currentIndex = (currentIndex - 1 + currentActiveItems.length) % currentActiveItems.length;
      updateLightboxImage();
    };

    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateNext();
    });

    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigatePrev();
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          navigateNext();
        } else if (e.key === 'ArrowLeft') {
          navigatePrev();
        }
      }
    });
  }

  // 5. Contact Form Submission Mock
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear past statuses
      formStatus.className = 'form-status';
      formStatus.textContent = '';
      formStatus.style.display = 'none';

      // Inputs validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !phone || !message) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Please fill in all required fields.';
        return;
      }

      // Basic email pattern validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Please enter a valid email address.';
        return;
      }

      // Show submitting state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      // Mock API call delay
      setTimeout(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

        // Show Success status
        formStatus.classList.add('success');
        formStatus.textContent = 'Thank you! Your design inquiry has been sent successfully. Our design team will contact you via email or WhatsApp within 24 hours.';
        formStatus.style.display = 'block';

        // Clear form fields
        contactForm.reset();
      }, 1500);
    });
  }
});
