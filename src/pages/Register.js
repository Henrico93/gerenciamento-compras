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

        const users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Usuários existentes:', users);

        const userExists = users.find(user => user.email === email);

        if (userExists) {
            alert('Este email já está cadastrado');
            return;
        }

        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));

        onRegisterSuccess();
        navigate('/login');
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <div className="cartao-register">
                <h2 className="titulo-register text-center mb-4">Registrar</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grupo-formulario-register mb-3">
                        <label htmlFor="email" className="rotulo-formulario-register">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="campo-formulario-register"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grupo-formulario-register mb-3">
                        <label htmlFor="password" className="rotulo-formulario-register">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            className="campo-formulario-register"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grupo-formulario-register mb-4">
                        <label htmlFor="confirmPassword" className="rotulo-formulario-register">Confirmar Senha:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="campo-formulario-register"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="botao-register">Registrar</button>
                </form>
                <p className="texto-login-register text-center mt-3">
                    Já tem uma conta?{" "}
                    <button onClick={handleBackToLogin} className="botao-login-link">
                        Faça login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
