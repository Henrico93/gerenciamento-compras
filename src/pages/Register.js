import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegisterSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não correspondem');
            return;
        }

        // Verifique se o localStorage já possui usuários
        const users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Usuários existentes:', users); // Debug

        const userExists = users.find(user => user.email === email);

        if (userExists) {
            alert('Este email já está cadastrado');
            return;
        }

        // Adicione o novo usuário
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Cadastro realizado com sucesso!');
        onRegisterSuccess(); // Notifica o App que o registro foi bem-sucedido
        navigate('/login'); // Redireciona para a página de login
    };

    return (
        <div className="register-container">
            <h2>Registrar</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Confirmar Senha:</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
