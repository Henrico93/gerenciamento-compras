import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div>
      <h1> Sistema de gerenciamento de Compras</h1>
      <nav>
        <ul>
          <li>
            <Link to="/produtos">Gerenciar Produtos</Link>
          </li>
          <li>
            <Link to="/categorias">Gerenciar Categorias</Link>
          </li>
          <li>
            <Link to="/listas">Gerenciar Listas</Link>
          </li>
          <li>
            <Link to="/vendedores">Gerenciar Vendedores</Link>
          </li>
          <li>
            <Link to="/agendamentos">Agendamento de Entregas</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
