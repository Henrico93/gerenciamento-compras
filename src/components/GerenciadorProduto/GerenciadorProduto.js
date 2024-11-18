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
  const [filtro, setFiltro] = useState('');
  const [campoFiltro, setCampoFiltro] = useState('Selecione');
  const [ordem, setOrdem] = useState({ coluna: 'nome', crescente: true });

  useEffect(() => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nomeProduto.trim() === '' || !categoriaSelecionada || descricaoProduto.trim() === '') return;

    if (indiceEdicao !== null) {
      const produtosAtualizados = produtos.map((produto, index) =>
        index === indiceEdicao
          ? { nome: nomeProduto, categoria: categoriaSelecionada, descricao: descricaoProduto, vendedor: vendedorSelecionado }
          : produto
      );
      setProdutos(produtosAtualizados);
      setIndiceEdicao(null);
    } else {
      setProdutos([
        ...produtos,
        { nome: nomeProduto, categoria: categoriaSelecionada, descricao: descricaoProduto, vendedor: vendedorSelecionado },
      ]);
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

  // Ordenação dos produtos
  const ordenarProdutos = (coluna) => {
    const novaOrdem = ordem.coluna === coluna ? !ordem.crescente : true;
    setOrdem({ coluna, crescente: novaOrdem });

    const produtosOrdenados = [...produtos].sort((a, b) => {
      if (a[coluna] < b[coluna]) return novaOrdem ? -1 : 1;
      if (a[coluna] > b[coluna]) return novaOrdem ? 1 : -1;
      return 0;
    });

    setProdutos(produtosOrdenados);
  };

  // Filtragem dinâmica baseada no critério selecionado
  const produtosFiltrados = produtos.filter((produto) => {
    if (campoFiltro === 'nome') {
      return produto.nome.toLowerCase().includes(filtro.toLowerCase());
    } else if (campoFiltro === 'descricao') {
      return produto.descricao.toLowerCase().includes(filtro.toLowerCase());
    } else if (campoFiltro === 'categoria') {
      return produto.categoria.toLowerCase().includes(filtro.toLowerCase());
    }
    return true;
  });

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

      {/* Formulário */}
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

      {/* Seção de Filtro */}
      <div className="form-group">
        <label>Selecione um critério de filtragem:</label>
        <select
          className="form-control"
          value={campoFiltro}
          onChange={(e) => setCampoFiltro(e.target.value)}
        >
          <option value="Selecione">Selecione...</option>
          <option value="nome">Nome do Produto</option>
          
          <option value="categoria">Categoria</option>
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

      {/* Tabela de Produtos */}
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => ordenarProdutos('nome')}>Nome</th>
            <th onClick={() => ordenarProdutos('descricao')}>Descrição</th>
            <th onClick={() => ordenarProdutos('categoria')}>Categoria</th>
            <th>----------------------</th>
          </tr> 
        </thead>
        <tbody>
          {produtosFiltrados.map((produto, index) => (
            <tr key={index}>
              <td>{produto.nome}</td>
              <td>{produto.descricao}</td>
              <td>{produto.categoria}</td>
              <td>
                <button onClick={() => handleEdit(index)} className="btn-editar">Editar</button>
                <button onClick={() => handleDelete(index)} className="btn-deletar">Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GerenciadorProdutos;
