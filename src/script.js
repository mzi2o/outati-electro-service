document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  let currentLang = 'en';

  // --- Elements ---
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const langToggleBtn = document.getElementById('lang-toggle');
  const mainNav = document.getElementById('main-nav');
  const form = document.getElementById('whatsapp-form');
  const formServiceSelect = document.getElementById('form-service');
  
  // --- 1. Language Switcher ---
  function setLanguage(lang) {
    currentLang = lang;
    htmlEl.lang = lang;
    htmlEl.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    if (lang === 'ar') {
      bodyEl.classList.add('rtl');
      langToggleBtn.textContent = 'English';
    } else {
      bodyEl.classList.remove('rtl');
      langToggleBtn.textContent = 'عربي';
    }

    // Update text content
    document.querySelectorAll('[data-en]').forEach(el => {
      // Don't update inputs/textareas textContent, update placeholders instead
      if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
        if (el.hasAttribute(`data-${lang}`)) {
          el.textContent = el.getAttribute(`data-${lang}`);
        }
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
      if (el.hasAttribute(`data-placeholder-${lang}`)) {
        el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
      }
    });
  }

  // Initial setup (default is English, handled in HTML, but we run it to be sure)
  // setLanguage('en');

  langToggleBtn.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
  });


  // --- 2. Navbar Scroll Effect ---
  function handleScroll() {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // init


  // --- 3. Gallery Filter ---
  const filterBtns = document.querySelectorAll('#gallery-filters .btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all
      filterBtns.forEach(b => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline-primary', 'bg-white');
      });
      
      // Add active to clicked
      e.target.classList.add('active', 'btn-primary');
      e.target.classList.remove('btn-outline-primary', 'bg-white');

      const filter = e.target.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300); // match CSS transition duration if we had one, else hide after fade
        }
      });
    });
  });


  // --- 4. Service Card Buttons -> Form ---
  const serviceBtns = document.querySelectorAll('.service-btn, .footer-link');
  serviceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isFooterLink = btn.classList.contains('footer-link');
      if(isFooterLink) e.preventDefault();
      
      const serviceVal = btn.getAttribute('data-service');
      if (serviceVal && formServiceSelect) {
        formServiceSelect.value = serviceVal;
      }
      
      // Smooth scroll to form
      const formSection = document.getElementById('request-form');
      if (formSection) {
        const yOffset = -80; // offset for sticky nav
        const y = formSection.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });


  // --- 5. WhatsApp Form Submit ---
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const location = document.getElementById('form-location').value;
      const serviceSelect = document.getElementById('form-service');
      const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
      const desc = document.getElementById('form-desc').value;

      let message = "";

      if (currentLang === 'en') {
        message = `Hello Othman,

My name is ${name}.
I am located in ${location}.
Phone: ${phone}
I am interested in: ${serviceText}.

Request details:
${desc}`;
      } else {
        message = `السلام عليكم عثمان،

اسمي ${name}.
أتواجد في ${location}.
الهاتف: ${phone}
أريد الاستفسار عن خدمة: ${serviceText}.

تفاصيل الطلب:
${desc}`;
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/212697362785?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }


  // --- 6. Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  // Close mobile nav on link click
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarCollapse = document.getElementById('navbarContent');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        // If bootstrap is loaded globally
        if(typeof bootstrap !== 'undefined') {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      }
    });
  });
});
