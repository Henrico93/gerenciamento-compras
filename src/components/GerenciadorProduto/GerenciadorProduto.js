import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../header.css';
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css';

const GerenciadorProdutos = ({ vendedorSelecionado }) => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });

  const [categorias, setCategorias] = useState(() => {
    const categoriasSalvas = localStorage.getItem('categorias');
    return categoriasSalvas ? JSON.parse(categoriasSalvas) : [];
  });

  const [nomeProduto, setNomeProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [indiceEdicao, setIndiceEdicao] = useState(null);
  const [filtro, setFiltro] = useState('');  // Novo estado para o filtro

  useEffect(() => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nomeProduto.trim() === '' || !categoriaSelecionada || descricaoProduto.trim() === '') return;

    if (indiceEdicao !== null) {
      const produtosAtualizados = produtos.map((produto, index) =>
        index === indiceEdicao ? { nome: nomeProduto, categoria: categoriaSelecionada, descricao: descricaoProduto, vendedor: vendedorSelecionado } : produto
      );
      setProdutos(produtosAtualizados);
      setIndiceEdicao(null);
    } else {
      setProdutos([...produtos, { nome: nomeProduto, categoria: categoriaSelecionada, descricao: descricaoProduto, vendedor: vendedorSelecionado }]);
    }
    setNomeProduto('');
    setDescricaoProduto('');
    setCategoriaSelecionada('');
  };

  const handleEdit = (index) => {
    setIndiceEdicao(index);
    setNomeProduto(produtos[index].nome);
    setDescricaoProduto(produtos[index].descricao);
    setCategoriaSelecionada(produtos[index].categoria);
  };

  const handleDelete = (index) => {
    const produtosAtualizados = produtos.filter((_, i) => i !== index);
    setProdutos(produtosAtualizados);
  };

  // Função para filtrar produtos
  const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div className="gerenciador-categorias-container">
      {/* Navbar */}
      <header className="navbar-gerenciador">
        <nav>
          <ul className="navbar-list">
            <li><Link to="/categorias" className="navbar-link">Gerenciar Categorias</Link></li>
            <li><Link to="/vendedores" className="navbar-link">Gerenciar Vendedores</Link></li>
            <li><Link to="/agendamentos" className="navbar-link">Agendamento de Entregas</Link></li>
            <li><Link to="/listas" className="navbar-link">Gerenciador da Lista</Link></li>
          </ul>
        </nav>
        <button onClick={() => navigate('/')} className="botao-home">Voltar para Home</button>
      </header>

      <h1 className="text-center">Gerenciador de Produtos</h1>

      <form onSubmit={handleSubmit} className="gerenciador-produtos-form">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            placeholder="Nome do produto"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            value={descricaoProduto}
            onChange={(e) => setDescricaoProduto(e.target.value)}
            placeholder="Descrição do produto"
            required
          />
        </div>
        <div className="form-group">
          <select
            className="form-control"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="gerenciadorprodutosbotao">
          {indiceEdicao !== null ? 'Atualizar Produto' : 'Adicionar Produto'}
        </button>
      </form>

      <div className="filtro-container">
        <input
          type="text"
          className="form-control filtro-input"
          placeholder="Filtrar por nome do produto"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="list-group-produtos">
        {produtosFiltrados.map((produto, index) => (
          <div key={index} className="list-group-produtos-item">
            <div>
              <h5>{produto.nome}</h5>
              <p>{produto.descricao}</p>
              <p><strong>Categoria:</strong> {produto.categoria}</p>
              <p><strong>Vendedor:</strong> {produto.vendedor}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(index)} className="btn btn-warning">Editar</button>
              <button onClick={() => handleDelete(index)} className="btn btn-danger">Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GerenciadorProdutos;
