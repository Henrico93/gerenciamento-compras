import React, { useState, useEffect } from 'react';

const GerenciadorAgendamentos = () => {
  // Carrega os agendamentos do localStorage
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

  // Produtos agora são associados a vendedores
  const produtosVendedorSelecionado = vendedores.find(v => v.nome === vendedorSelecionado)?.produtos || [];

  // Função para validar se há estoque suficiente
  const quantidadeDisponivel = estoque[produtoSelecionado] || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verifica se a quantidade solicitada é maior que o estoque disponível
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
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados)); // Atualiza no localStorage
    } else {
      const novosAgendamentos = [...agendamentos, novoAgendamento];
      setAgendamentos(novosAgendamentos);
      localStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos)); // Salva no localStorage

      // Atualiza o estoque, diminuindo a quantidade selecionada
      const novoEstoque = {
        ...estoque,
        [produtoSelecionado]: quantidadeDisponivel - quantidadeSelecionada,
      };
      setEstoque(novoEstoque);
      localStorage.setItem('estoque', JSON.stringify(novoEstoque)); // Atualiza o localStorage com o estoque atualizado
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
    localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados)); // Atualiza no localStorage
  };

  return (
    <div>
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
        
        {/* Seleção do Vendedor */}
        <select
          value={vendedorSelecionado}
          onChange={(e) => {
            setVendedorSelecionado(e.target.value);
            setProdutoSelecionado(''); // Reseta o produto selecionado ao trocar o vendedor
            setQuantidadeSelecionada(1); // Reseta a quantidade
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
        
        {/* Seleção do Produto Filtrado */}
        <select
          value={produtoSelecionado}
          onChange={(e) => setProdutoSelecionado(e.target.value)}
          required
          disabled={!vendedorSelecionado} // Desabilita o select se nenhum vendedor for selecionado
        >
          <option value="">Selecione um produto</option>
          {produtosVendedorSelecionado.map((produto, index) => (
            <option key={index} value={produto}>
              {produto}
            </option>
          ))}
        </select>

        {/* Seleção da Quantidade */}
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
