document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP ScrollTrigger if loaded
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // GSAP 3D Hero Animations (if on homepage)
  const heroPlate = document.getElementById('hero-plate');
  if (heroPlate) {
    // Initial Reveal
    const tl = gsap.timeline();
    tl.fromTo(".gsap-hero-title", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" })
      .fromTo(".gsap-hero-text", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.7")
      .fromTo(".gsap-hero-btns", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.5")
      .fromTo("#hero-plate", { scale: 0.1, rotationY: 180, opacity: 0 }, { scale: 1, rotationY: 0, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.7)" }, "-=1");

    // Continuous 3D Floating using GSAP
    gsap.to(heroPlate, {
      y: 40,
      rotationX: 5,
      rotationY: 10,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    // Mouse Parallax for truly 3D feel
    document.addEventListener("mousemove", (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 25;
      const y = (window.innerHeight / 2 - e.pageY) / 25;
      
      gsap.to(heroPlate, {
        rotationY: x,
        rotationX: y,
        transformPerspective: 1000,
        ease: "power1.out",
        duration: 1
      });

      // Spice Parallax (Different depths)
      gsap.to(".spice-1", { x: x * 3, y: y * 3, duration: 1, ease: "power1.out" });
      gsap.to(".spice-2", { x: x * -2, y: y * -2, duration: 1, ease: "power1.out" });
      gsap.to(".spice-3", { x: x * 1.5, y: y * 1.5, duration: 1, ease: "power1.out" });
    });

    // ScrollTrigger for About Section
    gsap.fromTo(".gsap-about-img", 
      { x: -200, opacity: 0, rotationY: -45 }, 
      { 
        x: 0, opacity: 1, rotationY: 15, duration: 1.5, 
        scrollTrigger: {
          trigger: "#about",
          start: "top 70%",
          end: "top 30%",
          scrub: 1
        }
      }
    );

    gsap.fromTo(".gsap-about-text", 
      { x: 200, opacity: 0 }, 
      { 
        x: 0, opacity: 1, duration: 1.5, 
        scrollTrigger: {
          trigger: "#about",
          start: "top 70%",
          end: "top 30%",
          scrub: 1
        }
      }
    );

    // Feature Cards Stagger
    gsap.fromTo(".gsap-card",
      { y: 100, opacity: 0, rotationX: 45 },
      { 
        y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.2,
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%"
        }
      }
    );
  }
});

// --- Global Cart Logic ---
window.cart = JSON.parse(localStorage.getItem('bp_cart')) || [];

window.updateCartBadge = function() {
  const cartCountHeaders = document.querySelectorAll('.cart-count');
  const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountHeaders.forEach(el => el.innerText = totalItems);
}

window.addToCart = function(id, name, price, image, quantity = 1) {
  const existing = window.cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    window.cart.push({ id, name, price, image, quantity });
  }
  localStorage.setItem('bp_cart', JSON.stringify(window.cart));
  updateCartBadge();
  
  // Quick animation feedback
  const countBadge = document.querySelector('.cart-count');
  if(countBadge && typeof gsap !== 'undefined') {
    gsap.fromTo(countBadge, { scale: 1.5 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
  }

  // Show a quiet, auto-dismissing toast notification
  let toast = document.createElement('div');
  toast.innerText = "Item added to cart!";
  toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:var(--accent-gold); color:#000; padding:15px 30px; border-radius:5px; font-weight:bold; z-index:9999;";
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 2000);
};

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
