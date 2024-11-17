import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Importando os ícones de olho

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);  // Estado para controlar a visibilidade da senha
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);

        if (user) {
            // Compara a senha informada com o hash armazenado usando bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                onLoginSuccess();
                navigate('/');  // Navega para a página inicial
            } else {
                alert('Credenciais inválidas');
            }
        } else {
            alert('Usuário não encontrado');
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    return (
        <div className="login-container">
            <div className="cartao">
                <h2 className="titulo-login text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grupo-formulario mb-3">
                        <label htmlFor="email" className="rotulo-formulario">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="campo-formulario"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grupo-formulario mb-4">
                        <label htmlFor="password" className="rotulo-formulario">Senha:</label>
                        <div className="senha-container">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                className="campo-formulario"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="eye-icon" onClick={togglePasswordVisibility}>
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="botao-login">Entrar</button>
                </form>
                <p className="texto-registro text-center mt-3">
                    Não tem uma conta?{" "}
                    <button onClick={handleRegisterClick} className="botao-registro-link">
                        Registre-se
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
