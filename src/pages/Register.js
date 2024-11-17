import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Importando os ícones de olho

const Register = ({ onRegisterSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);  // Estado para controlar a visibilidade da senha
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);  // Estado para a senha de confirmação
    const navigate = useNavigate();

    // Função para gerar o salt aleatório
    const generateSalt = () => {
        return bcrypt.genSaltSync(10);  // Gera o salt com um fator de complexidade
    };

    const handleSubmit = async (e) => {
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
        const userExists = users.find(user => user.email === email);

        if (userExists) {
            alert('Este email já está cadastrado');
            return;
        }

        // Criptografa a senha com bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Armazena o usuário com o hash da senha no localStorage
        users.push({ email, password: hashedPassword });
        localStorage.setItem('users', JSON.stringify(users));

        if (onRegisterSuccess) {
            onRegisterSuccess();
        }

        // Navega para a página de login após o registro
        navigate('/login');
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(prevState => !prevState);
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
                        <div className="senha-container">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                className="campo-formulario-register"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="eye-icon" onClick={togglePasswordVisibility}>
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="grupo-formulario-register mb-4">
                        <label htmlFor="confirmPassword" className="rotulo-formulario-register">Confirmar Senha:</label>
                        <div className="senha-container">
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                id="confirmPassword"
                                className="campo-formulario-register"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
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
