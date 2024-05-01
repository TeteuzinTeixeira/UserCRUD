import React, { useState } from 'react';
import userIcon from '../assets/user-icon.png';
import emailIcon from '../assets/email-icon.png';
import passwordIcon from '../assets/password-icon.png';
import '../style/form.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default function Cadastro() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const notifySuccess = () => toast.success("Usuario cadastrado com sucesso!");
    const notifyError = (message) => toast.error(`${message}`);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch('http://localhost:3333/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                notifySuccess();
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000);
            } else {
                const errorMessage = await response.text();
                notifyError(errorMessage || response.statusText);
            }
        } catch (error) {
            notifyError(error.message);
            console.error('Erro ao enviar dados:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    return (
        <>
            <ToastContainer />
            <div className='body'>
                <div className="left-container">
                    <h1>USER CRUD</h1>
                </div>
            
                <div className="right-container">
                    <h2>Hello!</h2>
                    <p>Faça seu cadastro</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <div className="input-box">
                                <label htmlFor="name">
                                    <img src={userIcon} alt="user"/>
                                </label>
                                <input type="text" placeholder="Insira seu nome Completo" id="name" name="name" value={data.name} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="input-box">
                                <label htmlFor="email">
                                    <img src={emailIcon} alt="email"/>
                                </label>
                                <input type="email" placeholder="Insira seu email" id="email" name="email" value={data.email} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="input-box">
                                <label htmlFor="password">
                                    <img src={passwordIcon} alt="password"/>
                                </label>
                                <input type="password" placeholder="Insira sua senha" id="password" name="password" value={data.password} onChange={handleChange} autocomplete="off"/>
                            </div>
                        </div>
                        <Link to="/">
                            <p>Efetue seu login</p>
                        </Link>
                        <button className='login-button' type='submit'>Cadastre-se</button>
                    </form>
                </div>
            </div>
        </>
    );
}
