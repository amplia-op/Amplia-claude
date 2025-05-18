      // auth-manager.js - Arquivo para gerenciar autenticação nas páginas protegidas
      // Inicializa o cliente Supabase
      // Substitua as URLs e chaves abaixo pelas suas credenciais do Supabase

	  import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
      const SUPABASE_URL = 'https://sugcrlhmaxovtdafesak.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z2NybGhtYXhvdnRkYWZlc2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MzY1NjUsImV4cCI6MjA2MzExMjU2NX0.k19ll5VVVZb4hVBLLlYjz5dBSiW8_-8_0zqoQQVR9Ww';
	  
// Função para verificar se o usuário está autenticado
async function checkAuth() {
  try {
    // Obtém a sessão atual
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao verificar autenticação:', error.message);
      return false;
    }
    
    // Se não houver sessão, o usuário não está autenticado
    if (!session) {
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao verificar autenticação:', err);
    return false;
  }
}

// Função para redirecionar usuários não autenticados para a página de splash
async function redirectIfNotAuthenticated() {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    // Redireciona para a página de splash
    window.location.href = 'splash.html';
  }
  
  return isAuthenticated;
}

// Função para obter o usuário atual
async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Erro ao obter usuário:', error.message);
      return null;
    }
    
    return user;
  } catch (err) {
    console.error('Erro ao obter usuário:', err);
    return null;
  }
}

// Função para fazer logout
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erro ao fazer logout:', error.message);
      return false;
    }
    
    // Redireciona para a página de splash após o logout
    window.location.href = 'splash.html';
    return true;
  } catch (err) {
    console.error('Erro ao fazer logout:', err);
    return false;
  }
}

// Exporta as funções para uso em outras páginas
window.authManager = {
  checkAuth,
  redirectIfNotAuthenticated,
  getCurrentUser,
  logout
};
