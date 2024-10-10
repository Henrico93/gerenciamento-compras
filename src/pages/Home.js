import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  
  return (
    <div className="home-container">
      <h1 className="title">Sistema de Gerenciamento de Compras</h1>
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/produtos" className="nav-link">Gerenciar Produtos</Link>
          </li>
          <li className="nav-item">
            <Link to="/categorias" className="nav-link">Gerenciar Categorias</Link>
          </li>
          <li className="nav-item">
            <Link to="/listas" className="nav-link">Gerenciador Listas</Link>
          </li>
          <li className="nav-item">
            <Link to="/vendedores" className="nav-link">Gerenciar Vendedores</Link>
          </li>
          <li className="nav-item">
            <Link to="/agendamentos" className="nav-link">Agendamento de Entregas</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
