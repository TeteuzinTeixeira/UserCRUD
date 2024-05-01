import React, { useState, useEffect } from 'react';
import userIcon from '../assets/user-icon.png';
import emailIcon from '../assets/email-icon.png';
import passwordIcon from '../assets/password-icon.png';
import '../style/user.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function User() {
    const [data, setData] = useState({
        name: "",
        email: "",
        oldPassword: "",
        password: ""
    });

    const notifySuccess = () => toast.success("Usuário atualizado com sucesso!");
    const notifyDeleteSuccess = () => toast.success("Usuário deletado com sucesso!");
    const notifyError = (message) => toast.error(`${message}`);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:3333/${userData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                notifySuccess();
                const updatedUserData = await response.json();
                setData({
                    ...data,
                    name: updatedUserData.name,
                    email: updatedUserData.email,
                    oldPassword: "",
                    password: ""
                });
            } else {
                const errorMessage = await response.text();
                notifyError(errorMessage || response.statusText);
            }
        } catch (error) {
            notifyError(error.message);
            console.error('Erro ao enviar dados:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:3333/${userData._id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                notifyDeleteSuccess();
                setData({
                    name: "",
                    email: "",
                    oldPassword: "",
                    password: ""
                });
                setTimeout(() => {
                    window.location.href = "/cadastro";
                }, 3000);
            } else {
                const errorMessage = await response.text();
                notifyError(errorMessage || response.statusText);
            }
        } catch (error) {
            notifyError(error.message);
            console.error('Erro ao excluir usuário:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };
    
    const handleVoltar = () => {
        window.location.href = "/";
    }

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
    
        if (userData && userData._id) {
            setData({
                ...data,
                name: userData.name,
                email: userData.email,
                oldPassword: data.oldPassword || "",
                password: ""
            });
        } else {
            console.error('ID do usuário não encontrado no localStorage.');
        }
    }, []);

    return (
        <>
            <ToastContainer />
            <div className='body'>
                <div className="right-container">
                    <h2>Hello!</h2>
                    <p>Atualize suas informações</p>

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
                                <label htmlFor="oldPassword">
                                    <img src={passwordIcon} alt="password"/>
                                </label>
                                <input type="password" placeholder="Insira sua senha anterior" id="oldPassword" name="oldPassword" value={data.oldPassword} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="input-box">
                                <label htmlFor="password">
                                    <img src={passwordIcon} alt="password"/>
                                </label>
                                <input type="password" placeholder="Insira sua nova senha" id="password" name="password" value={data.password} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="button-box">
                            <button className='atualizar-button' type='submit'>Atualizar</button>
                            <button className='delete-button' type='button' onClick={handleDelete}>Deletar</button>
                        </div>
                        <button className='voltar-button' type='button' onClick={handleVoltar}>Voltar</button>
                    </form>
                </div>
                <div className="left-container">
                    <h1>USER CRUD</h1>
                </div>
            </div>
        </>
    );
}