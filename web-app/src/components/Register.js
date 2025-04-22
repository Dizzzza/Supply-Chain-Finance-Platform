import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [entityName, setEntityName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        // Валидация полей
        if (!username.trim()) {
            setError('Имя пользователя обязательно');
            return;
        }

        if (!email.trim()) {
            setError('Email обязателен');
            return;
        }

        if (!entityName.trim()) {
            setError('Название компании обязательно');
            return;
        }

        if (password.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        console.log('Отправка формы с данными:', {
            username,
            email,
            entityName,
            password: '***'
        });

        const result = await register({ 
            username, 
            email, 
            password,
            entityName
        });
        
        console.log('Результат регистрации:', result);
        
        if (result.success) {
            setSuccess(result.message);
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setEntityName('');
            // Перенаправляем на страницу входа после успешной регистрации
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Регистрация</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Название компании:</label>
                    <input
                        type="text"
                        value={entityName}
                        onChange={(e) => setEntityName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Подтвердите пароль:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register; 