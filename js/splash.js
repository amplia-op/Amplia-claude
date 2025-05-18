    // Preloader animation
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        document.querySelector('.preloader').classList.add('fade-out');
      }, 1500);
      
      // Scroll animation for elements
      const fadeElements = document.querySelectorAll('.fade-in');
      
      const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
        });
      };
      
      // Set initial state for elements
      fadeElements.forEach(element => {
        if (element.parentElement.className !== 'hero-content') {
          element.style.opacity = '0';
          element.style.transform = 'translateY(20px)';
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
      });
      
      // Add scroll event listener
      window.addEventListener('scroll', fadeInOnScroll);
      
      // Trigger once on load to check for elements already in view
      fadeInOnScroll();
    });