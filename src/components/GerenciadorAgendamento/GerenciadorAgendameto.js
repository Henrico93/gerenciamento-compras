import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../header.css';
import "bootstrap/dist/css/bootstrap.min.css";


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
      <header className="navbar-gerenciador">
        <nav>
          <ul className="navbar-list">
            <li><Link to="/produtos" className="navbar-link">Gerenciar Produtos</Link></li>
            <li><Link to="/categorias" className="navbar-link">Gerenciar Categorias</Link></li>
            <li><Link to="/vendedores" className="navbar-link">Gerenciar Vendedores</Link></li>
            <li><Link to="/agendamentos" className="navbar-link">Agendamento de Entregas</Link></li>
          </ul>
        </nav>
        <button className="botao-home" onClick={() => navigate('/')}>Voltar para Home</button>
      </header>

      <div className="container mt-4">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">Agendamento de Entregas</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="descricaoAgendamento" className="form-label">Descrição</label>
                <input
                  type="text"
                  id="descricaoAgendamento"
                  className="form-control"
                  value={descricaoAgendamento}
                  onChange={(e) => setDescricaoAgendamento(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dataAgendamento" className="form-label">Data do Agendamento</label>
                <input
                  type="date"
                  id="dataAgendamento"
                  className="form-control"
                  value={dataAgendamento}
                  onChange={(e) => setDataAgendamento(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="vendedorSelecionado" className="form-label">Vendedor</label>
                <select
                  id="vendedorSelecionado"
                  className="form-select"
                  value={vendedorSelecionado}
                  onChange={(e) => setVendedorSelecionado(e.target.value)}
                  required
                >
                  <option value="">Selecione um vendedor</option>
                  {vendedores.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.nome}>{vendedor.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="produtoSelecionado" className="form-label">Produto</label>
                <select
                  id="produtoSelecionado"
                  className="form-select"
                  value={produtoSelecionado}
                  onChange={(e) => setProdutoSelecionado(e.target.value)}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {produtosVendedorSelecionado.map((produto) => (
                    <option key={produto} value={produto}>{produto}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantidadeSelecionada" className="form-label">Quantidade</label>
                <input
                  type="number"
                  id="quantidadeSelecionada"
                  className="form-control"
                  value={quantidadeSelecionada}
                  onChange={(e) => setQuantidadeSelecionada(Number(e.target.value))}
                  min="1"
                  max={quantidadeDisponivel}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success mt-4">{indiceEdicao !== null ? 'Atualizar Agendamento' : 'Adicionar Agendamento'}</button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <h2>Agendamentos Cadastrados</h2>
        <div className="list-group">
          {agendamentos.map((agendamento, index) => (
            <div key={index} className="list-group-item">
              <strong>{agendamento.descricao}</strong><br />
              {agendamento.data}<br />
              {agendamento.vendedor}<br />
              {agendamento.produto}<br />
              Quantidade: {agendamento.quantidade}<br />
              <button className="btn btn-primary btn-sm" onClick={() => handleEdit(index)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Deletar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GerenciadorAgendamentos;
