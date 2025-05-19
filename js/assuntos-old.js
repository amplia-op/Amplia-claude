    // Preloader simulation
    document.addEventListener('DOMContentLoaded', function() {
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
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });

      // Add scroll event listener
      window.addEventListener('scroll', fadeInOnScroll);

      // Trigger once on load to check for elements already in view
      fadeInOnScroll();
    });

    // Função para carregar questões de uma matéria específica
    function loadQuestions(subject) {
      // Em uma implementação real, esta função carregaria as questões do arquivo JSON correspondente
      alert(`Carregando questões de ${subject}. Em uma implementação real, isso carregaria o arquivo ${subject}.json com as questões.`);
      // Aqui você redirecionaria para a página de questões ou carregaria dinamicamente as questões
    }

    // Função para iniciar um simulado completo
    function loadSimulado() {
      // Em uma implementação real, esta função iniciaria um simulado com questões variadas
      alert('Iniciando simulado completo. Em uma implementação real, isso carregaria questões de todas as matérias para um simulado completo.');
      // Aqui você redirecionaria para a página de simulado ou carregaria dinamicamente o simulado