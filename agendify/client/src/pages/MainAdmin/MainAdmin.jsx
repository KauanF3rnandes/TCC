import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import SidebarClient from "../../components/Sidebar/SidebarAdmin";
import { FormControl, FormLabel, Select, Button } from '@chakra-ui/react';
import { Input, Center, Spinner } from '@chakra-ui/react';
import './MainAdmin.css';
import axios from 'axios';

const MainAdmin = () => {
    const [loading, setLoading] = useState(true);
    const [empresas, setEmpresas] = useState([]);
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');
    const [empresaId, setEmpresaId] = useState('');

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };

        loadData();

        axios.get('http://localhost:3001/auth/main/admin/empresas')
            .then(response => {
                setEmpresas(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar empresas:', error);
            });
    }, []);

    const handleCadastroHorario = () => {
        axios.post('http://localhost:3001/auth/main/admin/cadastrar_horario', {
            empresaId,
            data,
            horario
        })
        .then(response => {
            alert(response.data);
        })
        .catch(error => {
            console.error('Erro ao cadastrar horário:', error);
            alert('Erro ao cadastrar horário');
        });
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
        <div>
            <div>
                <Header />
            </div>
            <div>
                <SidebarClient />
            </div>
            <div className="form-ctnr">
                <FormControl className="form-format">
                    <h2>Cadastrar Horário</h2>
                    <FormLabel mt={5}>Data</FormLabel>
                    <Input border='1px' type='date' value={data} onChange={(e) => setData(e.target.value)} />

                    <FormLabel mt={5}>Horário</FormLabel>
                    <Input border='1px' type='time' value={horario} onChange={(e) => setHorario(e.target.value)} />

                    <FormLabel mt={5}>Empresa</FormLabel>
                    <Select border='1px' placeholder="Selecione uma empresa" value={empresaId} onChange={(e) => setEmpresaId(e.target.value)}>
                        {empresas.map(empresa => (
                            <option key={empresa.EmpresaID} value={empresa.EmpresaID}>{empresa.Nome}</option>
                        ))}
                    </Select>
                    <Button type="button" mt={5} colorScheme='blue' onClick={handleCadastroHorario}>ADICIONAR</Button>
                </FormControl>
            </div>
        </div>
    );
}

export default MainAdmin;
