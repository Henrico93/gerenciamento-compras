import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        // Obtenha os usuários do localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            alert('Login realizado com sucesso!');
            onLoginSuccess(); // Notifica o App que o login foi bem-sucedido
            navigate('/'); // Redireciona para a página home
        } else {
            alert('Credenciais inválidas');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
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
                <button type="submit">Entrar</button>
            </form>
            <p>
                Não tem uma conta? <button onClick={onRegisterClick}>Registre-se</button>
            </p>
        </div>
    );
};

export default Login;
