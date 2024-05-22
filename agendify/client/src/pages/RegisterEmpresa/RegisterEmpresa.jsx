import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text} from '@chakra-ui/react';
import './RegisterEmpresa.css';
import logoRegister from '../../img/contratoLogo.avif';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { Axios } from "axios";


const RegisterEmpresa = () => {

    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const [empresa, setEmpresa] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    const handleClickRegisterEmpresa = () => {
        const userData = {
            empresa: empresa,
            email: email,
            telefone: telefone,
            cnpj: cnpj,
        };
        axios.post("http://localhost:3001/auth/cadastro_empresa", userData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error("Erro ao fazer a solicitação:", error);
            });
    };

    

    const validationRegister = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonePattern = /^[0-9]{10,11}$/; 
        const cnpjPattern = /^[0-9]{14}$/;  
    
        if (!empresa || !email || !telefone || !cnpj) {
            setError('Todos os campos são obrigatórios.');
            console.error('Todos os campos são obrigatórios.');
            setMsg('');
            return;
        }
    
        if (!emailPattern.test(email)) {
            setError('Formato de e-mail inválido.');
            console.error('Formato de e-mail inválido.');
            setMsg('');
            return;
        }
    
        if (!telefonePattern.test(telefone)) {
            setError('Formato de telefone inválido. Deve conter 10 ou 11 dígitos.');
            console.error('Formato de telefone inválido. Deve conter 10 ou 11 dígitos.');
            setMsg('');
            return;
        }
    
        if (!cnpjPattern.test(cnpj)) {
            setError('Formato de CNPJ inválido. Deve conter 14 dígitos.');
            console.error('Formato de CNPJ inválido. Deve conter 14 dígitos.');
            setMsg('');
            return;
        }
    
        setError('');
        setMsg('Cadastro feito com Sucesso!');
        handleClickRegisterEmpresa();
    };
    

    return (
        <div className="container-register">
            <div className="box-register">
                <h1 className="register-heading">Contratar Agendify</h1>
                <div className="form-register">
                    <FormControl className="control-input">
                        <FormLabel>Empresa:</FormLabel>
                        <Input 
                        className="input" 
                        type='text' 
                        placeholder='Nome Empresa'
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        />
                    </FormControl>
                    <FormControl className="control-input">
                        <FormLabel>Email:</FormLabel>
                        <Input 
                        className="input" 
                        type='email' 
                        placeholder='exemple@exemple.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl className="control-input">
                        <FormLabel>Telefone:</FormLabel>
                        <Input 
                        className="input" 
                        type='number' 
                        placeholder='Phone number'
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        />
                    </FormControl>
                    <FormControl className="control-input">
                        <FormLabel>CNPJ:</FormLabel>
                        <Input 
                        className="input" 
                        type='number' 
                        placeholder='CNPJ'
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        />
                    </FormControl>
                    {error && <Text color="red">{error}</Text>}
                    {msg && <Text color="green">{msg}</Text>}
                    <Button onClick={() => {validationRegister()}} type="submit" mt={2} bgColor={"#3a89c9"} colorScheme='blue'>Cadastrar</Button>
                </div>
            </div>
        </div>
    );
}

export default RegisterEmpresa;
