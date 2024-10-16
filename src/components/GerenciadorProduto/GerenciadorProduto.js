import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../header.css';

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

  return (
    <div>
      <header id='navegar'>
        <nav>
          <ul>
            <li><Link to="/categorias">Gerenciar Categorias</Link></li>
            <li><Link to="/listas">Gerenciar Listas</Link></li>
            <li><Link to="/vendedores">Gerenciar vendedores</Link></li>
            <li><Link to="/agendamentos">Agendamento de Entregas</Link></li>
          </ul>
        </nav>
        <button onClick={() => navigate('/')}>Voltar para Home</button>
      </header>

      <h1>Gerenciador de Produtos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nomeProduto}
          onChange={(e) => setNomeProduto(e.target.value)}
          placeholder="Nome do produto"
          required
        />
        <textarea
          value={descricaoProduto}
          onChange={(e) => setDescricaoProduto(e.target.value)}
          placeholder="Descrição do produto"
          required
        />
        <select
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
        <button type="submit">{indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <h2>Lista de Produtos</h2>
      <ul>
        {produtos.filter(produto => produto.vendedor === vendedorSelecionado).map((produto, index) => (
          <li key={index}>
            <div>
              <strong>{produto.nome}</strong> - {produto.categoria} 
              <p style={{ wordWrap: 'break-word', maxWidth: '400px' }}>{produto.descricao}</p>
            </div>
            <button onClick={() => handleEdit(index)}>Editar</button>
            <button onClick={() => handleDelete(index)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciadorProdutos;
