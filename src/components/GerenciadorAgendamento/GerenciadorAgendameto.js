import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../header.css';
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles.css';
const GerenciadorAgendamentos = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState(() => {
    const agendamentosSalvos = localStorage.getItem('agendamentos');
    return agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];
  });
  const [descricaoAgendamento, setDescricaoAgendamento] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [vendedores, setVendedores] = useState(() => {
    const vendedoresSalvos = localStorage.getItem('vendedores');
    return vendedoresSalvos ? JSON.parse(vendedoresSalvos) : [];
  });
  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });
  const [estoque, setEstoque] = useState(() => {
    const estoqueSalvo = localStorage.getItem('estoque');
    return estoqueSalvo ? JSON.parse(estoqueSalvo) : {};
  });

  const [vendedorSelecionado, setVendedorSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
  const [indiceEdicao, setIndiceEdicao] = useState(null);

  const produtosVendedorSelecionado = vendedores.find(v => v.nome === vendedorSelecionado)?.produtos || [];

  const quantidadeDisponivel = estoque[produtoSelecionado] || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (quantidadeSelecionada > quantidadeDisponivel) {
      alert(`Quantidade solicitada (${quantidadeSelecionada}) excede o estoque disponível (${quantidadeDisponivel}).`);
      return;
    }

    const novoAgendamento = {
      descricao: descricaoAgendamento,
      data: dataAgendamento,
      vendedor: vendedorSelecionado,
      produto: produtoSelecionado,
      quantidade: quantidadeSelecionada,
    };

    if (indiceEdicao !== null) {
      const agendamentosAtualizados = agendamentos.map((agendamento, index) =>
        index === indiceEdicao ? novoAgendamento : agendamento
      );
      setAgendamentos(agendamentosAtualizados);
      setIndiceEdicao(null);
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados)); 
    } else {
      const novosAgendamentos = [...agendamentos, novoAgendamento];
      setAgendamentos(novosAgendamentos);
      localStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos)); 

      const novoEstoque = {
        ...estoque,
        [produtoSelecionado]: quantidadeDisponivel - quantidadeSelecionada,
      };
      setEstoque(novoEstoque);
      localStorage.setItem('estoque', JSON.stringify(novoEstoque)); 
    }

    setDescricaoAgendamento('');
    setDataAgendamento('');
    setVendedorSelecionado('');
    setProdutoSelecionado('');
    setQuantidadeSelecionada(1);
  };

  const handleEdit = (index) => {
    setIndiceEdicao(index);
    const agendamento = agendamentos[index];
    setDescricaoAgendamento(agendamento.descricao);
    setDataAgendamento(agendamento.data);
    setVendedorSelecionado(agendamento.vendedor);
    setProdutoSelecionado(agendamento.produto);
    setQuantidadeSelecionada(agendamento.quantidade);
  };

  const handleDelete = (index) => {
    const agendamentosAtualizados = agendamentos.filter((_, i) => i !== index);
    setAgendamentos(agendamentosAtualizados);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));
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
      <button onClick={() => navigate('/')} className="botaohome">
  Voltar para Home
</button>
    </header>
    
    
    
    {/* Título */}
    <h1 className="text-center mb-4">Gerenciador de Agendamentos</h1>

    {/* Formulário de Agendamento */}
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={descricaoAgendamento}
          onChange={(e) => setDescricaoAgendamento(e.target.value)}
          placeholder="Descrição do agendamento"
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={dataAgendamento}
          onChange={(e) => setDataAgendamento(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-3">
        <select
          className="form-select"
          value={vendedorSelecionado}
          onChange={(e) => {
            setVendedorSelecionado(e.target.value);
            setProdutoSelecionado('');
            setQuantidadeSelecionada(1);
          }}
          required
        >
          <option value="">Selecione um vendedor</option>
          {vendedores.map((vendedor, index) => (
            <option key={index} value={vendedor.nome}>
              {vendedor.nome}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-3">
        <select
          className="form-select"
          value={produtoSelecionado}
          onChange={(e) => setProdutoSelecionado(e.target.value)}
          required
          disabled={!vendedorSelecionado}
        >
          <option value="">Selecione um produto</option>
          {produtosVendedorSelecionado.map((produto, index) => (
            <option key={index} value={produto}>
              {produto}
            </option>
          ))}
        </select>
      </div>

      {produtoSelecionado && (
        <div className="mb-3">
          <label className="form-label">Quantidade disponível: {quantidadeDisponivel}</label>
          <input
            type="number"
            className="form-control"
            value={quantidadeSelecionada}
            onChange={(e) => setQuantidadeSelecionada(parseInt(e.target.value))}
            min="1"
            max={quantidadeDisponivel}
            required
          />
        </div>
      )}

      <button type="submit" className="btn btn-success w-100">
        {indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}
      </button>
    </form>

    {/* Lista de Agendamentos */}
    <h2 className="text-center mb-3">Lista de Agendamentos</h2>
    <ul className="list-group">
      {agendamentos.map((agendamento, index) => (
        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{agendamento.descricao}</strong> - {new Date(agendamento.data).toLocaleDateString()}<br />
            Vendedor: {agendamento.vendedor} - Produto: {agendamento.produto} - Quantidade: {agendamento.quantidade}
          </div>
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

export default GerenciadorAgendamentos;
