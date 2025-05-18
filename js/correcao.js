    // Global Variables
    let quizQuestions = [];
    let userAnswers = [];
    let quizSubject = '';

    // Initialize
    window.addEventListener('load', () => {
      loadResults();
    });

    // Load Results
    function loadResults() {
      try {
        // Retrieve data from localStorage
        const answersData = localStorage.getItem('quizAnswers');
        const questionsData = localStorage.getItem('quizQuestions');
        const subjectData = localStorage.getItem('quizSubject');

        if (!answersData || !questionsData || !subjectData) {
          showError('Não foi possível carregar os resultados. Por favor, tente novamente.');
          return;
        }

        // Parse the data
        userAnswers = JSON.parse(answersData);
        quizQuestions = JSON.parse(questionsData);
        quizSubject = subjectData;

        // Update UI
        updateSummary();
        displayReview();

        // Hide loading indicator
        document.getElementById('loadingIndicator').style.display = 'none';

      } catch (error) {
        console.error('Erro ao carregar resultados:', error);
        showError('Ocorreu um erro ao carregar os resultados.');
      }
    }

    // Update Summary
    function updateSummary() {
      // Count correct, incorrect, and unanswered questions
      let correctCount = 0;
      let incorrectCount = 0;
      let unansweredCount = 0;

      quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === null) {
          unansweredCount++;
        } else if (userAnswers[index] === question.answer) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      });

      // Calculate score percentage
      const totalQuestions = quizQuestions.length;
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

      // Update UI
      document.getElementById('resultSubject').textContent = capitalizeFirstLetter(quizSubject);
      document.getElementById('scoreValue').textContent = `${correctCount}/${totalQuestions}`;
      document.getElementById('correctCount').textContent = correctCount;
      document.getElementById('incorrectCount').textContent = incorrectCount;
      document.getElementById('unansweredCount').textContent = unansweredCount;
      document.getElementById('scorePercentage').textContent = `${scorePercentage}%`;
    }

    // Display Review
    function displayReview() {
      const reviewContainer = document.getElementById('reviewContainer');

      // Keep the title
      const reviewTitle = reviewContainer.querySelector('.review-title');
      reviewContainer.innerHTML = '';
      reviewContainer.appendChild(reviewTitle);

      // Add each question to the review
      quizQuestions.forEach((question, index) => {
        // Create question element
        const questionElement = document.createElement('div');
        questionElement.className = 'review-question';

        // Determine question status
        let status = '';
        let statusClass = '';

        if (userAnswers[index] === null) {
          status = 'Não respondida';
          statusClass = 'status-unanswered';
        } else if (userAnswers[index] === question.answer) {
          status = 'Correta';
          statusClass = 'status-correct';
        } else {
          status = 'Incorreta';
          statusClass = 'status-incorrect';
        }

        // Question header
        questionElement.innerHTML = `
          <div class="question-header">
            <div class="question-number">Questão ${index + 1}</div>
            <div class="question-status ${statusClass}">${status}</div>
          </div>
          <div class="question-text">${question.text}</div>
          <div class="question-topic">Tópico: ${question.topic}</div>
          <div class="options-container" id="options-${index}"></div>
        `;

        reviewContainer.appendChild(questionElement);

        // Add options
        const optionsContainer = questionElement.querySelector(`#options-${index}`);

        question.options.forEach((option, optIndex) => {
          const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D, E
          const optionElement = document.createElement('div');

          // Determine option classes
          let optionClass = 'option';

          // Selected option
          if (userAnswers[index] === optionLetter) {
            optionClass += ' selected';

            // Selected and correct
            if (optionLetter === question.answer) {
              optionClass += ' correct';
            } 
            // Selected but incorrect
            else {
              optionClass += ' incorrect';
            }
          } 
          // Not selected but is the correct answer
          else if (optionLetter === question.answer) {
            optionClass += ' correct';
          }

          optionElement.className = optionClass;

          // Determine marker class
          let markerClass = 'option-marker';
          if (optionLetter === question.answer) {
            markerClass += ' correct-answer';
          }

          optionElement.innerHTML = `
            <div class="${markerClass}">${optionLetter}</div>
            <div class="option-text">${option}</div>
          `;

          optionsContainer.appendChild(optionElement);
        });

        // Add explanation if available
        if (question.explanation) {
          const explanationElement = document.createElement('div');
          explanationElement.className = 'explanation';
          explanationElement.innerHTML = `
            <div class="explanation-title">Explicação:</div>
            <div class="explanation-text">${question.explanation}</div>
          `;

          questionElement.appendChild(explanationElement);
        }
      });
    }

    // Show Error
    function showError(message) {
      const reviewContainer = document.getElementById('reviewContainer');
      reviewContainer.innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <p style="color: #e53e3e; margin-bottom: 15px;">${message}</p>
          <button class="btn btn-primary" onclick="navigateToSubjects()">Voltar para Assuntos</button>
        </div>
      `;
    }

    // Navigation Functions
    function navigateToSubjects() {
      window.location.href = 'assuntos.html';
    }

    function exitQuiz() {
      window.location.href = 'index.html';
    }

    function retryQuiz() {
      // Armazenar o assunto atual
      localStorage.setItem('selectedSubject', quizSubject);
      window.location.href = 'quiz.html';
    }

    function shareResults() {
      // Contar acertos
      let correctCount = 0;
      quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.answer) {
          correctCount++;
        }
      });

      // Criar texto para compartilhamento
      const totalQuestions = quizQuestions.length;
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
      const shareText = `🎯 Quiz Militar | ${capitalizeFirstLetter(quizSubject)}\n` +
                        `✅ Acertei ${correctCount} de ${totalQuestions} questões (${scorePercentage}%)\n` +
                        `🔗 Faça o teste você também: quizmilitar.com.br`;

      // Verificar se a API de compartilhamento está disponível
      if (navigator.share) {
        navigator.share({
          title: 'Meu resultado no Quiz Militar',
          text: shareText,
          url: 'https://quizmilitar.com.br'
        }).catch(error => {
          console.error('Erro ao compartilhar:', error);
          // Fallback
          copyToClipboard(shareText);
        });
      } else {
        // Fallback para navegadores que não suportam a API de compartilhamento
        copyToClipboard(shareText);
      }
    }

    // Helper function to copy text to clipboard
    function copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      alert('Texto copiado para a área de transferência!');
    }

    // Helper Functions
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }