import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css';

const GerenciadorCategorias = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState(() => {
    const categoriasSalvas = localStorage.getItem('categorias');
    return categoriasSalvas ? JSON.parse(categoriasSalvas) : [];
  });
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [indiceEdicao, setIndiceEdicao] = useState(null);

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (indiceEdicao !== null) {
      const categoriasAtualizadas = categorias.map((categoria, index) =>
        index === indiceEdicao ? nomeCategoria : categoria
      );
      setCategorias(categoriasAtualizadas);
      setIndiceEdicao(null);
    } else {
      setCategorias([...categorias, nomeCategoria]);
    }
    setNomeCategoria('');
  };

  const handleEdit = (index) => {
    setIndiceEdicao(index);
    setNomeCategoria(categorias[index]);
  };

  const handleDelete = (index) => {
    const categoriasAtualizadas = categorias.filter((_, i) => i !== index);
    setCategorias(categoriasAtualizadas);
  };

  return (
    <div className="gerenciador-categorias-container">
      {/* Navbar */}
      <header className="navbar-gerenciador">
        <nav>
          <ul className="navbar-list">
            <li><Link to="/produtos" className="navbar-link">Gerenciar Produtos</Link></li>
            <li><Link to="/vendedores" className="navbar-link">Gerenciar Vendedores</Link></li>
            <li><Link to="/agendamentos" className="navbar-link">Agendamento de Entregas</Link></li>
            <li><Link to="/listas" className="navbar-link">Gerenciador da Lista</Link></li>
          </ul>
        </nav>
        <button onClick={() => navigate('/')} className="botao-home">Voltar para Home</button>
      </header>

      {/* Título */}
      <h1 className="titulo-gerenciador text-center mb-4">Gerenciador de Categorias</h1>

      {/* Formulário de Categoria */}
      <form onSubmit={handleSubmit} className="form-categoria card p-3 shadow-sm mb-4 mx-auto">
        <div className="mb-3">
          <input
            type="text"
            className="input-categoria form-control"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
            placeholder="Nome da categoria"
            required
          />
        </div>
        <button type="submit" className="btn-submit w-100">
          {indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}
        </button>
      </form>

      {/* Lista de Categorias */}
      <h2 className="titulo-lista text-center mb-3">Lista de Categorias</h2>
      <ul className="list-group categorias-list mx-auto">
        {categorias.map((categoria, index) => (
          <li key={index} className="list-group-item categoria-item d-flex justify-content-between align-items-center">
            <span>{categoria}</span>
            <div>
              <button className="btn-editar" onClick={() => handleEdit(index)}>Editar</button>
              <button className="btn-deletar" onClick={() => handleDelete(index)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciadorCategorias;
