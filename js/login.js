// Inicializa o cliente Supabase
// Substitua as URLs e chaves abaixo pelas suas credenciais do Supabase
 
	  import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
      const SUPABASE_URL = 'https://sugcrlhmaxovtdafesak.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z2NybGhtYXhvdnRkYWZlc2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MzY1NjUsImV4cCI6MjA2MzExMjU2NX0.k19ll5VVVZb4hVBLLlYjz5dBSiW8_-8_0zqoQQVR9Ww';
	  
    document.addEventListener('DOMContentLoaded', function() {
      const loginForm = document.getElementById('loginForm');
      const emailInput = document.getElementById('email');
      const senhaInput = document.getElementById('senha');
      const errorMessage = document.getElementById('errorMessage');
      const loginButton = document.getElementById('loginButton');
      const loadingOverlay = document.getElementById('loading');
      const resetPasswordLink = document.getElementById('resetPasswordLink');
      
      // Verifica se já existe uma sessão ativa
      checkSession();
      
      // Função para verificar se o usuário já está autenticado
      async function checkSession() {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (session) {
            // Se o usuário já estiver logado, redireciona para a página de assuntos
            window.location.href = 'assuntos.html';
          }
        } catch (error) {
          console.error('Erro ao verificar sessão:', error.message);
        }
      }
      
      // Função de login com Supabase
      async function loginWithSupabase(email, password) {
        try {
          loadingOverlay.style.display = 'flex';
          loginButton.disabled = true;
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });
          
          if (error) {
            errorMessage.textContent = error.message || 'Email ou senha incorretos. Tente novamente.';
            errorMessage.style.display = 'block';
            return false;
          }
          
          if (data.session) {
            // Login bem-sucedido
            return true;
          }
        } catch (err) {
          console.error('Erro no login:', err);
          errorMessage.textContent = 'Ocorreu um erro durante o login. Tente novamente.';
          errorMessage.style.display = 'block';
          return false;
        } finally {
          loadingOverlay.style.display = 'none';
          loginButton.disabled = false;
        }
      }
      
      // Manipulador do formulário de login
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Resetar mensagem de erro
        errorMessage.style.display = 'none';
        
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        
        // Tenta fazer login com Supabase
        const loginSuccess = await loginWithSupabase(email, senha);
        
        if (loginSuccess) {
          // Redireciona para a página de assuntos após login bem-sucedido
          window.location.href = 'assuntos.html';
        }
      });
      
      // Resetar senha (esqueceu a senha)
      resetPasswordLink.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
          errorMessage.textContent = 'Digite seu email para redefinir a senha.';
          errorMessage.style.display = 'block';
          return;
        }
        
        try {
          loadingOverlay.style.display = 'flex';
          
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
          });
          
          if (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
          } else {
            alert('Enviamos um email com instruções para redefinir sua senha.');
          }
        } catch (err) {
          console.error('Erro ao solicitar redefinição de senha:', err);
          errorMessage.textContent = 'Erro ao solicitar redefinição de senha. Tente novamente.';
          errorMessage.style.display = 'block';
        } finally {
          loadingOverlay.style.display = 'none';
        }
      });
      
      // Limpar mensagem de erro ao editar os campos
      emailInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
      });
      
      senhaInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
      });
    });
