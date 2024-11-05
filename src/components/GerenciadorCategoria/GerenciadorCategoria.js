import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

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
    <div className="container my-4">
      {/* Navbar */}
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
      
      {/* Título */}
      <h1 className="text-center mb-4">Gerenciador de Categorias</h1>

      {/* Formulário de Categoria */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
            placeholder="Nome da categoria"
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          {indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}
        </button>
      </form>

      {/* Lista de Categorias */}
      <h2 className="text-center mb-3">Lista de Categorias</h2>
      <ul className="list-group">
        {categorias.map((categoria, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{categoria}</span>
            <div>
              <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(index)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GerenciadorCategorias;
