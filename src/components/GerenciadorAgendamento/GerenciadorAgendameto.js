import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css';

const GerenciadorAgendamentos = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState(() => {
    const agendamentosSalvos = localStorage.getItem('agendamentos');
    return agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];
  });

  const [vendedores, setVendedores] = useState(() => {
    const vendedoresSalvos = localStorage.getItem('vendedores');
    return vendedoresSalvos ? JSON.parse(vendedoresSalvos) : [];
  });

  const [produtos, setProdutos] = useState([]);
  const [dataEntrega, setDataEntrega] = useState('');
  const [cliente, setCliente] = useState('');
  const [vendedorSelecionado, setVendedorSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [indiceEdicao, setIndiceEdicao] = useState(null);
  const [filtroAgendamento, setFiltroAgendamento] = useState('');
  const [estoqueProdutoSelecionado, setEstoqueProdutoSelecionado] = useState(0);
  const [quantidadeDesejada, setQuantidadeDesejada] = useState(0);

  // Atualiza o estado de agendamentos no localStorage
  useEffect(() => {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  // Filtra os produtos quando o vendedor é selecionado
  useEffect(() => {
    if (vendedorSelecionado) {
      const vendedor = vendedores.find(v => v.nome === vendedorSelecionado);
      if (vendedor) {
        setProdutos(vendedor.produtos);
        setProdutoSelecionado('');  // Reseta o produto selecionado quando o vendedor muda
        setEstoqueProdutoSelecionado(0);  // Reseta o estoque
      }
    }
  }, [vendedorSelecionado, vendedores]);

  // Atualiza o estoque do produto selecionado
  useEffect(() => {
    if (produtoSelecionado && vendedorSelecionado) {
      const vendedor = vendedores.find(v => v.nome === vendedorSelecionado);
      const produto = vendedor?.produtos.find(p => p.nome === produtoSelecionado);

      // Somente atualiza o estoque se houver alteração no estoque
      if (produto && produto.estoque !== estoqueProdutoSelecionado) {
        setEstoqueProdutoSelecionado(produto.estoque);
      }
    }
  }, [produtoSelecionado, vendedorSelecionado, vendedores, estoqueProdutoSelecionado]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dataEntrega || cliente.trim() === '' || produtoSelecionado === '' || vendedorSelecionado === '' || quantidadeDesejada <= 0) return;

    if (quantidadeDesejada > estoqueProdutoSelecionado) {
      alert('A quantidade desejada excede o estoque disponível!');
      return;
    }

    const novoAgendamento = { dataEntrega, cliente, vendedor: vendedorSelecionado, produto: produtoSelecionado, observacoes, quantidade: quantidadeDesejada };

    if (indiceEdicao !== null) {
      const agendamentosAtualizados = agendamentos.map((agendamento, index) =>
        index === indiceEdicao ? novoAgendamento : agendamento
      );
      setAgendamentos(agendamentosAtualizados);
      setIndiceEdicao(null);
    } else {
      setAgendamentos([...agendamentos, novoAgendamento]);
    }

    // Atualiza o estoque do produto selecionado, subtraindo apenas a quantidade desejada
    const vendedorAtualizado = vendedores.map(vendedor => {
      if (vendedor.nome === vendedorSelecionado) {
        vendedor.produtos = vendedor.produtos.map(produto => {
          if (produto.nome === produtoSelecionado) {
            produto.estoque -= quantidadeDesejada;  // Subtrai a quantidade desejada do estoque
          }
          return produto;
        });
      }
      return vendedor;
    });

    setVendedores(vendedorAtualizado);
    localStorage.setItem('vendedores', JSON.stringify(vendedorAtualizado));

    // Resetar campos
    setDataEntrega('');
    setCliente('');
    setVendedorSelecionado('');
    setProdutoSelecionado('');
    setObservacoes('');
    setQuantidadeDesejada(0);
  };

  const handleEdit = (index) => {
    const agendamento = agendamentos[index];
    setDataEntrega(agendamento.dataEntrega);
    setCliente(agendamento.cliente);
    setVendedorSelecionado(agendamento.vendedor);
    setProdutoSelecionado(agendamento.produto);
    setObservacoes(agendamento.observacoes);
    setQuantidadeDesejada(agendamento.quantidade);  // Preenche a quantidade desejada ao editar
    setIndiceEdicao(index);
  };

  const handleDelete = (index) => {
    const agendamentosAtualizados = agendamentos.filter((_, i) => i !== index);
    setAgendamentos(agendamentosAtualizados);
  };

  const agendamentosFiltrados = agendamentos.filter(agendamento =>
    agendamento.produto.toLowerCase().includes(filtroAgendamento.toLowerCase())
  );

  return (
    <div className="gerenciador-categorias-container">
      <header className="navbar-gerenciador">
        <nav>
          <ul className="navbar-list">
            <li><Link to="/produtos" className="navbar-link">Gerenciar Produtos</Link></li>
            <li><Link to="/categorias" className="navbar-link">Gerenciar Categorias</Link></li>
            <li><Link to="/vendedores" className="navbar-link">Gerenciar Vendedores</Link></li>
            <li><Link to="/agendamentos" className="navbar-link">Agendamento de Entregas</Link></li>
            <li><Link to="/listas" className="navbar-link">Gerenciador da Lista</Link></li>
          </ul>
        </nav>
        <button onClick={() => navigate('/')} className="botao-home">Voltar para Home</button>
      </header>

      <h1 className="text-center">Gerenciador de Agendamentos</h1>

      <form onSubmit={handleSubmit} className="gerenciador-agendamentos-form">
        <div className="form-group">
          <input
            type="date"
            className="form-control"
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nome do Cliente"
            required
          />
        </div>
        <div className="form-group">
          <select
            className="form-control"
            value={vendedorSelecionado}
            onChange={(e) => setVendedorSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um vendedor</option>
            {vendedores.map((vendedor, index) => (
              <option key={index} value={vendedor.nome}>{vendedor.nome}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            className="form-control"
            value={produtoSelecionado}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um produto</option>
            {produtos.map((produto, index) => (
              <option key={index} value={produto.nome}>{produto.nome}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          {estoqueProdutoSelecionado > 0 ? (
            <p>Estoque disponível: {estoqueProdutoSelecionado}</p>
          ) : (
            <p>Produto sem estoque disponível</p>
          )}
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control"
            value={quantidadeDesejada}
            onChange={(e) => setQuantidadeDesejada(Number(e.target.value))}
            min="1"
            max={estoqueProdutoSelecionado}
            placeholder="Quantidade desejada"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Observações"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {indiceEdicao !== null ? 'Atualizar Agendamento' : 'Adicionar Agendamento'}
        </button>
      </form>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Filtrar agendamentos"
          className="filter-input"
          value={filtroAgendamento}
          onChange={(e) => setFiltroAgendamento(e.target.value)}
        />
      </div>

      <h2>Agendamentos</h2>
      <ul className="agendamentos-list">
        {agendamentosFiltrados.map((agendamento, index) => (
          <li key={index} className="agendamento-item">
            <p><strong>Cliente:</strong> {agendamento.cliente}</p>
            <p><strong>Produto:</strong> {agendamento.produto}</p>
            <p><strong>Vendedor:</strong> {agendamento.vendedor}</p>
            <p><strong>Data de Entrega:</strong> {agendamento.dataEntrega}</p>
            <p><strong>Quantidade:</strong> {agendamento.quantidade}</p>
            <p><strong>Observações:</strong> {agendamento.observacoes}</p>
            <button onClick={() => handleEdit(index)} className="btn btn-warning">Editar</button>
            <button onClick={() => handleDelete(index)} className="btn btn-danger">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciadorAgendamentos;
