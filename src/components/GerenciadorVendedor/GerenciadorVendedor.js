import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import '../header.css';

import "bootstrap/dist/css/bootstrap.min.css";

const GerenciadorVendedores = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vendedores, setVendedores] = useState(() => {
    const vendedoresSalvos = localStorage.getItem('vendedores');
    return vendedoresSalvos ? JSON.parse(vendedoresSalvos) : [];
  });

  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });

  const [nomeVendedor, setNomeVendedor] = useState('');
  const [emailVendedor, setEmailVendedor] = useState('');
  const [cpfVendedor, setCpfVendedor] = useState('');
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [indiceEdicao, setIndiceEdicao] = useState(null);
  const [filtroProduto, setFiltroProduto] = useState('');

  useEffect(() => {
    localStorage.setItem('vendedores', JSON.stringify(vendedores));
  }, [vendedores]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nomeVendedor.trim() === '' || produtosSelecionados.length === 0 || emailVendedor.trim() === '' || cpfVendedor.trim() === '') return;

    if (indiceEdicao !== null) {
      const vendedoresAtualizados = vendedores.map((vendedor, index) =>
        index === indiceEdicao ? { nome: nomeVendedor, email: emailVendedor, cpf: cpfVendedor, produtos: produtosSelecionados } : vendedor
      );
      setVendedores(vendedoresAtualizados);
      setIndiceEdicao(null);
    } else {
      setVendedores([...vendedores, { nome: nomeVendedor, email: emailVendedor, cpf: cpfVendedor, produtos: produtosSelecionados }]);
    }
    setNomeVendedor('');
    setEmailVendedor('');
    setCpfVendedor('');
    setProdutosSelecionados([]);
  };

  const handleEdit = (index) => {
    setIndiceEdicao(index);
    setNomeVendedor(vendedores[index].nome);
    setEmailVendedor(vendedores[index].email);
    setCpfVendedor(vendedores[index].cpf);
    setProdutosSelecionados(vendedores[index].produtos);
  };

  const handleDelete = (index) => {
    const vendedoresAtualizados = vendedores.filter((_, i) => i !== index);
    setVendedores(vendedoresAtualizados);
  };

  const handleProductChange = (product) => {
    if (produtosSelecionados.includes(product)) {
      setProdutosSelecionados(produtosSelecionados.filter(p => p !== product));
    } else {
      setProdutosSelecionados([...produtosSelecionados, product]);
    }
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(filtroProduto.toLowerCase())
  );

  return (
    <CSSTransition in={true} timeout={300} classNames="fade" key={location.key} unmountOnExit>
      <div className="gerenciador-categorias-container">
      {/* Navbar */}
      <header className="navbar-gerenciador">
        <nav>
          <ul className="navbar-list">
            <li><Link to="/produtos" className="navbar-link">Gerenciar Produtos</Link></li>
            <li><Link to="/categorias" className="navbar-link">Gerenciar Categorias</Link></li>
            <li><Link to="/agendamentos" className="navbar-link">Agendamento de Entregas</Link></li>
            <li><Link to="/listas" className="navbar-link">Gerenciador da Lista</Link></li>
          </ul>
        </nav>
        <button onClick={() => navigate('/')} className="botao-home">Voltar para Home</button>
      </header>

        <h1 className="text-center">Gerenciador de Vendedores</h1>

        <form onSubmit={handleSubmit} className="gerenciador-vendedores-form">
          <input type="text" value={nomeVendedor} onChange={(e) => setNomeVendedor(e.target.value)} placeholder="Nome do vendedor" required />
          <input type="email" value={emailVendedor} onChange={(e) => setEmailVendedor(e.target.value)} placeholder="Email do vendedor" required />
          <input type="text" value={cpfVendedor} onChange={(e) => setCpfVendedor(e.target.value)} placeholder="CPF do vendedor" required />
          <input
            className="filtro-produtos"
            type="text"
            value={filtroProduto}
            onChange={(e) => setFiltroProduto(e.target.value)}
            placeholder="Filtrar produtos"
          />
          <div className="lista-produtos">
            {produtosFiltrados.map((produto, index) => (
              <div key={produto.id} className="produto-item">
                <input
                  type="checkbox"
                  checked={produtosSelecionados.includes(produto)}
                  onChange={() => handleProductChange(produto)}
                />
                <span>{produto.nome}</span>
              </div>
            ))}
          </div>
          <button type="submit" className="gerenciador-vendedores-button">
            {indiceEdicao !== null ? 'Editar Vendedor' : 'Adicionar Vendedor'}
          </button>
        </form>

        <ul className="vendedores-lista">
          {vendedores.map((vendedor, index) => (
            <li key={index} className="vendedores-item">
              <div>
                <h3>{vendedor.nome}</h3>
                <p>{vendedor.email}</p>
                <p>{vendedor.cpf}</p>
                <ul>
                  {vendedor.produtos.map((produto, idx) => (
                    <li key={idx}>{produto.nome}</li>
                  ))}
                </ul>
              </div>
              <div>
                <button onClick={() => handleEdit(index)} className="button-edit">Editar</button>
                <button onClick={() => handleDelete(index)} className="button-delete">Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </CSSTransition>
  );
};

export default GerenciadorVendedores;


