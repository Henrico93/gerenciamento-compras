import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const users = [
    { email: 'henricoarevalo@gmail.com', password: 'henrico15' },
    { email: 'hugomalaguite@gmail.com', password: 'hugo07' },
    { email: 'teste@teste.com', password: '1234' }
];

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();


        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            alert('Login realizado com sucesso!');
            onLoginSuccess(); 
            navigate('/'); 
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
        </div>
    );
};

export default Login;
