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
  const [filtro, setFiltro] = useState('');
  const [campoFiltro, setCampoFiltro] = useState('Selecione'); // Campo de filtro

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
    produto.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  // Função de filtragem dos vendedores com base no campo de filtro selecionado
  const vendedoresFiltrados = vendedores.filter(vendedor => {
    if (campoFiltro === 'nome') {
      return vendedor.nome.toLowerCase().includes(filtro.toLowerCase());
    }
    if (campoFiltro === 'email') {
      return vendedor.email.toLowerCase().includes(filtro.toLowerCase());
    }
    if (campoFiltro === 'cpf') {
      return vendedor.cpf.toLowerCase().includes(filtro.toLowerCase());
    }
    if (campoFiltro === 'produto') {
      return vendedor.produtos.some(produto => produto.nome.toLowerCase().includes(filtro.toLowerCase()));
    }
    return true;
  });

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
          
          <div className="lista-produtos">
            {produtosFiltrados.map((produto) => (
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

        {/* Filtros de Pesquisa */}
        <div className="form-group">
          <label>Selecione um critério de filtragem:</label>
          <select
            className="form-control"
            value={campoFiltro}
            onChange={(e) => setCampoFiltro(e.target.value)}
          >
            <option value="Selecione">Selecione...</option>
            <option value="nome">Nome do Vendedor</option>
            <option value="email">Email</option>
            <option value="cpf">CPF</option>
            <option value="produto">Produto</option>
          </select>
        </div>

        {/* Campo de filtro dinâmico */}
        {campoFiltro !== 'Selecione' && (
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder={`Digite o ${campoFiltro} para filtrar`}
            />
          </div>
        )}

        {/* Tabela de Vendedores */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome do Vendedor</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Produtos</th>
              <th>---------------------</th>
            </tr>
          </thead>
          <tbody>
            {vendedoresFiltrados.map((vendedor, index) => (
              <tr key={index}>
                <td>{vendedor.nome}</td>
                <td>{vendedor.email}</td>
                <td>{vendedor.cpf}</td>
                <td>{vendedor.produtos.map(produto => produto.nome).join(', ')}</td>
                <td>
                  <button onClick={() => handleEdit(index)} className="btn-editar">Editar</button>
                  <button onClick={() => handleDelete(index)} className="btn-deletar">Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CSSTransition>
  );
};

export default GerenciadorVendedores;
