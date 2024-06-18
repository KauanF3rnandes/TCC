import { InputGroup, Input, InputRightElement, Button, FormLabel, FormControl, Center, Spinner, Select } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import '../Login/Login.css'
import loginImage from '../../img/login.jpg'
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [show, setShow] = useState(false);
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [empresas, setEmpresas] = useState([]);
    const [empresaId, setEmpresaId] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };

        loadData();

        console.log('Buscando empresas...');
        axios.get('http://localhost:3001/auth/main/admin/empresas')
        .then(response => {
            console.log('Empresas recebidas:', response.data);
            setEmpresas(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar empresas:', error);
        });
    }, []);

    const handleEmpresaChange = (e) => {
        const selectedEmpresaId = e.target.value;
        setEmpresaId(selectedEmpresaId);
    };

    const handleClickRegister = () => {
        const userData = {
            email: email,
            nome: nome,
            senha: senha,
            telefone: telefone,
            empresaId: empresaId 
        };
        axios.post("http://localhost:3001/auth/register", userData)
            .then((response) => {
                console.log(response);
                toast({
                    title: "Cadastro feito com Sucesso",
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                navigate('/login')
            })
            .catch((error) => {
                console.error("Erro ao fazer a solicitação:", error);
                toast({
                    title: "Erro ao fazer a solicitação",
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
            });
    };
    

    const validationRegister = () => {
        if ((!nome || !senha || !email || !telefone) || (nome.length < 3 || senha.length < 3) || email.length < 3 || telefone.length < 10) {
            toast({
                title: "Os campos são obrigatórios!",
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            console.error('Os campos são obrigatórios.');
            return;
        }else{
            setEmail('');
            setNome('');
            setSenha('');
            setTelefone('');
            handleClickRegister()
        }
        
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
        <div className="box-register">
            <div className="img-login">
                <img src={loginImage} alt="imagem ilustrativa login" className="login-image" />
            </div>
            <div className="form-login">
                <div className="box-title-login">
                    <span className="title-login">REGISTER</span>
                </div>
                <FormControl>
                    <FormLabel>Nome</FormLabel>
                    <Input
                        placeholder='ex: nome completo'
                        type='text'
                        marginBottom='1rem'
                        border='1px'
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Telefone</FormLabel>
                    <Input
                        placeholder='ex: 44998357481'
                        type='number'
                        marginBottom='1rem'
                        border='1px'
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder='exemple@exemple.com'
                        type='email'
                        marginBottom='1rem'
                        border='1px'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Password</FormLabel>
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
                            <Button h='1.50rem' size='sm' onClick={handleClick}>
                                {show ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl>
                    <FormLabel mt={4}>Empresa</FormLabel>
                        <Select border='1px' placeholder="Selecione uma empresa" value={empresaId} onChange={handleEmpresaChange}>
                            {empresas.map(empresa => (
                            <option key={empresa.EmpresaID} value={empresa.EmpresaID}>{empresa.Nome}</option>
                            ))}
                        </Select>
                
                </FormControl>
                <Button type="submit" onClick={validationRegister} colorScheme='blue' mt='6' mb='6'>CADASTRAR CONTA</Button>
            </div>
        </div>
    </div>
    );
}

export default Register;
