/**
 * Quiz Militar - Módulo de Assuntos
 * Este arquivo gerencia as funcionalidades da página de assuntos,
 * incluindo animações, carregamento de questões e simulados.
 * 
 * As questões são carregadas de arquivos JSON específicos para cada matéria:
 * - questoes/portugues.json
 * - questoes/matematica.json
 * - questoes/geografia.json
 * - questoes/historia.json
 * - questoes/ingles.json
 */

// Caminhos para os arquivos JSON de questões
const questoesJsonPaths = {
  portugues: 'json/portugues.json',
  matematica: 'json/matematica.json',
  geografia: 'json/geografia.json',
  historia: 'json/historia.json',
  ingles: 'json/ingles.json'
};

// Dados simulados das matérias
const materias = {
  portugues: {
    nome: "Português",
    icon: "📝",
    descricao: "Gramática, interpretação de texto, literatura e redação para concursos militares.",
    totalQuestoes: 850,
    progresso: 75,
    acertos: 65,
    topicos: [
      "Interpretação de Texto",
      "Gramática",
      "Literatura",
      "Redação",
      "Compreensão Textual",
      "Figuras de Linguagem"
    ]
  },
  matematica: {
    nome: "Matemática",
    icon: "📊",
    descricao: "Álgebra, geometria, funções, trigonometria e matemática financeira.",
    totalQuestoes: 920,
    progresso: 62,
    acertos: 58,
    topicos: [
      "Álgebra",
      "Geometria",
      "Funções",
      "Trigonometria",
      "Matemática Financeira",
      "Estatística"
    ]
  },
  geografia: {
    nome: "Geografia",
    icon: "🌎",
    descricao: "Geografia física, humana, do Brasil e geopolítica mundial.",
    totalQuestoes: 680,
    progresso: 45,
    acertos: 72,
    topicos: [
      "Geografia Física",
      "Geografia Humana",
      "Geografia do Brasil",
      "Geopolítica",
      "Cartografia",
      "Urbanização"
    ]
  },
  historia: {
    nome: "História",
    icon: "📚",
    descricao: "História do Brasil, História Militar e História Geral para concursos.",
    totalQuestoes: 750,
    progresso: 58,
    acertos: 68,
    topicos: [
      "História do Brasil",
      "História Militar",
      "História Geral",
      "História Contemporânea",
      "História das Forças Armadas",
      "Conflitos Mundiais"
    ]
  },
  ingles: {
    nome: "Inglês",
    icon: "🌐",
    descricao: "Gramática, interpretação de texto e vocabulário em inglês.",
    totalQuestoes: 520,
    progresso: 38,
    acertos: 70,
    topicos: [
      "Gramática",
      "Interpretação de Texto",
      "Vocabulário",
      "Expressões Idiomáticas",
      "Verbos",
      "Preposições"
    ]
  }
};

// Configurações do simulado
const simuladoConfig = {
  totalQuestoes: 60,
  tempoDuracao: 240, // em minutos
  distribuicao: {
    portugues: 15,
    matematica: 15,
    geografia: 10,
    historia: 10,
    ingles: 10
  }
};

// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar animações
  initAnimations();
  
  // Adicionar efeito de hover nos cards
  initCardHoverEffects();
  
  // Adicionar tooltips nos botões de informação
  initTooltips();
  
  // Atualizar estatísticas de progresso
  updateProgressStats();
  
  // Verificar se os arquivos JSON estão disponíveis
  verificarDisponibilidadeQuestoes();
});

/**
 * Inicializa as animações de fade-in para elementos na página
 */
function initAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  // Observador de interseção para animar elementos quando ficarem visíveis
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observar cada elemento
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Inicializa efeitos de hover nos cards de matérias
 */
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.subject-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('card-hover');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('card-hover');
    });
  });
}

/**
 * Inicializa tooltips nos botões de informação
 */
function initTooltips() {
  const infoButtons = document.querySelectorAll('.btn-card-secondary');
  
  infoButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Encontrar a matéria relacionada ao botão
      const card = this.closest('.subject-card');
      const materiaName = card.querySelector('h3').textContent.toLowerCase();
      
      // Encontrar o código da matéria
      const materiaCode = Object.keys(materias).find(key => 
        materias[key].nome.toLowerCase() === materiaName
      );
      
      if (materiaCode) {
        showMateriaInfo(materiaCode);
      }
    });
  });
}

/**
 * Atualiza as estatísticas de progresso geral do usuário
 */
function updateProgressStats() {
  // Estatísticas simuladas
  const stats = {
    totalRespondidas: 1245,
    totalDisponiveis: 1920,
    acertos: 809,
    tempoMedio: 84 // em segundos
  };
  
  // Calcular percentuais
  const percentualRespondidas = Math.round((stats.totalRespondidas / stats.totalDisponiveis) * 100);
  const percentualAcertos = Math.round((stats.acertos / stats.totalRespondidas) * 100);
  const percentualTempo = Math.round((60 / stats.tempoMedio) * 100);
  
  // Atualizar barras de progresso
  const barras = document.querySelectorAll('.progress-bar');
  barras[0].style.width = `${percentualRespondidas}%`;
  barras[1].style.width = `${percentualAcertos}%`;
  barras[2].style.width = `${percentualTempo}%`;
  
  // Atualizar textos
  document.querySelectorAll('.progress-card')[0].querySelector('.progress-value').textContent = stats.totalRespondidas.toLocaleString();
  document.querySelectorAll('.progress-card')[0].querySelector('.progress-label').textContent = `${percentualRespondidas}% do total disponível`;
  
  document.querySelectorAll('.progress-card')[1].querySelector('.progress-value').textContent = `${percentualAcertos}%`;
  document.querySelectorAll('.progress-card')[1].querySelector('.progress-label').textContent = `${stats.acertos} de ${stats.totalRespondidas} questões`;
  
  const minutos = Math.floor(stats.tempoMedio / 60);
  const segundos = stats.tempoMedio % 60;
  document.querySelectorAll('.progress-card')[2].querySelector('.progress-value').textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;
}

/**
 * Exibe informações detalhadas sobre uma matéria
 * @param {string} materiaCode - Código da matéria
 */
function showMateriaInfo(materiaCode) {
  const materia = materias[materiaCode];
  
  if (!materia) return;
  
  // Criar modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  // Conteúdo do modal
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${materia.icon} ${materia.nome}</h2>
        <span class="close-modal">&times;</span>
      </div>
      <div class="modal-body">
        <p>${materia.descricao}</p>
        
        <h3>Tópicos Abordados</h3>
        <ul class="topicos-list">
          ${materia.topicos.map(topico => `<li>${topico}</li>`).join('')}
        </ul>
        
        <div class="modal-stats">
          <div class="modal-stat-item">
            <div class="modal-stat-value">${materia.totalQuestoes}</div>
            <div class="modal-stat-label">Questões Disponíveis</div>
          </div>
          <div class="modal-stat-item">
            <div class="modal-stat-value">${materia.progresso}%</div>
            <div class="modal-stat-label">Progresso</div>
          </div>
          <div class="modal-stat-item">
            <div class="modal-stat-value">${materia.acertos}%</div>
            <div class="modal-stat-label">Taxa de Acerto</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-card btn-card-primary" onclick="loadQuestions('${materiaCode}')">Começar a Praticar</button>
      </div>
    </div>
  `;
  
  // Adicionar modal ao corpo do documento
  document.body.appendChild(modal);
  
  // Exibir modal com animação
  setTimeout(() => {
    modal.classList.add('modal-visible');
  }, 10);
  
  // Configurar evento de fechamento
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('modal-visible');
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  });
  
  // Fechar modal ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('modal-visible');
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    }
  });
}

/**
 * Carrega questões de uma matéria específica
 * @param {string} materiaCode - Código da matéria
 */
function loadQuestions(materiaCode) {
  // Salvando matéria selecionada no localStorage
  localStorage.setItem('selectedMateria', materiaCode);
  
  // Exibir tela de carregamento
  showLoadingScreen();
  
  // Carregar as questões do arquivo JSON correspondente
  fetch(questoesJsonPaths[materiaCode])
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro ao carregar questões: ${response.status}`);
      }
      return response.json();
    })
    .then(questoes => {
      // Armazenar as questões no localStorage para uso nas páginas seguintes
      localStorage.setItem('questoesMateria', JSON.stringify(questoes));
      
      // Redirecionando para a página de questões
      window.location.href = `questoes.html?materia=${materiaCode}`;
    })
    .catch(error => {
      console.error('Erro:', error);
      showErrorMessage('Não foi possível carregar as questões. Tente novamente mais tarde.');
      hideLoadingScreen();
    });
}

/**
 * Inicia um simulado completo
 */
function loadSimulado() {
  // Salvando configuração do simulado no localStorage
  localStorage.setItem('simuladoConfig', JSON.stringify(simuladoConfig));
  
  // Exibir tela de carregamento
  showLoadingScreen();
  
  // Carregar questões de todas as matérias para o simulado
  const promises = Object.keys(simuladoConfig.distribuicao).map(materia => {
    return fetch(questoesJsonPaths[materia])
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar questões de ${materia}: ${response.status}`);
        }
        return response.json();
      });
  });
  
  // Quando todas as questões estiverem carregadas
  Promise.all(promises)
    .then(resultados => {
      // Processar questões para o simulado
      const questoesSimulado = processarQuestoesSimulado(resultados);
      
      // Armazenar as questões do simulado no localStorage
      localStorage.setItem('questoesSimulado', JSON.stringify(questoesSimulado));
      
      // Redirecionando para a página de simulado
      window.location.href = 'simulado.html';
    })
    .catch(error => {
      console.error('Erro:', error);
      showErrorMessage('Não foi possível carregar o simulado. Tente novamente mais tarde.');
      hideLoadingScreen();
    });
}

/**
 * Processa as questões para o simulado com base na distribuição configurada
 * @param {Array} resultados - Array com as questões de cada matéria
 * @returns {Array} Questões selecionadas para o simulado
 */
function processarQuestoesSimulado(resultados) {
  const questoesSimulado = [];
  let materiaIndex = 0;
  
  // Para cada matéria na distribuição
  Object.entries(simuladoConfig.distribuicao).forEach(([materia, quantidade], index) => {
    const questoesMateria = resultados[index];
    
    // Embaralhar questões da matéria
    const questoesEmbaralhadas = embaralharArray([...questoesMateria]);
    
    // Selecionar a quantidade definida na distribuição
    const questoesSelecionadas = questoesEmbaralhadas.slice(0, quantidade);
    
    // Adicionar metadados da matéria a cada questão
    questoesSelecionadas.forEach(questao => {
      questao.materia = materia;
      questao.materiaNome = materias[materia].nome;
      questao.materiaIcon = materias[materia].icon;
    });
    
    // Adicionar às questões do simulado
    questoesSimulado.push(...questoesSelecionadas);
  });
  
  // Embaralhar todas as questões do simulado
  return embaralharArray(questoesSimulado);
}

/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 * @param {Array} array - Array a ser embaralhado
 * @returns {Array} Array embaralhado
 */
function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Exibe tela de carregamento
 */
function showLoadingScreen() {
  // Criar elemento de loading
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  
  loadingScreen.innerHTML = `
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <p>Carregando questões...</p>
    </div>
  `;
  
  // Adicionar ao documento
  document.body.appendChild(loadingScreen);
  
  // Exibir com animação
  setTimeout(() => {
    loadingScreen.classList.add('loading-visible');
  }, 10);
}

/**
 * Esconde a tela de carregamento
 */
function hideLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.remove('loading-visible');
    setTimeout(() => {
      document.body.removeChild(loadingScreen);
    }, 300);
  }
}

/**
 * Exibe mensagem de erro
 * @param {string} message - Mensagem de erro
 */
function showErrorMessage(message) {
  // Criar elemento de erro
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  
  errorMessage.innerHTML = `
    <div class="error-content">
      <div class="error-icon">❌</div>
      <p>${message}</p>
      <button class="btn-card btn-card-primary">OK</button>
    </div>
  `;
  
  // Adicionar ao documento
  document.body.appendChild(errorMessage);
  
  // Exibir com animação
  setTimeout(() => {
    errorMessage.classList.add('error-visible');
  }, 10);
  
  // Configurar botão para fechar
  const okButton = errorMessage.querySelector('button');
  okButton.addEventListener('click', () => {
    errorMessage.classList.remove('error-visible');
    setTimeout(() => {
      document.body.removeChild(errorMessage);
    }, 300);
  });
}

/**
 * Verifica se os arquivos JSON de questões estão disponíveis
 */
function verificarDisponibilidadeQuestoes() {
  // Verificar cada arquivo JSON
  Object.entries(questoesJsonPaths).forEach(([materia, path]) => {
    fetch(path, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          console.warn(`Arquivo de questões para ${materia} não encontrado: ${path}`);
          disabilitarMateria(materia);
        }
      })
      .catch(error => {
        console.warn(`Erro ao verificar arquivo de questões para ${materia}:`, error);
        disabilitarMateria(materia);
      });
  });
}

/**
 * Desabilita uma matéria caso o arquivo de questões não esteja disponível
 * @param {string} materiaCode - Código da matéria
 */
function disabilitarMateria(materiaCode) {
  // Encontrar o card da matéria
  const cards = document.querySelectorAll('.subject-card');
  let card = null;
  
  cards.forEach(c => {
    const titulo = c.querySelector('h3');
    if (titulo && titulo.textContent.toLowerCase() === materias[materiaCode].nome.toLowerCase()) {
      card = c;
    }
  });
  
  if (card) {
    // Adicionar classe para estilo de desabilitado
    card.classList.add('subject-disabled');
    
    // Desabilitar o botão de prática
    const praticaBtn = card.querySelector('.btn-card-primary');
    if (praticaBtn) {
      praticaBtn.textContent = 'Em breve';
      praticaBtn.href = 'javascript:void(0)';
      praticaBtn.removeAttribute('onclick');
      praticaBtn.classList.add('btn-disabled');
      praticaBtn.addEventListener('click', e => {
        e.preventDefault();
        alert(`As questões de ${materias[materiaCode].nome} estarão disponíveis em breve!`);
      });
    }
  }
}

// Exportar funções para uso global
window.loadQuestions = loadQuestions;
window.loadSimulado = loadSimulado;
