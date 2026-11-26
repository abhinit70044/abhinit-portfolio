/**
 * Main Portfolio Interactivity
 * - Sticky glass navbar & active section tracking
 * - Mobile drawer menu
 * - Typing specialty animation
 * - Scroll reveal animations
 * - 3D perspective card tilt
 * - Project scope modal
 * - Contact inquiry validation & clipboard brief builder
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Navbar Scroll & Mobile Drawer
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', updateNavbarScroll, { passive: true });
  updateNavbarScroll();

  function closeMobileMenu() {
    if (!navToggle || !navLinksContainer) return;
    navToggle.classList.remove('active');
    navLinksContainer.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinksContainer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // Active Section Highlighting
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('data-section') === id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -45% 0px' }
    );

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  /* ------------------------------------------------------------------------
     2. Hero Typing Effect
     ------------------------------------------------------------------------ */
  const typingEl = document.getElementById('typing-text');
  const phrases = [
    'SEO & Search Visibility',
    'Meta Ads Campaigns',
    'Google Ads Strategy',
    'Social Media Marketing',
    'Canva Visual Creatives'
  ];

  if (typingEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let phraseIdx = 0;
    let charIdx = phrases[0].length;
    let isDeleting = true;

    function tickTyping() {
      const current = phrases[phraseIdx];

      if (isDeleting) {
        charIdx--;
        typingEl.textContent = current.substring(0, charIdx);
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tickTyping, 320);
          return;
        }
        setTimeout(tickTyping, 38);
      } else {
        charIdx++;
        typingEl.textContent = current.substring(0, charIdx);
        if (charIdx === current.length) {
          isDeleting = true;
          setTimeout(tickTyping, 1800);
          return;
        }
        setTimeout(tickTyping, 62);
      }
    }

    setTimeout(tickTyping, 1700);
  }

  /* ------------------------------------------------------------------------
     3. Scroll Reveal Animations
     ------------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------------
     4. 3D Perspective Tilt Cards
     ------------------------------------------------------------------------ */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canHover && !reducedMotion) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-y * 7).toFixed(2);
        const rotateY = (x * 7).toFixed(2);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Project Scope Modal (Authentic Project Details Only)
     ------------------------------------------------------------------------ */
  const projectData = {
    clicksorbit: {
      category: 'E-Commerce & Growth',
      title: 'Clicksorbit E-commerce Website',
      summary:
        'Developed the digital storefront structure and marketing readiness for the Clicksorbit e-commerce website, aligning product presentation with organic search and visual branding.',
      deliverables: [
        'Structured category and product pages for clear user navigation and discovery.',
        'Applied on-page SEO fundamentals including clean headings, titles, and meta descriptions.',
        'Designed promotional graphics and storefront visual assets using Canva.',
        'Aligned website layout with paid social and search traffic landing requirements.'
      ],
      tags: ['E-Commerce Strategy', 'SEO Structure', 'Canva Design', 'Digital Marketing']
    },
    'meta-ads': {
      category: 'Paid Social Advertising',
      title: 'Meta Ads Campaigns',
      summary:
        'Planned and configured structured Meta Ads campaigns across Facebook and Instagram placements to reach targeted audiences with cohesive creative messaging.',
      deliverables: [
        'Selected campaign objectives matched to awareness, engagement, and conversion goals.',
        'Built audience targeting segments across core demographics and interest layers.',
        'Drafted ad copy paired with custom visual creatives designed in Canva.',
        'Organized ad sets and placements for clean campaign testing and optimization.'
      ],
      tags: ['Meta Ads Manager', 'Audience Targeting', 'Ad Copywriting', 'Canva Creatives']
    },
    'seo-projects': {
      category: 'Search Engine Optimization',
      title: 'SEO Projects',
      summary:
        'Executed foundational and on-page SEO initiatives aimed at strengthening search engine crawlability, keyword alignment, and organic content structure.',
      deliverables: [
        'Conducted keyword research mapped to informational and commercial search intent.',
        'Optimized title tags, meta descriptions, heading hierarchy (H1-H3), and image alt text.',
        'Reviewed internal linking structure and technical SEO hygiene checks.',
        'Aligned page copy with target search queries for improved relevance.'
      ],
      tags: ['Keyword Research', 'On-Page SEO', 'Technical Audits', 'Content Optimization']
    }
  };

  const modal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalSummary = document.getElementById('modal-summary');
  const modalDeliverables = document.getElementById('modal-deliverables');
  const modalTags = document.getElementById('modal-tags');
  let lastFocusedTrigger = null;

  function openProjectModal(projectKey, triggerEl) {
    const data = projectData[projectKey];
    if (!data || !modal) return;

    lastFocusedTrigger = triggerEl || null;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalSummary.textContent = data.summary;

    modalDeliverables.innerHTML = '';
    data.deliverables.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      modalDeliverables.appendChild(li);
    });

    modalTags.innerHTML = '';
    data.tags.forEach((tag) => {
      const li = document.createElement('li');
      li.textContent = tag;
      modalTags.appendChild(li);
    });

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeProjectModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
    }
  }

  document.querySelectorAll('.project-modal-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      openProjectModal(btn.getAttribute('data-project'), btn);
    });
  });

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeProjectModal();
    }
  });

  /* ------------------------------------------------------------------------
     6. Contact Inquiry Form & Brief Copy
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const copyBriefBtn = document.getElementById('copy-brief-btn');
  const formStatus = document.getElementById('form-status');

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const topicSelect = document.getElementById('contact-topic');
  const messageInput = document.getElementById('contact-message');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');

  function validateForm() {
    let isValid = true;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const msgVal = messageInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nameVal.length < 2) {
      errorName.textContent = 'Please enter your name (at least 2 characters).';
      isValid = false;
    } else {
      errorName.textContent = '';
    }

    if (!emailPattern.test(emailVal)) {
      errorEmail.textContent = 'Please enter a valid email address.';
      isValid = false;
    } else {
      errorEmail.textContent = '';
    }

    if (msgVal.length < 10) {
      errorMessage.textContent = 'Please enter a brief message (at least 10 characters).';
      isValid = false;
    } else {
      errorMessage.textContent = '';
    }

    return isValid;
  }

  function buildBriefText() {
    return [
      'Inquiry for Abhinit Kumar (Digital Marketing Professional)',
      `Name: ${nameInput.value.trim() || 'N/A'}`,
      `Email: ${emailInput.value.trim() || 'N/A'}`,
      `Area of Interest: ${topicSelect.value}`,
      `Message: ${messageInput.value.trim() || 'N/A'}`
    ].join('\n');
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const tempArea = document.createElement('textarea');
    tempArea.value = text;
    tempArea.setAttribute('readonly', '');
    tempArea.style.position = 'absolute';
    tempArea.style.left = '-9999px';
    document.body.appendChild(tempArea);
    tempArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempArea);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!validateForm()) {
        formStatus.className = 'form-status form-status--error';
        formStatus.textContent = 'Please review the highlighted fields before continuing.';
        return;
      }

      const brief = buildBriefText();
      try {
        await copyTextToClipboard(brief);
        formStatus.className = 'form-status form-status--success';
        formStatus.textContent =
          'Your inquiry brief is validated and copied to your clipboard, ready to share with Abhinit Kumar.';
      } catch (_err) {
        formStatus.className = 'form-status form-status--success';
        formStatus.textContent =
          'Your inquiry details are validated and ready to share with Abhinit Kumar.';
      }
    });
  }

  if (copyBriefBtn) {
    copyBriefBtn.addEventListener('click', async () => {
      if (!validateForm()) {
        formStatus.className = 'form-status form-status--error';
        formStatus.textContent = 'Fill out your name, email, and message first to copy the brief.';
        return;
      }

      try {
        await copyTextToClipboard(buildBriefText());
        formStatus.className = 'form-status form-status--success';
        formStatus.textContent = 'Formatted inquiry brief copied to clipboard.';
      } catch (_err) {
        formStatus.className = 'form-status form-status--error';
        formStatus.textContent = 'Unable to access clipboard automatically in this browser.';
      }
    });
  }
})();
