import { Box, Center, InputGroup, Input, InputRightElement, Button, Text, Link, Image  } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import '../Login/Login.css'
import loginImage from '../../img/login.jpg'
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import axios, { Axios } from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [show, setShow] = useState(false);
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');

    const handleClick = () => setShow(!show);

    const handleClickRegister = () => {
        const userData = {
            email: email,
            nome: nome,
            senha: senha,
            tipoUsuario: tipoUsuario
        };
        axios.post("http://localhost:3001/auth/register", userData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error("Erro ao fazer a solicitação:", error);
            });
    };
    

    const validationRegister = () => {
        if ((!nome || !senha || !email) || (nome.length < 3 || senha.length < 3) || email.length < 3) {
            setError('Os campos são obrigatórios.');
            console.error('Os campos são obrigatórios.');
            setMsg('')
            return;
        }else{
            setError('');
            setEmail('');
            setNome('');
            setSenha('');
            setMsg('Cadastro feito com Sucesso!')
            handleClickRegister()
        }
        
    };

    return (
        <Box className="bgColor">
            <Center height="100vh">
                <Box className="background-login" display="flex" alignItems="center">
                    <Box mr="2rem">
                        <Image ml='70px' boxSize='700px' src={loginImage} alt='Login' />
                    </Box>
                    <Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Box>
                                <Text className="logoStyle">Register</Text>
                            </Box>
                            <Box>
                                <InputGroup size='md' flexDirection='column' color='black' as='b'>
                                    <Text mb='2'>E-mail</Text>
                                    <Input
                                        placeholder='exemple@exemple.com'
                                        type='email'
                                        marginBottom='1rem'
                                        border='1px'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Text mb='2'>Nome</Text>
                                    <Input
                                        placeholder='Username'
                                        type='text'
                                        marginBottom='1rem'
                                        border='1px'
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                     <Text mb='2'>tipoUsuario</Text>
                                        <Input
                                            placeholder='exemple@exemple.com'
                                            type='text'
                                            marginBottom='1rem'
                                            border='1px'
                                            value={tipoUsuario}
                                            onChange={(e) => setTipoUsuario(e.target.value)}
                                        />
                                    <Text mb='2'>Password</Text>
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
                                </InputGroup>
                                {error && <Text color="red">{error}</Text>}
                                {msg && <Text color="green">{msg}</Text>}
                                <Button type="submit" onClick={validationRegister} colorScheme='blue' mt='6'>CRIAR CONTA</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Center>
        </Box>
    );
}

export default Register;
