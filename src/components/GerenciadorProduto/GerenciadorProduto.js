import React, { useState, useEffect } from 'react';

// Componente principal
const GerenciadorProdutos = ({ vendedorSelecionado }) => {
  // Estado para produtos
  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });

  // Estado para categorias
  const [categorias, setCategorias] = useState(() => {
    const categoriasSalvas = localStorage.getItem('categorias');
    return categoriasSalvas ? JSON.parse(categoriasSalvas) : [];
  });

  const [nomeProduto, setNomeProduto] = useState(''); // Nome do produto
  const [descricaoProduto, setDescricaoProduto] = useState(''); // Descrição do produto
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(''); // Categoria selecionada
  const [indiceEdicao, setIndiceEdicao] = useState(null); // Índice do produto em edição

  useEffect(() => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  // Função para adicionar ou editar um produto
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nomeProduto.trim() === '' || !categoriaSelecionada || descricaoProduto.trim() === '') return; // Verifica se o produto não está vazio, se uma categoria está selecionada e se a descrição não está vazia

    if (indiceEdicao !== null) {
      const produtosAtualizados = produtos.map((produto, index) =>
        index === indiceEdicao ? { nome: nomeProduto, categoria: categoriaSelecionada, descricao: descricaoProduto, vendedor: vendedorSelecionado } : produto
      );
      setProdutos(produtosAtualizados);
      setIndiceEdicao(null);
    } else {
      setProdutos([...produtos, { nome: nomeProduto, categoria: categoriaSelecionada, descricao: descricaoProduto, vendedor: vendedorSelecionado }]);
    }
    setNomeProduto(''); // Limpar o campo de entrada
    setDescricaoProduto(''); // Limpar o campo de descrição
    setCategoriaSelecionada(''); // Limpar a categoria selecionada
  };

  // Função para iniciar a edição de um produto
  const handleEdit = (index) => {
    setIndiceEdicao(index);
    setNomeProduto(produtos[index].nome);
    setDescricaoProduto(produtos[index].descricao); // Carregar a descrição do produto
    setCategoriaSelecionada(produtos[index].categoria);
  };

  // Função para deletar um produto
  const handleDelete = (index) => {
    const produtosAtualizados = produtos.filter((_, i) => i !== index);
    setProdutos(produtosAtualizados);
  };

  return (
    <div>
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
