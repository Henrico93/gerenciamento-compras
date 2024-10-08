import React, { useState, useEffect } from 'react';
import './styles.css'; // ajuste o caminho conforme a estrutura do seu projeto

// Componente principal
const GerenciadorVendedores = () => {
  const [vendedores, setVendedores] = useState(() => {
    const vendedoresSalvos = localStorage.getItem('vendedores');
    return vendedoresSalvos ? JSON.parse(vendedoresSalvos) : [];
  });

  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });

  const [nomeVendedor, setNomeVendedor] = useState(''); // Nome do vendedor
  const [emailVendedor, setEmailVendedor] = useState(''); // Email do vendedor
  const [cpfVendedor, setCpfVendedor] = useState(''); // CPF do vendedor
  const [produtosSelecionados, setProdutosSelecionados] = useState([]); // Produtos selecionados
  const [indiceEdicao, setIndiceEdicao] = useState(null); // Índice do vendedor em edição

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
    <div>
      <h1>Gerenciador de Vendedores</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nomeVendedor}
          onChange={(e) => setNomeVendedor(e.target.value)}
          placeholder="Nome do vendedor"
          required
        />
        <input
          type="email"
          value={emailVendedor}
          onChange={(e) => setEmailVendedor(e.target.value)}
          placeholder="Email do vendedor"
          required
        />
        <input
          type="text"
          value={cpfVendedor}
          onChange={(e) => setCpfVendedor(e.target.value)}
          placeholder="CPF do vendedor"
          required
        />

        <h3>Selecione os produtos que o vendedor irá vender:</h3>
        {produtos.map((produto, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`produto-${index}`} // Corrigido aqui
              value={produto.nome} // Supondo que produto tenha uma propriedade nome
              checked={produtosSelecionados.includes(produto.nome)}
              onChange={() => handleProductChange(produto.nome)}
            />
            <label htmlFor={`produto-${index}`}>{produto.nome}</label> {/* Corrigido aqui */}
          </div>
        ))}

        <button type="submit">{indiceEdicao !== null ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <h2>Lista de Vendedores</h2>
      <ul>
        {vendedores.map((vendedor, index) => (
          <li key={index}>
            {vendedor.nome} - Email: {vendedor.email} - CPF: {vendedor.cpf} - Produtos: {vendedor.produtos.join(', ')}
            <button onClick={() => handleEdit(index)}>Editar</button>
            <button onClick={() => handleDelete(index)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciadorVendedores;
