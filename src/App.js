import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

import GerenciadorProdutos from './components/GerenciadorProduto/GerenciadorProduto';
import GerenciadorCategorias from './components/GerenciadorCategoria/GerenciadorCategoria';
import GerenciadorListas from './components/GerenciadorLista/GerenciadorLista';
import GerenciadorVendedores from './components/GerenciadorVendedor/GerenciadorVendedor';
import GerenciadorAgendamentos from './components/GerenciadorAgendamento/GerenciadorAgendameto';


const App = () => {
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
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<GerenciadorProdutos />} />
        <Route path="/categorias" element={<GerenciadorCategorias />} />
        <Route path="/listas" element={<GerenciadorListas />} />
        <Route 
          path="/vendedores" 
          element={<GerenciadorVendedores vendedores={vendedores} setVendedores={setVendedores} />} 
        />

        <Route path="/agendamentos" element={<GerenciadorAgendamentos />} />
      </Routes>
    </Router>
  );
};

export default App;
