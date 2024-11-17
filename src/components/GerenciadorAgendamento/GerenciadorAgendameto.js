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

  const [estoque, setEstoque] = useState(() => {
    const estoqueSalvo = localStorage.getItem('estoque');
    return estoqueSalvo ? JSON.parse(estoqueSalvo) : {};
  });

  const [produtos, setProdutos] = useState([]);
  const [dataEntrega, setDataEntrega] = useState('');
  const [cliente, setCliente] = useState('');
  const [vendedorSelecionado, setVendedorSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [indiceEdicao, setIndiceEdicao] = useState(null);
  const [quantidadeDesejada, setQuantidadeDesejada] = useState(0);

  // Atualiza o estado de agendamentos no localStorage
  useEffect(() => {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    if (vendedorSelecionado) {
      const vendedor = vendedores.find(v => v.nome === vendedorSelecionado);
      if (vendedor) {
        setProdutos(vendedor.produtos);
        setProdutoSelecionado('');
      }
    }
  }, [vendedorSelecionado, vendedores]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dataEntrega || cliente.trim() === '' || produtoSelecionado === '' || vendedorSelecionado === '' || quantidadeDesejada <= 0) return;

    if (quantidadeDesejada > estoque[produtoSelecionado]) {
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

    const novoEstoque = { ...estoque, [produtoSelecionado]: estoque[produtoSelecionado] - quantidadeDesejada };
    setEstoque(novoEstoque);
    localStorage.setItem('estoque', JSON.stringify(novoEstoque));

    setDataEntrega('');
    setCliente('');
    setVendedorSelecionado('');
    setProdutoSelecionado('');
    setObservacoes('');
    setQuantidadeDesejada('');
  };

  const handleEdit = (index) => {
    const agendamento = agendamentos[index];
    setDataEntrega(agendamento.dataEntrega);
    setCliente(agendamento.cliente);
    setVendedorSelecionado(agendamento.vendedor);
    setProdutoSelecionado(agendamento.produto);
    setObservacoes(agendamento.observacoes);
    setQuantidadeDesejada(agendamento.quantidade);
    setIndiceEdicao(index);
  };

  const handleDelete = (index) => {
    const agendamento = agendamentos[index];
    const produtoAtualizado = agendamento.produto;
    const estoqueAtualizado = { ...estoque, [produtoAtualizado]: estoque[produtoAtualizado] + agendamento.quantidade };

    const novosAgendamentos = agendamentos.filter((_, i) => i !== index);
    setAgendamentos(novosAgendamentos);
    setEstoque(estoqueAtualizado);
    localStorage.setItem('estoque', JSON.stringify(estoqueAtualizado));
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

        {/* Quantidade de estoque disponível */}
        {produtoSelecionado && (
          <div className="form-group">
            <p>Quantidade em estoque: {estoque[produtoSelecionado] || 0}</p>
          </div>
        )}

        <div className="form-group">
          <input
            type="number"
            className="form-control"
            value={quantidadeDesejada}
            onChange={(e) => setQuantidadeDesejada(Number(e.target.value))}
            min="1"
            max={estoque[produtoSelecionado]}
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
        <button type="submit" className="gerenciador-vendedores-button">
          {indiceEdicao !== null ? 'Atualizar Agendamento' : 'Adicionar Agendamento'}
        </button>
      </form>

      <h2 className="text-center mt-4">Lista de Agendamentos</h2>
      <ul className="list-group mt-3">
        {agendamentos.map((agendamento, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Cliente:</strong> {agendamento.cliente} | <strong>Produto:</strong> {agendamento.produto} | <strong>Vendedor:</strong> {agendamento.vendedor} | <strong>Quantidade:</strong> {agendamento.quantidade} | <strong>Data de Entrega:</strong> {agendamento.dataEntrega}
            </div>
            <div>
              <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(index)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Remover</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciadorAgendamentos;
