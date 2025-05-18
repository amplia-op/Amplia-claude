// register.js

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Inicializa o cliente Supabase
const SUPABASE_URL = 'https://sugcrlhmaxovtdafesak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z2NybGhtYXhvdnRkYWZlc2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MzY1NjUsImV4cCI6MjA2MzExMjU2NX0.k19ll5VVVZb4hVBLLlYjz5dBSiW8_-8_0zqoQQVR9Ww';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para verificar se o usuário já está autenticado
async function checkSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
      // Verifica se o usuário já foi aprovado pelo administrador
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('aprovado')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error('Erro ao verificar aprovação:', profileError.message);
        return;
      }
      
      if (data && data.aprovado) {
        // Usuário aprovado, redireciona para a página de assuntos
        window.location.href = 'assuntos.html';
      } else {
        // Usuário não aprovado, redireciona para página de aguardando aprovação
        window.location.href = 'aguardando-aprovacao.html';
      }
    }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error.message);
  }
}

// Função de registro com Supabase
async function registerWithSupabase(email, password, nome, loadingOverlay, registerButton, errorMessage) {
  try {
    loadingOverlay.style.display = 'flex';
    registerButton.disabled = true;
    
    // Registra o usuário com email e senha
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nome: nome
        }
      }
    });
    
    if (error) {
      errorMessage.textContent = error.message || 'Erro ao criar conta.';
      errorMessage.style.display = 'block';
      return false;
    }
    
    // Verifica se o registro foi bem-sucedido
    if (data.user) {
      // Adiciona o usuário à tabela de perfis com aprovado = false
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: data.user.id,
            email: email,
            nome: nome,
            aprovado: false,
            created_at: new Date()
          }
        ]);
      
      if (profileError) {
        console.error('Erro ao criar perfil:', profileError.message);
        errorMessage.textContent = 'Erro ao criar perfil. Tente novamente.';
        errorMessage.style.display = 'block';
        return false;
      }
      
      // Se o Supabase estiver configurado para confirmar email, exibe uma mensagem
      if (data.session === null) {
        alert('Registro realizado! Por favor, verifique seu email para confirmar sua conta. Após confirmação, um administrador irá analisar e liberar seu acesso.');
        window.location.href = 'login.html';
      } else {
        // Se não precisar de confirmação, redireciona para a página de aguardando aprovação
        alert('Registro realizado! Um administrador irá analisar e liberar seu acesso em breve.');
        window.location.href = 'aguardando-aprovacao.html';
      }
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Erro no registro:', err);
    errorMessage.textContent = 'Ocorreu um erro durante o registro. Tente novamente.';
    errorMessage.style.display = 'block';
    return false;
  } finally {
    loadingOverlay.style.display = 'none';
    registerButton.disabled = false;
  }
}

// Espera o DOM carregar completamente antes de acessar os elementos
document.addEventListener('DOMContentLoaded', function() {
  // Verifica se o formulário existe na página atual
  const registerForm = document.getElementById('registerForm');
  
  // Se o formulário existir, configura os event listeners
  if (registerForm) {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const errorMessage = document.getElementById('errorMessage');
    const registerButton = document.getElementById('registerButton');
    const loadingOverlay = document.getElementById('loading');
    
    // Verifica se já existe uma sessão ativa
    checkSession();
    
    // Manipulador do formulário de registro
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Resetar mensagem de erro
      errorMessage.style.display = 'none';
      
      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const senha = senhaInput.value;
      const confirmarSenha = confirmarSenhaInput.value;
      
      // Verifica se as senhas conferem
      if (senha !== confirmarSenha) {
        errorMessage.textContent = 'As senhas não conferem.';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Verifica o tamanho mínimo da senha
      if (senha.length < 8) {
        errorMessage.textContent = 'A senha deve ter pelo menos 8 caracteres.';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Tenta registrar com Supabase
      await registerWithSupabase(email, senha, nome, loadingOverlay, registerButton, errorMessage);
    });
    
    // Limpar mensagem de erro ao editar os campos
    if (emailInput) {
      emailInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
      });
    }
    
    if (senhaInput) {
      senhaInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
      });
    }
    
    if (confirmarSenhaInput) {
      confirmarSenhaInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
      });
    }
  } else {
    console.log('Formulário de registro não encontrado nesta página');
  }
});
