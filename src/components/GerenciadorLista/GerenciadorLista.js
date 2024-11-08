import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css';
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
    <div >
    <header className="navbar-gerenciador">
  <nav>
    <ul className="navbar-list">
      <li><Link to="/produtos" className="navbar-link">Gerenciar Produtos</Link></li>
      <li><Link to="/categorias" className="navbar-link">Gerenciar Categorias</Link></li>
      <li><Link to="/vendedores" className="navbar-link">Gerenciar Vendedores</Link></li>
      <li><Link to="/agendamentos" className="navbar-link">Agendamento de Entregas</Link></li>
    </ul>
  </nav>
  <button onClick={() => navigate('/')} className="botao-home">Voltar para Home</button>
</header>

    <h1 style={{ textAlign: 'center', color: '#333', fontSize: '24px', marginBottom: '30px' }}>Gerenciamento de Estoque de Produtos</h1>

    <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px' }}>
      {categorias.map((categoria, index) => (
        <div key={index} style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#555', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>{categoria}</h3>
          <ul style={{ padding: '0', margin: '10px 0 0', listStyle: 'none' }}>
            {produtosOrdenados
              .filter((produto) => produto.categoria === categoria)
              .map((produto, idx) => (
                <li key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px', borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '16px', color: '#333' }}>{produto.nome}</span>
                  <input
                    type="number"
                    value={estoque[produto.nome] || 0}
                    onChange={(e) => handleEstoqueChange(produto.nome, e.target.value)}
                    style={{ width: '60px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                    placeholder="Qtd"
                  />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);
}
export default GerenciadorListas;
