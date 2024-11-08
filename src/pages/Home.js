import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Atraso de 100ms para a animação de entrada

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`home-container ${isVisible ? 'visible' : ''}`}>
      <div className="home-title-container">
        <h1 className="home-title">Sistema de Gerenciamento de Compras</h1>
      </div>
      <nav>
        <ul className="home-nav-list">
          <li className="home-nav-item">
            <Link to="/produtos" className="home-nav-link">Gerenciar Produtos</Link>
          </li>
          <li className="home-nav-item">
            <Link to="/categorias" className="home-nav-link">Gerenciar Categorias</Link>
          </li>
          <li className="home-nav-item">
            <Link to="/listas" className="home-nav-link">Gerenciador Listas</Link>
          </li>
          <li className="home-nav-item">
            <Link to="/vendedores" className="home-nav-link">Gerenciar Vendedores</Link>
          </li>
          <li className="home-nav-item">
            <Link to="/agendamentos" className="home-nav-link">Agendamento de Entregas</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
