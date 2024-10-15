import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register'; // Certifique-se de que o nome do arquivo está correto

import GerenciadorProdutos from './components/GerenciadorProduto/GerenciadorProduto';
import GerenciadorCategorias from './components/GerenciadorCategoria/GerenciadorCategoria';
import GerenciadorListas from './components/GerenciadorLista/GerenciadorLista';
import GerenciadorVendedores from './components/GerenciadorVendedor/GerenciadorVendedor';
import GerenciadorAgendamentos from './components/GerenciadorAgendamento/GerenciadorAgendameto';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([
      { email: 'usuario1@teste.com', password: 'senha1' },
      { email: 'usuario2@teste.com', password: 'senha2' },
      { email: 'teste@teste.com', password: '1234' }
  ]);

  useEffect(() => {
  }, [users]);

  const handleRegister = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} 
        />
        <Route 
          path="/register" 
          element={<Register onRegister={handleRegister} />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/produtos" 
          element={isAuthenticated ? <GerenciadorProdutos /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/categorias" 
          element={isAuthenticated ? <GerenciadorCategorias /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/listas" 
          element={isAuthenticated ? <GerenciadorListas /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vendedores" 
          element={isAuthenticated ? <GerenciadorVendedores vendedores={[]} setVendedores={() => {}} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/agendamentos" 
          element={isAuthenticated ? <GerenciadorAgendamentos /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
