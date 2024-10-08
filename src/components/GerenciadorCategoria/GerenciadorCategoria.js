import React, { useState, useEffect } from 'react';

const GerenciadorCategorias = () => {
  const [categorias, setCategorias] = useState(() => {
    // Carrega as categorias do local storage ao iniciar o componente
    const categoriasSalvas = localStorage.getItem('categorias');
    return categoriasSalvas ? JSON.parse(categoriasSalvas) : [];
  });
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [indiceEdicao, setIndiceEdicao] = useState(null);

  // Salva as categorias no local storage sempre que elas mudarem
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
    <div>
      <h1>Gerenciador de Categorias</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nomeCategoria}
          onChange={(e) => setNomeCategoria(e.target.value)}
          placeholder="Nome da categoria"
          required
        />
        <button type="submit">{indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <h2>Lista de Categorias</h2>
      <ul>
        {categorias.map((categoria, index) => (
          <li key={index}>
            {categoria}
            <button onClick={() => handleEdit(index)}>Editar</button>
            <button onClick={() => handleDelete(index)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciadorCategorias;
