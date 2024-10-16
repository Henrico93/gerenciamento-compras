import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const GerenciadorListas = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });

  const [categorias, setCategorias] = useState(() => {
    const categoriasSalvas = localStorage.getItem('categorias');
    return categoriasSalvas ? JSON.parse(categoriasSalvas) : [];
  });

  const [estoque, setEstoque] = useState(() => {
    const estoqueSalvo = localStorage.getItem('estoque');
    return estoqueSalvo ? JSON.parse(estoqueSalvo) : {};
  });

  useEffect(() => {
    const estoqueInicial = produtos.reduce((acc, produto) => {
      acc[produto.nome] = estoque[produto.nome] || 0; 
      return acc;
    }, {});
    setEstoque(estoqueInicial);
  }, [estoque, produtos]);

  const handleEstoqueChange = (produto, quantidade) => {
    const novoEstoque = {
      ...estoque,
      [produto]: quantidade,
    };
    setEstoque(novoEstoque);
    localStorage.setItem('estoque', JSON.stringify(novoEstoque));
  };

  const produtosOrdenados = [...produtos].sort((a, b) => {
    if (a.categoria < b.categoria) return -1;
    if (a.categoria > b.categoria) return 1;
    return a.nome.localeCompare(b.nome);
  });

  return (
    <div>
      <header id='navegar'>
        <nav>
          <ul>
            <li><Link to="/produtos">Gerenciar Produtos</Link></li>
            <li><Link to="/categorias">Gerenciar Categorias</Link></li>
            <li><Link to="/vendedores">Gerenciar Vendedores</Link></li>
            <li><Link to="/agendamentos">Agendamento de Entregas</Link></li>
          </ul>
        </nav>
        <button onClick={() => navigate('/')}>Voltar para Home</button>
      </header>
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
