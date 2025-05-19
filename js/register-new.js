// Importando as funções do auth-manager.js
import { supabase, signUp } from './auth-manager.js';

document.addEventListener('DOMContentLoaded', () => {
  // Obtendo os elementos do DOM
  const registerForm = document.getElementById('registerForm');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const confirmarSenhaInput = document.getElementById('confirmarSenha');
  const errorMessage = document.getElementById('errorMessage');
  const registerButton = document.getElementById('registerButton');
  const loadingOverlay = document.getElementById('loading');

  // Inicialmente, ocultamos a mensagem de erro
  errorMessage.style.display = 'none';

  // Validando a confirmação de senha em tempo real
  confirmarSenhaInput.addEventListener('input', validatePassword);
  senhaInput.addEventListener('input', validatePassword);

  function validatePassword() {
    if (senhaInput.value !== confirmarSenhaInput.value) {
      errorMessage.style.display = 'block';
      registerButton.disabled = true;
    } else {
      errorMessage.style.display = 'none';
      registerButton.disabled = false;
    }
  }

  // Função para exibir o overlay de carregamento
  function showLoading() {
    loadingOverlay.style.display = 'flex';
  }

  // Função para ocultar o overlay de carregamento
  function hideLoading() {
    loadingOverlay.style.display = 'none';
  }

  // Função para mostrar a mensagem de sucesso
  function showSuccessMessage() {
    // Limpa o formulário
    registerForm.innerHTML = `
      <div class="success-message">
        <h2>Cadastro realizado!</h2>
        <p>Aguarde Liberação.</p>
        <button id="backToLogin" class="back-button">Voltar para o login</button>
      </div>
    `;

    // Adiciona evento para o botão de voltar para o login
    document.getElementById('backToLogin').addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  }

  // Função para mostrar mensagens de erro
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  // Manipulador de evento para o envio do formulário
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Verifica se as senhas conferem
    if (senhaInput.value !== confirmarSenhaInput.value) {
      showError('As senhas não conferem.');
      return;
    }

    // Verificando se a senha tem pelo menos 8 caracteres
    if (senhaInput.value.length < 8) {
      showError('A senha deve conter pelo menos 8 caracteres.');
      return;
    }

    // Coleta os dados do formulário
    const userData = {
      nome: nomeInput.value.trim(),
      email: emailInput.value.trim(),
      senha: senhaInput.value
    };

    try {
      // Mostra o overlay de carregamento
      showLoading();

      // Registra o usuário no Supabase
      const { user, error } = await signUp(userData.email, userData.senha);

      // Se houver erro no cadastro
      if (error) {
        hideLoading();
        
        if (error.message.includes('email') || error.message.includes('mail')) {
          showError('Este email já está em uso ou é inválido.');
        } else {
          showError(`Erro ao realizar cadastro: ${error.message}`);
        }
        return;
      }

      // Após o registro bem-sucedido, armazena as informações adicionais do usuário
      const { error: profileError } = await supabase
        .from('perfis')
        .insert([
          { 
            user_id: user.id, 
            nome_completo: userData.nome,
            email: userData.email,
            status: 'pendente'  // Usuário começa com status pendente
          }
        ]);

      if (profileError) {
        hideLoading();
        showError(`Erro ao salvar perfil: ${profileError.message}`);
        return;
      }

      // Esconde o loading e exibe a mensagem de sucesso
      hideLoading();
      showSuccessMessage();

    } catch (error) {
      hideLoading();
      showError(`Ocorreu um erro inesperado: ${error.message}`);
    }
  });
});