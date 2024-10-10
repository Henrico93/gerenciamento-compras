import React, { useState, useEffect } from 'react';

const GerenciadorListas = () => {
  // Carrega os produtos do localStorage
  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });

  // Carrega as categorias do localStorage
  const [categorias, setCategorias] = useState(() => {
    const categoriasSalvas = localStorage.getItem('categorias');
    return categoriasSalvas ? JSON.parse(categoriasSalvas) : [];
  });

  // Carrega o estoque do localStorage, ou inicia com valores vazios
  const [estoque, setEstoque] = useState(() => {
    const estoqueSalvo = localStorage.getItem('estoque');
    return estoqueSalvo ? JSON.parse(estoqueSalvo) : {};
  });

  // Atualiza o estoque ao alterar os produtos
  useEffect(() => {
    const estoqueInicial = produtos.reduce((acc, produto) => {
      acc[produto.nome] = estoque[produto.nome] || 0; // Mantém o estoque salvo ou inicia com 0
      return acc;
    }, {});
    setEstoque(estoqueInicial);
  }, [estoque, produtos]);

  // Função para atualizar o estoque de um produto e salvar no localStorage
  const handleEstoqueChange = (produto, quantidade) => {
    const novoEstoque = {
      ...estoque,
      [produto]: quantidade,
    };
    setEstoque(novoEstoque);
    localStorage.setItem('estoque', JSON.stringify(novoEstoque)); // Salva no localStorage
  };

  // Função para ordenar produtos por categoria e nome
  const produtosOrdenados = [...produtos].sort((a, b) => {
    if (a.categoria < b.categoria) return -1;
    if (a.categoria > b.categoria) return 1;
    return a.nome.localeCompare(b.nome);
  });

  return (
    <div>
      <h1>Gerenciamento de Estoque de Produtos</h1>

      <h2>Lista de Produtos</h2>
      <ul>
        {categorias.map((categoria, index) => (
          <div key={index}>
            <h3>{categoria}</h3>
            <ul>
              {produtosOrdenados
                .filter((produto) => produto.categoria === categoria)
                .map((produto, index) => (
                  <li key={index}>
                    {produto.nome}
                    <input
                      type="number"
                      value={estoque[produto.nome] || 0}
                      onChange={(e) => handleEstoqueChange(produto.nome, e.target.value)}
                      placeholder="Quantidade em estoque"
                    />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default GerenciadorListas;
