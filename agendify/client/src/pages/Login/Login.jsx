import { InputGroup, Input, InputRightElement, Button, Text, Link, Image, FormLabel, FormControl, Center, Spinner  } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import './Login.css'
import loginImage from '../../img/login.jpg'
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const handleClick = () => setShow(!show);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };

        loadData();
    }, []);

    const handleClickLogin = () => {
        const userData = {
            email: email,
            senha: senha
        };
        axios.post("http://localhost:3001/auth/login", userData)
            .then((response) => {
                if (response.data.success) {
                    const token = response.data.token;
                    localStorage.setItem('token', token);
    
                    const userRole = jwtDecode(token).role;
                    if (userRole === 'Admin') {
                        navigate('/main/admin');
                    } else {
                        navigate('/main/cliente');
                    }
                } else {
                    setError('Usuário não encontrado ou senha incorreta. Tente novamente!');
                }
            })
            .catch((error) => {
                console.error("Erro ao fazer a solicitação:", error);
                setError('Erro ao fazer login. Tente novamente mais tarde.');
            });
    };
    
    

    const RegisterPickHandler = () => {
        navigate('/register');
    }

    const validationLogin = () => {
        if (!email.trim() || !senha.trim()) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
    
        setError('');
        handleClickLogin();
    };

    if (loading) {
        return (
            <Center h="100vh">
                <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
                mr={5}
                />
                <p>Carregando...</p>
            </Center>
        );
    }

    return (
        <div className="bgLogin">
            <div className="box-login">
                <div className="img-login">
                    <img src={loginImage} alt="imagem ilustrativa login" className="login-image" />
                </div>
                <div className="form-login">
                    <div className="box-title-login">
                        <span className="title-login">LOGIN</span>
                    </div>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder='exemple@exemple.com'
                            type='email'
                            marginBottom='2rem'
                            border='1px'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                    </FormControl>

                    <FormControl>
                        <FormLabel mb='2'>Password</FormLabel>
                        <InputGroup>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Password'
                                border='1px'
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.50rem' size='sm'  onClick={handleClick}>
                                {show ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                            </Button>
                        </InputRightElement>
                        </InputGroup>
                    </FormControl>
                        <Link onClick={() => RegisterPickHandler()} fontSize='12' mt='2'>Criar uma conta</Link>
                        {error && <Text color="red">{error}</Text>}
                    <Button type="submit" onClick={validationLogin} colorScheme='blue' mt='6'>FAZER LOGIN</Button>                
                </div>
            </div>
        </div>
    );
}

export default Login;
