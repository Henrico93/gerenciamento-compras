import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

import GerenciadorProdutos from './components/GerenciadorProduto/GerenciadorProduto';
import GerenciadorCategorias from './components/GerenciadorCategoria/GerenciadorCategoria';
import GerenciadorListas from './components/GerenciadorLista/GerenciadorLista';
import GerenciadorVendedores from './components/GerenciadorVendedor/GerenciadorVendedor';
import GerenciadorAgendamentos from './components/GerenciadorAgendamento/GerenciadorAgendameto';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vendedores, setVendedores] = useState(() => {
    const storedVendedores = localStorage.getItem('vendedores');
    return storedVendedores ? JSON.parse(storedVendedores) : [];
  });

  useEffect(() => {
    localStorage.setItem('vendedores', JSON.stringify(vendedores));
  }, [vendedores]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} 
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
          element={isAuthenticated ? <GerenciadorVendedores vendedores={vendedores} setVendedores={setVendedores} /> : <Navigate to="/login" />} 
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
