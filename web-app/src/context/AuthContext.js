import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Используем именованный импорт

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                const decoded = jwtDecode(token); // Декодируем токен
                setUser({
                    token,
                    user_id: decoded.user_id,
                    username: decoded.username,
                    role_type: decoded.role_type,
                    entity_id: decoded.entity_id
                });
            } catch (error) {
                console.error('Ошибка при декодировании токена:', error);
                localStorage.removeItem('token'); // Удаляем некорректный токен
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3003/auth/login', {
                username,
                password
            });

            if (response.data.token) {
                const { token } = response.data;
                localStorage.setItem('userToken', token);

                const decoded = jwtDecode(token); // Декодируем токен
                setUser({
                    token,
                    user_id: decoded.user_id,
                    username: decoded.username,
                    role_type: decoded.role_type,
                    entity_id: decoded.entity_id
                });

                return { success: true };
            } else if (response.data.needsVerification) {
                return {
                    success: false,
                    message: 'Пожалуйста, подтвердите свой email перед входом. Проверьте свою почту.'
                };
            } else {
                return { 
                    success: false, 
                    message: 'Неверный ответ от сервера' 
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Ошибка при входе' 
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('Отправляемые данные:', userData);
            
            // Проверяем наличие всех необходимых полей
            const requestData = {
                username: userData.username,
                password: userData.password,
                email: userData.email,
                role: userData.role,
                entityName: userData.entityName,
                description: userData.description
            };

            console.log('Подготовленные данные для отправки:', requestData);

            const response = await axios.post('http://localhost:3003/auth/register', requestData);
            
            console.log('Ответ сервера:', response.data);
            
            if (response.status === 201) {
                return { 
                    success: true,
                    message: 'Регистрация успешна'
                };
            } else {
                return { 
                    success: false, 
                    message: response.data?.message || 'Неверный ответ от сервера' 
                };
            }
        } catch (error) {
            console.error('Детали ошибки регистрации:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Ошибка при регистрации';
            return { 
                success: false, 
                message: errorMessage 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 