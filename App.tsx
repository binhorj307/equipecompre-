import React, { useState, useEffect } from 'react';
//import { Logo } from './components/Logo';
import { User, UserRole } from './types';
//import { login, getCurrentUser, logout, findUserByIdentifier, updateUser, getUsers } from './services/authService';
import { login, getCurrentUser, logout, findUserByIdentifier, updateUser, getUsers } from './services/authService';
import RegisterForm from './components/RegisterForm';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD'>('LOGIN');
  
  // Login Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Force init users (specifically admin) if missing
    getUsers(); 
    
    const stored = getCurrentUser();
    if (stored) {
      setUser(stored);
      setView('DASHBOARD');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = login(username, password);
    if (foundUser) {
      setUser(foundUser);
      setView('DASHBOARD');
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha inválidos.');
    }
  };

  const handleRegisterSuccess = (newUser: User) => {
    // Auto login after registration
    login(newUser.username, newUser.password!);
    setUser(newUser);
    setView('DASHBOARD');
  };

  const handleUserUpdate = (updatedUser: User) => {
    // 1. Update in LocalStorage
    updateUser(updatedUser);
    // 2. Update React State to reflect changes in UI immediately
    setUser(updatedUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setView('LOGIN');
    setUsername('');
    setPassword('');
    setShowPassword(false);
  };

  const handleForgotPassword = () => {
    const identifier = prompt("Digite seu E-mail ou Nome de Usuário para recuperar sua senha:");
    
    if (identifier) {
      const found = findUserByIdentifier(identifier);
      
      if (found) {
        // Mock sending mechanism
        const msg = `
Enviamos um link de redefinição de senha para seus contatos cadastrados!
        
📧 Email: ${found.email}
📱 SMS: ${found.phone}
        
(Esta é uma simulação. Em um app real, você receberia um código.)
        `;
        alert(msg);
      } else {
        alert("Não encontramos nenhum usuário com este email ou nome de usuário.");
      }
    }
  };

  if (view === 'DASHBOARD' && user) {
    if (user.role === UserRole.ADMIN) {
      return (
        <AdminDashboard 
          currentUser={user} 
          onUserUpdate={handleUserUpdate}
          onLogout={handleLogout} 
        />
      );
    }
    return (
      <ClientDashboard 
        user={user} 
        onUserUpdate={handleUserUpdate}
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
        
        {/* Header Section */}
        <div className="bg-blue-50 p-8 text-center border-b border-blue-100">
          <div className="flex justify-center mb-4 scale-110">
            <Logo size="lg" />
          </div>
          <p className="text-blue-600 font-medium">Programa de Fidelidade Exclusivo</p>
        </div>

        <div className="p-8">
          {view === 'REGISTER' ? (
            <RegisterForm 
              onRegister={handleRegisterSuccess}
              onCancel={() => setView('LOGIN')}
            />
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">Acesse sua conta</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Usuário</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <UserRoleIcon />
                    </div>
                    <input 
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      placeholder="Seu nome de usuário"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <KeyRound size={20} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      placeholder="Sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                      Esqueci minha senha
                    </button>
                  </div>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                   <span>⚠️</span> {loginError}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                ENTRAR AGORA
              </button>

              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-gray-600 text-sm mb-2">Ainda não tem cadastro?</p>
                <button 
                  type="button"
                  onClick={() => setView('REGISTER')}
                  className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-md"
                >
                  CRIAR CONTA GRÁTIS
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const UserRoleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default App;
