document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Custom Cursor Follower
  // ==========================================
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');
  
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  
  if (cursorDot && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the dot
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });
    
    // Smooth trailing animation for the outer circle
    const animateCursor = () => {
      // Linear interpolation (Lerp) to smooth out the transition
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Add hover effect classes to links, buttons, and cards
    const hoverElements = document.querySelectorAll('a, button, .glass-card, input, textarea, .nav-toggle');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // ==========================================
  // Floating Header Scrolled Effect
  // ==========================================
  const header = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // Mobile Nav Toggle Menu
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    
    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ==========================================
  // Interactive Neural Canvas Particles
  // ==========================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    // Adjust density based on mobile screen width
    let particleCount = width < 768 ? 30 : 80;
    let maxDistance = 100;
    
    // Mouse coords for proximity connection
    let mouse = { x: null, y: null, radius: 150 };
    
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particleCount = width < 768 ? 30 : 80;
      init();
    });
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Speeds are set to move slowly to give a calm space feel
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
        
        // Dynamic colors in the cyan-purple spectrum
        this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(157, 78, 221, 0.4)';
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connection lines between particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDistance) {
            // Line alpha based on distance
            const alpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
        // Connection lines between particles and mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(157, 78, 221, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    }
    
    init();
    animate();
  }

  // ==========================================
  // Intersection Observer for Scroll Reveals
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: stop observing once revealed to retain visual layout state
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // triggers slightly before entering the screen fully
  });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // Active Section Navigation Highlighter
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinkElems = document.querySelectorAll('.nav-link');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkElems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35, // triggers when 35% of the section is visible
  });
  
  sections.forEach(section => navObserver.observe(section));

  // ==========================================
  // 3D Card Parallax Tilt Effect
  // ==========================================
  const cards = document.querySelectorAll('.project-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      
      // Cursor coordinates relative to the card dimensions
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      const mouseX = e.clientX - cardRect.left;
      const mouseY = e.clientY - cardRect.top;
      
      // Calculate rotation angles based on cursor offset from card center
      const rotateX = ((mouseY / cardHeight) - 0.5) * -12; // max -6 to +6 deg
      const rotateY = ((mouseX / cardWidth) - 0.5) * 12;   // max -6 to +6 deg
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Add dynamic reflection effect using background radial gradient
      const pctX = (mouseX / cardWidth) * 100;
      const pctY = (mouseY / cardHeight) * 100;
      card.style.backgroundImage = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(0, 242, 254, 0.08) 0%, rgba(13, 18, 33, 0.45) 80%)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.backgroundImage = ''; // reset gradient reflection
    });
  });

  // ==========================================
  // Contact Form Handling with Animations
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitText = document.getElementById('submit-text');
  
  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Input Validation check
      const inputs = contactForm.querySelectorAll('.form-input');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderBottomColor = 'red';
          setTimeout(() => {
            input.style.borderBottomColor = '';
          }, 3000);
        }
      });
      
      if (!isValid) return;
      
      // Start Submission Loading State
      submitBtn.classList.add('loading');
      inputs.forEach(input => input.disabled = true);
      
      // Simulate API post (1.5 seconds)
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        submitText.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg> Message Sent!';
        
        // Reset after success
        setTimeout(() => {
          contactForm.reset();
          inputs.forEach(input => {
            input.disabled = false;
            // Trigger floating label restore by dispatching change event
            input.dispatchEvent(new Event('change'));
          });
          
          submitBtn.classList.remove('success');
          submitText.innerHTML = 'Send Message <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';
        }, 3000);
        
      }, 1500);
    });
  }
});
