import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';  
import { CSSTransition } from 'react-transition-group';

import '../header.css';
import '../styles.css';
import "bootstrap/dist/css/bootstrap.min.css";

const GerenciadorVendedores = () => {
  const navigate = useNavigate();  
  const location = useLocation(); // Pega a localização atual
  const [vendedores, setVendedores] = useState(() => {
    const vendedoresSalvos = localStorage.getItem('vendedores');
    return vendedoresSalvos ? JSON.parse(vendedoresSalvos) : [];
  });

  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });

  const [nomeVendedor, setNomeVendedor] = useState(''); 
  const [emailVendedor, setEmailVendedor] = useState(''); 
  const [cpfVendedor, setCpfVendedor] = useState(''); 
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [indiceEdicao, setIndiceEdicao] = useState(null); 

  useEffect(() => {
    localStorage.setItem('vendedores', JSON.stringify(vendedores));
  }, [vendedores]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nomeVendedor.trim() === '' || produtosSelecionados.length === 0 || emailVendedor.trim() === '' || cpfVendedor.trim() === '') return;

    if (indiceEdicao !== null) {
      const vendedoresAtualizados = vendedores.map((vendedor, index) =>
        index === indiceEdicao ? { nome: nomeVendedor, email: emailVendedor, cpf: cpfVendedor, produtos: produtosSelecionados } : vendedor
      );
      setVendedores(vendedoresAtualizados);
      setIndiceEdicao(null);
    } else {
      setVendedores([...vendedores, { nome: nomeVendedor, email: emailVendedor, cpf: cpfVendedor, produtos: produtosSelecionados }]);
    }
    setNomeVendedor('');
    setEmailVendedor('');
    setCpfVendedor('');
    setProdutosSelecionados([]);
  };

  const handleEdit = (index) => {
    setIndiceEdicao(index);
    setNomeVendedor(vendedores[index].nome);
    setEmailVendedor(vendedores[index].email);
    setCpfVendedor(vendedores[index].cpf);
    setProdutosSelecionados(vendedores[index].produtos);
  };

  const handleDelete = (index) => {
    const vendedoresAtualizados = vendedores.filter((_, i) => i !== index);
    setVendedores(vendedoresAtualizados);
  };

  const handleProductChange = (product) => {
    if (produtosSelecionados.includes(product)) {
      setProdutosSelecionados(produtosSelecionados.filter(p => p !== product));
    } else {
      setProdutosSelecionados([...produtosSelecionados, product]);
    }
  };

  return (
    <CSSTransition
      in={true} // Sempre que o componente é renderizado
      timeout={300}
      classNames="fade"
      key={location.key} // Adiciona uma chave única para forçar a animação
      unmountOnExit
    >
      <div className="container mt-4">
        <header style={{ marginBottom: '20px', textAlign: 'center' }}>
          <nav>
            <ul style={{ display: 'flex', justifyContent: 'space-around', padding: '0', listStyle: 'none' }}>
              <li><Link to="/produtos" style={{ color: '#007bff', textDecoration: 'none' }}>Gerenciar Produtos</Link></li>
              <li><Link to="/categorias" style={{ color: '#007bff', textDecoration: 'none' }}>Gerenciar Categorias</Link></li>
              <li><Link to="/vendedores" style={{ color: '#007bff', textDecoration: 'none' }}>Gerenciar Vendedores</Link></li>
              <li><Link to="/agendamentos" style={{ color: '#007bff', textDecoration: 'none' }}>Agendamento de Entregas</Link></li>
            </ul>
          </nav>
          <button onClick={() => navigate('/')} style={{
            backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '5px',
            marginTop: '15px'
          }}>
            Voltar para Home
          </button>
        </header>

        <div className="content">
          <h1 className="text-center">Gerenciador de Vendedores</h1>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={nomeVendedor}
                onChange={(e) => setNomeVendedor(e.target.value)}
                placeholder="Nome do vendedor"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                value={emailVendedor}
                onChange={(e) => setEmailVendedor(e.target.value)}
                placeholder="Email do vendedor"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={cpfVendedor}
                onChange={(e) => setCpfVendedor(e.target.value)}
                placeholder="CPF do vendedor"
                required
              />
            </div>

            <h3>Selecione os produtos que o vendedor irá vender:</h3>
            {produtos.map((produto, index) => (
              <div key={index} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`produto-${index}`} 
                  value={produto.nome} 
                  checked={produtosSelecionados.includes(produto.nome)}
                  onChange={() => handleProductChange(produto.nome)}
                />
                <label className="form-check-label" htmlFor={`produto-${index}`}>{produto.nome}</label>
              </div>
            ))}

            <button className="btn btn-primary" type="submit">{indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}</button>
          </form>

          <h2>Lista de Vendedores</h2>
          <ul className="list-group">
            {vendedores.map((vendedor, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {vendedor.nome} - Email: {vendedor.email} - CPF: {vendedor.cpf} - Produtos: {vendedor.produtos.join(', ')}
                <div>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(index)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Deletar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CSSTransition>
  );
};

export default GerenciadorVendedores;
