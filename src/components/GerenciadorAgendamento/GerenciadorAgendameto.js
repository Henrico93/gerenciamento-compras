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

  const [criterioFiltro, setCriterioFiltro] = useState(''); // Critério de filtragem selecionado
  const [valorFiltro, setValorFiltro] = useState(''); // Valor para o filtro (cliente, produto, etc.)

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

  const filtrarAgendamentos = () => {
    return agendamentos.filter(agendamento => {
      if (criterioFiltro === '') return true;

      switch (criterioFiltro) {
        case 'cliente':
          return agendamento.cliente.toLowerCase().includes(valorFiltro.toLowerCase());
        case 'produto':
          return agendamento.produto.toLowerCase().includes(valorFiltro.toLowerCase());
        case 'data':
          return agendamento.dataEntrega === valorFiltro;
        case 'vendedor':
          return agendamento.vendedor.toLowerCase().includes(valorFiltro.toLowerCase());
        default:
          return true;
      }
    });
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
        {/* Formulário de Agendamento */}
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
        <button type="submit" className="btn btn-primary">{indiceEdicao !== null ? 'Editar' : 'Adicionar'} Agendamento</button>
      </form>

      {/* Filtros de Pesquisa */}
      <div className="form-group">
        <label>Selecione um critério de filtragem:</label>
        <select
          className="form-control"
          value={criterioFiltro}
          onChange={(e) => setCriterioFiltro(e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="cliente">Cliente</option>
          <option value="produto">Produto</option>
          <option value="data">Data</option>
          <option value="vendedor">Vendedor</option>
        </select>
      </div>
      {criterioFiltro && (
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={valorFiltro}
            onChange={(e) => setValorFiltro(e.target.value)}
            placeholder={`Digite o ${criterioFiltro}`}
          />
        </div>
      )}

      {/* Tabela de Agendamentos */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Data de Entrega</th>
            <th>Vendedor</th>
            <th>Observações</th>
            <th>---------------------</th>
          </tr>
        </thead>
        <tbody>
          {filtrarAgendamentos().map((agendamento, index) => (
            <tr key={index}>
              <td>{agendamento.cliente}</td>
              <td>{agendamento.produto}</td>
              <td>{agendamento.quantidade}</td>
              <td>{agendamento.dataEntrega}</td>
              <td>{agendamento.vendedor}</td>
              <td>{agendamento.observacoes}</td>
              <td>
                <button onClick={() => handleEdit(index)} className="btn-editar">Editar</button>
                <button onClick={() => handleDelete(index)} className="btn-deletar">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GerenciadorAgendamentos;
