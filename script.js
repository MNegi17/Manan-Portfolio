/**
 * Main JavaScript File
 * Handles interactions, animations, and form submissions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       CUSTOM CURSOR (Desktop Only)
       ========================================================================== */
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && cursorFollower) {
      document.body.classList.add('has-custom-cursor');
      let mouseX = 0, mouseY = 0;
      let followerX = 0, followerY = 0;
      let isMoving = false;

      // Follower smooth trailing animation loop
      const updateCursor = () => {
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;
        
        followerX += dx * 0.15; // Smooth trailing factor
        followerY += dy * 0.15;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        
        // Sleep state to conserve system resources when mouse is still
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          isMoving = false;
        } else {
          requestAnimationFrame(updateCursor);
        }
      };

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update the main pointer dot instantly in the event loop for zero latency
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        
        if (!isMoving) {
          isMoving = true;
          requestAnimationFrame(updateCursor);
        }
      });
  
      // Hover event delegation for all dynamic and static interactive elements
      document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, input, textarea, .bento-card, .project-card, .browser-mock, .dot, .carousel-prev, .carousel-next, .modal__close');
        if (target) {
          cursor.classList.add('cursor--hover');
          cursorFollower.classList.add('cursor-follower--hover');
        }
      });
      
      document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, input, textarea, .bento-card, .project-card, .browser-mock, .dot, .carousel-prev, .carousel-next, .modal__close');
        if (target) {
          const related = e.relatedTarget;
          if (!related || !related.closest('a, button, input, textarea, .bento-card, .project-card, .browser-mock, .dot, .carousel-prev, .carousel-next, .modal__close')) {
            cursor.classList.remove('cursor--hover');
            cursorFollower.classList.remove('cursor-follower--hover');
          }
        }
      });
    }

  
    /* ==========================================================================
       NAVIGATION & MOBILE MENU
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');
  
    // Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  
    // Open Mobile Menu
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    }
  
    // Close Mobile Menu
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  
    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  
    /* ==========================================================================
       ACTIVE NAV LINK HIGHLIGHTING
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav__link');
  
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.scrollY;
  
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Check if we are within this section
        if (scrollY >= (sectionTop - 200)) {
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
  
    /* ==========================================================================
       NUMBER COUNTER ANIMATION
       ========================================================================== */
    const stats = document.querySelectorAll('.stat__number');
    let hasAnimatedStats = false;
  
    const animateStats = () => {
      stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCount = () => {
          current += increment;
          if (current < target) {
            stat.innerText = Math.ceil(current);
            requestAnimationFrame(updateCount);
          } else {
            stat.innerText = target;
          }
        };
        updateCount();
      });
    };
  
    // Use Intersection Observer for trigger
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimatedStats) {
        animateStats();
        hasAnimatedStats = true;
      }
    }, { threshold: 0.5 });
  
    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
      statsObserver.observe(heroStats);
    }
  
    /* ==========================================================================
       SKILL BAR ANIMATION
       ========================================================================== */
    const skillBars = document.querySelectorAll('.bar-fill');
    
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.1 });
  
    skillBars.forEach(bar => {
      skillObserver.observe(bar);
    });
  
    /* ==========================================================================
       PROJECT FILTERING
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
  
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
          // If it's the "coming soon" card, we might want to keep it visible or hide it
          if (card.id === 'projectComingSoon') {
            card.style.display = filter === 'all' ? 'flex' : 'none';
            return;
          }
  
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300); // match transition duration
          }
        });
      });
    });
  
    /* ==========================================================================
       BENTO CARD MOUSE EFFECT (Glow)
       ========================================================================== */
    const bentoCards = document.querySelectorAll('.bento-card');
    
    bentoCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  
    /* ==========================================================================
       CONTACT FORM HANDLING (Hidden Iframe Method)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendMsgBtn');
    
    if (contactForm && sendBtn) {
      contactForm.addEventListener('submit', () => {
        const btnText = sendBtn.querySelector('span');
        const originalText = btnText.textContent;
        const icon = sendBtn.querySelector('i');
        
        btnText.textContent = 'Sending...';
        icon.className = 'fas fa-spinner fa-spin';
        sendBtn.disabled = true;
        
        // Form submits natively to the hidden iframe.
        // We assume success after a short delay to update the UI cleanly.
        setTimeout(() => {
          contactForm.reset();
          btnText.textContent = 'Message Sent!';
          icon.className = 'fas fa-check';
          
          setTimeout(() => {
            btnText.textContent = originalText;
            icon.className = 'fas fa-paper-plane';
            sendBtn.disabled = false;
          }, 3000);
        }, 1500);
      });
    }

    /* ==========================================================================
       GALLERY CAROUSEL HANDLING
       ========================================================================== */
    const galleryCarousel1 = document.getElementById('galleryCarousel1');
    const galleryNextBtn1 = document.getElementById('galleryNext1');
    
    if (galleryCarousel1 && galleryNextBtn1) {
      const gImages1 = galleryCarousel1.querySelectorAll('.carousel-img');
      let gCurrentIndex1 = 0;
      
      galleryNextBtn1.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        gImages1[gCurrentIndex1].classList.remove('active');
        gCurrentIndex1 = (gCurrentIndex1 + 1) % gImages1.length;
        gImages1[gCurrentIndex1].classList.add('active');
      });
    }
  
    /* ==========================================================================
       GSAP SCROLL REVEAL & STAGGER ANIMATIONS
       ========================================================================== */
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Fade and translate text elements
    gsap.utils.toArray('.section-title, .section-desc, .about__bio, .contact__inner, .highlight-item').forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered bento card reveals
    if (document.querySelector('.skills-bento')) {
      gsap.fromTo('.bento-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.skills-bento',
            start: 'top 85%'
          }
        }
      );
    }

    // Staggered gallery cards reveals
    if (document.querySelector('.gallery-grid')) {
      gsap.fromTo('.story-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 85%'
          }
        }
      );
    }


    /* ==========================================================================
       ESPN-STYLE HORIZONTAL SCROLL SECTION
       ========================================================================== */
    const espnRail = document.getElementById('espnRail');
    const espnPinWrapper = document.getElementById('espnPinWrapper');
    const espnTimelineBar = document.getElementById('espnTimelineBar');
    const espnTimelineDots = document.getElementById('espnTimelineDots');
    const espnCounter = document.getElementById('espnCounter');
    const espnScrollHint = document.getElementById('espnScrollHint');
    const espnCards = document.querySelectorAll('.espn-card');

    if (espnRail && espnPinWrapper && espnCards.length > 0) {
      const isMobile = window.innerWidth <= 900;

      if (isMobile) {
        // ── Mobile: ensure nothing is stuck ───────────────────────
        // Force clear any transforms or overflow that could block scrolling
        espnRail.style.transform = 'none';
        espnRail.style.position = 'static';
        espnPinWrapper.style.height = 'auto';
        espnPinWrapper.style.overflow = 'visible';
        espnPinWrapper.style.position = 'relative';
        document.body.style.overflow = '';

        // Mark all cards as active (visible) on mobile
        espnCards.forEach(c => c.classList.add('is-active'));

      } else {
        // ── Desktop: full GSAP horizontal scroll ──────────────────
        const numCards = espnCards.length;

        // Build dot indicators
        espnCards.forEach((card, i) => {
          const dot = document.createElement('span');
          dot.className = 'espn-dot' + (i === 0 ? ' active' : '');
          dot.addEventListener('click', () => {
            // Scroll to approximate position for this card
            const totalScrollDistance = espnPinWrapper.offsetHeight * (numCards - 1);
            const sectionTop = espnPinWrapper.getBoundingClientRect().top + window.scrollY;
            const targetScroll = sectionTop + (i / (numCards - 1)) * totalScrollDistance;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          });
          espnTimelineDots.appendChild(dot);
        });

        const dots = espnTimelineDots.querySelectorAll('.espn-dot');
        let currentIdx = -1;

        const updateActiveCard = (idx) => {
          if (idx === currentIdx) return;
          currentIdx = idx;

          // Cards
          espnCards.forEach((c, i) => c.classList.toggle('is-active', i === idx));

          // Dots
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));

          // Counter
          const pad = (n) => String(n + 1).padStart(2, '0');
          if (espnCounter) espnCounter.textContent = `${pad(idx)} / ${pad(numCards - 1)}`;
        };

        // Activate first card immediately
        updateActiveCard(0);

        // Register GSAP plugin
        gsap.registerPlugin(ScrollTrigger);

        // Create the scrollytelling scroll-pinned animation
        gsap.to(espnRail, {
          x: () => `-${(numCards - 1) * 100}vw`,
          ease: 'none',
          scrollTrigger: {
            trigger: espnPinWrapper,
            start: 'top top',
            end: () => `+=${(numCards - 1) * window.innerHeight * 1.2}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;

              // Update timeline bar
              if (espnTimelineBar) {
                espnTimelineBar.style.width = `${progress * 100}%`;
              }

              // Determine which card is active
              const rawIdx = progress * (numCards - 1);
              const newIdx = Math.round(rawIdx);
              updateActiveCard(Math.min(newIdx, numCards - 1));

              // Hide scroll hint after first scroll
              if (espnScrollHint) {
                espnScrollHint.classList.toggle('hidden', progress > 0.08);
              }
            }
          }
        });
      }
    }



    /* ==========================================================================
       3D BROWSER MOCKUP TILT EFFECT (Desktop Only)
       ========================================================================== */
    if (!isTouchDevice) {
      const tiltMocks = document.querySelectorAll('.browser-mock');
      
      tiltMocks.forEach(mock => {
        mock.addEventListener('mousemove', (e) => {
          const rect = mock.getBoundingClientRect();
          const x = e.clientX - rect.left; 
          const y = e.clientY - rect.top;  
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          // Calculate rotations (max 8deg tilt to keep it elegant)
          const rotateX = ((centerY - y) / centerY) * 8;
          const rotateY = ((x - centerX) / centerX) * 8;
          
          mock.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
          mock.style.transition = 'transform 0.1s ease';
        });
        
        mock.addEventListener('mouseleave', () => {
          mock.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
          mock.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        });
      });
    }

    /* ==========================================================================
       PROJECT DETAIL MODAL CONTROLLER
       ========================================================================== */
    const modal = document.getElementById('projectModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBody = document.getElementById('modalBody');

    const openModal = (triggerElement) => {
      const title = triggerElement.getAttribute('data-title') || '';
      const descFull = triggerElement.getAttribute('data-desc-full') || '';
      const tools = triggerElement.getAttribute('data-tools') || '';
      const metrics = triggerElement.getAttribute('data-metrics') || '';
      const images = triggerElement.getAttribute('data-images') || '';
      const github = triggerElement.getAttribute('data-github') || '';
      const demo = triggerElement.getAttribute('data-demo') || '';

      const toolsList = tools ? tools.split(',').map(t => t.trim()) : [];
      const metricsList = metrics ? metrics.split(';').map(m => m.trim()) : [];
      const imagesList = images ? images.split(',').map(i => i.trim()) : [];

      let tagsHtml = toolsList.map(t => `<span class="tag">${t}</span>`).join('');
      let metricsHtml = metricsList.map(m => `
        <div class="modal-metric-item">
          <div class="modal-metric-icon"><i class="fas fa-check-circle"></i></div>
          <div class="modal-metric-text">${m}</div>
        </div>
      `).join('');

      let actionButtons = '';
      if (demo) {
        actionButtons += `
          <a href="${demo}" target="_blank" class="btn btn--primary demo-link">
            <span>Live Demo</span>
            <i class="fas fa-external-link-alt"></i>
          </a>
        `;
      }
      if (github) {
        actionButtons += `
          <a href="${github}" target="_blank" class="btn btn--ghost repo-link">
            <span>Source Code</span>
            <i class="fab fa-github"></i>
          </a>
        `;
      }

      // Dynamic media section: carousel if multiple images, else single image
      let mediaHtml = '';
      if (imagesList.length > 1) {
        mediaHtml = `
          <div class="modal-media project-carousel" id="modalCarousel">
            ${imagesList.map((img, idx) => `
              <div class="carousel-slide ${idx === 0 ? 'active' : ''}">
                <div class="blurred-backdrop" style="background-image: url('${img}');"></div>
                <img src="${img}" alt="${title} Preview ${idx+1}" class="carousel-img ${idx === 0 ? 'active' : ''}" />
              </div>
            `).join('')}
            <button class="carousel-prev" id="modalPrevBtn" aria-label="Previous Image"><i class="fas fa-chevron-left"></i></button>
            <button class="carousel-next" id="modalNextBtn" aria-label="Next Image"><i class="fas fa-chevron-right"></i></button>
            <div class="carousel-dots" id="modalDots">
              ${imagesList.map((_, idx) => `
                <span class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        mediaHtml = `
          <div class="modal-media">
            <div class="blurred-backdrop" style="background-image: url('${imagesList[0] || ''}');"></div>
            <img src="${imagesList[0] || ''}" alt="${title}" />
          </div>
        `;
      }

      modalBody.innerHTML = `
        <div class="modal-grid">
          ${mediaHtml}
          <div class="modal-info">
            <h2 class="modal-title">${title}</h2>
            <div class="modal-tags">
              ${tagsHtml}
            </div>
            <p class="modal-desc">${descFull}</p>
            
            ${metricsList.length > 0 ? `
              <div class="modal-metrics-container">
                <h4 style="font-family: var(--font-heading); color: var(--text-main); margin-bottom: 0.5rem;">Key Performance & Results</h4>
                ${metricsHtml}
              </div>
            ` : ''}

            <div class="modal-actions">
              ${actionButtons}
            </div>
          </div>
        </div>
      `;

      // Wire up carousel events inside the modal
      let activeImageIdx = 0;
      const prevBtn = modalBody.querySelector('#modalPrevBtn');
      const nextBtn = modalBody.querySelector('#modalNextBtn');
      const dotsContainer = modalBody.querySelector('#modalDots');

      const updateModalCarousel = (nextIdx) => {
        const carouselSlides = modalBody.querySelectorAll('.carousel-slide');
        const dots = modalBody.querySelectorAll('.carousel-dots .dot');
        
        carouselSlides[activeImageIdx].classList.remove('active');
        const oldImg = carouselSlides[activeImageIdx].querySelector('.carousel-img');
        if (oldImg) oldImg.classList.remove('active');
        
        if (dots.length > 0) dots[activeImageIdx].classList.remove('active');
        
        activeImageIdx = nextIdx;
        
        carouselSlides[activeImageIdx].classList.add('active');
        const newImg = carouselSlides[activeImageIdx].querySelector('.carousel-img');
        if (newImg) newImg.classList.add('active');
        
        if (dots.length > 0) dots[activeImageIdx].classList.add('active');
      };

      if (prevBtn && nextBtn && imagesList.length > 1) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          let nextIdx = (activeImageIdx - 1 + imagesList.length) % imagesList.length;
          updateModalCarousel(nextIdx);
        });

        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          let nextIdx = (activeImageIdx + 1) % imagesList.length;
          updateModalCarousel(nextIdx);
        });

        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.dot');
          dots.forEach((dot, dotIdx) => {
            dot.addEventListener('click', (e) => {
              e.stopPropagation();
              updateModalCarousel(dotIdx);
            });
          });
        }
      }

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; 
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; 
      modalBody.innerHTML = ''; 
    };

    // Modal Trigger: "Case Study" / "View Details" buttons inside ESPN cards
    document.querySelectorAll('.view-details-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Support both old .project-scroll-section and new .espn-card
        const card = btn.closest('.espn-card') || btn.closest('.project-scroll-section');
        if (card) openModal(card);
      });
    });

    // Modal Trigger: Browser Mockups inside ESPN cards
    document.querySelectorAll('.espn-card .browser-mock').forEach(mock => {
      mock.addEventListener('click', (e) => {
        const card = mock.closest('.espn-card');
        if (card) openModal(card);
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeModal();
      }
    });
  
});
