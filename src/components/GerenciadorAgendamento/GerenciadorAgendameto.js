import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../header.css';

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
    <div>
      <header id='navegar'>
        <nav>
          <ul>
            <li><Link to='/produtos'>Gerenciar Produtos</Link></li>
            <li><Link to="/categorias">Gerenciar Categorias</Link></li>
            <li><Link to="/listas">Gerenciar Listas</Link></li>
            <li><Link to='/vendedores'>Gerenciar Vendedores</Link></li>
          </ul>
        </nav>
        <button onClick={() => navigate('/')}>Voltar para Home</button>
      </header>
      <h1>Gerenciador de Agendamentos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={descricaoAgendamento}
          onChange={(e) => setDescricaoAgendamento(e.target.value)}
          placeholder="Descrição do agendamento"
          required
        />
        <input
          type="date"
          value={dataAgendamento}
          onChange={(e) => setDataAgendamento(e.target.value)}
          required
        />
        
        <select
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
        
        <select
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

        {produtoSelecionado && (
          <div>
            <label>Quantidade disponível: {quantidadeDisponivel}</label>
            <input
              type="number"
              value={quantidadeSelecionada}
              onChange={(e) => setQuantidadeSelecionada(parseInt(e.target.value))}
              min="1"
              max={quantidadeDisponivel}
              required
            />
          </div>
        )}

        <button type="submit">{indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <h2>Lista de Agendamentos</h2>
      <ul>
        {agendamentos.map((agendamento, index) => (
          <li key={index}>
            {agendamento.descricao} - {new Date(agendamento.data).toLocaleDateString()} - Vendedor: {agendamento.vendedor} - Produto: {agendamento.produto} - Quantidade: {agendamento.quantidade}
            <button onClick={() => handleEdit(index)}>Editar</button>
            <button onClick={() => handleDelete(index)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciadorAgendamentos;
