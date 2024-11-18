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

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeAlterada, setQuantidadeAlterada] = useState(0);
  const [quantidadeRemover, setQuantidadeRemover] = useState(0);

  // Função para atualizar o estoque no localStorage e garantir que os produtos não existentes sejam removidos
  const atualizarEstoqueLocalStorage = (novoEstoque) => {
    // Filtra os produtos existentes na lista de estoque e mantém apenas aqueles que ainda estão no array de produtos
    const estoqueFiltrado = Object.keys(novoEstoque)
      .filter(produto => produtos.some(p => p.nome === produto))
      .reduce((acc, produto) => {
        acc[produto] = novoEstoque[produto];
        return acc;
      }, {});

    // Atualiza o estoque no estado e no localStorage
    setEstoque(estoqueFiltrado);
    localStorage.setItem('estoque', JSON.stringify(estoqueFiltrado));
  };

  useEffect(() => {
    const estoqueInicial = produtos.reduce((acc, produto) => {
      acc[produto.nome] = estoque[produto.nome] || 0;
      return acc;
    }, {});
    atualizarEstoqueLocalStorage(estoqueInicial);
  }, [produtos, estoque]);

  const handleEstoqueChange = (produto, tipo) => {
    let novoEstoque = estoque[produto];

    if (tipo === 'adicionar') {
      if (quantidadeAlterada <= 0 || quantidadeAlterada === '') {
        alert("Por favor, insira uma quantidade válida para adicionar.");
        return;
      }
      novoEstoque += parseInt(quantidadeAlterada, 10);
    } else if (tipo === 'remover') {
      if (quantidadeRemover <= 0 || quantidadeRemover === '') {
        alert("Por favor, insira uma quantidade válida para remover.");
        return;
      }
      if (estoque[produto] < quantidadeRemover) {
        alert('Estoque insuficiente para remoção!');
        return;
      }
      novoEstoque -= quantidadeRemover;
    }

    const novoEstoqueState = { ...estoque, [produto]: novoEstoque };
    atualizarEstoqueLocalStorage(novoEstoqueState);

    setQuantidadeAlterada(0);
    setQuantidadeRemover(0);
    setProdutoSelecionado(null);
  };

  const produtosOrdenados = [...produtos].sort((a, b) => {
    if (a.categoria < b.categoria) return -1;
    if (a.categoria > b.categoria) return 1;
    return a.nome.localeCompare(b.nome);
  });

  return (
    <div className="gerenciador-categorias-container">
      {/* Navbar */}
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

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
        {categorias.map((categoria, index) => (
          <div key={index} style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#555', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>{categoria}</h3>
            <ul style={{ padding: '0', margin: '10px 0 0', listStyle: 'none' }}>
              {produtosOrdenados
                .filter((produto) => produto.categoria === categoria)
                .map((produto, idx) => (
                  <li key={idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px', borderBottom: '1px solid #eee', backgroundColor: produtoSelecionado === produto.nome ? '#e9ecef' : ''
                  }}>
                    <span style={{ fontSize: '16px', color: '#333' }}>{produto.nome}</span>
                    <span style={{ fontSize: '16px', color: '#666', marginLeft: '20px' }}>
                      Quantidade no Estoque: {estoque[produto.nome] || 0}
                    </span>
                    <button
                      onClick={() => setProdutoSelecionado(produto.nome)}
                      style={{
                        padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer'
                      }}
                    >
                      Alterar Estoque
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {produtoSelecionado && (
        <div style={{ marginTop: '30px', backgroundColor: '#e9ecef', padding: '20px', borderRadius: '10px' }}>
          <h4>Alterar Estoque para: {produtoSelecionado}</h4>
          <div>
            <label style={{ marginRight: '10px' }}>Adicionar Quantidade:</label>
            <input
              type="number"
              value={quantidadeAlterada}
              onChange={(e) => setQuantidadeAlterada(e.target.value)}
              style={{ padding: '5px', width: '100px', marginRight: '10px' }}
              min="1"
            />
            <button
              onClick={() => handleEstoqueChange(produtoSelecionado, 'adicionar')}
              style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Adicionar ao Estoque
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label style={{ marginRight: '10px' }}>Remover Quantidade:</label>
            <input
              type="number"
              value={quantidadeRemover}
              onChange={(e) => setQuantidadeRemover(e.target.value)}
              style={{ padding: '5px', width: '100px', marginRight: '10px' }}
              min="1"
            />
            <button
              onClick={() => handleEstoqueChange(produtoSelecionado, 'remover')}
              style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Remover do Estoque
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciadorListas;
