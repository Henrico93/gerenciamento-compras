import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../header.css';
import "bootstrap/dist/css/bootstrap.min.css";
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
    <div className="container mt-4">
     <header style={{ marginBottom: '20px', textAlign: 'center' }}>
      <nav>
        <ul style={{ display: 'flex', justifyContent: 'space-around', padding: '0', listStyle: 'none' }}>
          <li><Link to="/produtos" style={{ color: '#007bff', textDecoration: 'none' }}>Gerenciar Produtos</Link></li>
          <li><Link to="/categorias" style={{ color: '#007bff', textDecoration: 'none' }}>Gerenciar Categorias</Link></li>
          <li><Link to="/vendedores" style={{ color: '#007bff', textDecoration: 'none' }}>Gerenciar Vendedores</Link></li>
          <li><Link to="/agendamentos" style={{ color: '#007bff', textDecoration: 'none' }}>Agendamento de Entregas</Link></li>
        </ul>
      </nav>
      <button onClick={() => navigate('/')} style={{
        backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '5px',
        marginTop: '15px'
      }}>
        Voltar para Home
      </button>
    </header>

      <h1 className="text-center">Gerenciador de Produtos</h1>

      <form onSubmit={handleSubmit} className="mb-4">
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
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">{indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <h2>Lista de Produtos</h2>
      <ul className="list-group">
        {produtos.filter(produto => produto.vendedor === vendedorSelecionado).map((produto, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{produto.nome}</strong> - {produto.categoria} 
              <p style={{ wordWrap: 'break-word', maxWidth: '400px' }}>{produto.descricao}</p>
            </div>
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(index)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default GerenciadorProdutos;
