import React, { useState, useEffect } from 'react';
import SidebarAdmin from "../../components/Sidebar/SidebarAdmin";
import Header from "../../components/Header";
import { Button, Center, Spinner, FormControl, FormLabel, Input, useToast, Select } from '@chakra-ui/react';
import './Servico.css';
import axios from 'axios';

const Servico = () => {
    const [loading, setLoading] = useState(true);
    const [empresas, setEmpresas] = useState([]);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        duracao: '',
        valor: '',
        empresaId: ''
    });
    const toast = useToast();

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };

        loadData();

        axios.get('http://localhost:3001/auth/minha-empresa', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(response => {
            setEmpresas([response.data]); 
        })
        .catch(error => {
            console.error('Erro ao buscar empresa do usuário:', error);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/auth/cadastrar_servico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.text();
            if (response.ok) {
                toast({
                    title: "Serviço cadastrado com sucesso.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
                setFormData({ titulo: '', descricao: '', duracao: '', valor: '', empresaId: '' });
            } else {
                toast({
                    title: "Erro ao cadastrar serviço.",
                    description: result,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        } catch (error) {
            console.error("Erro ao cadastrar serviço:", error);
            toast({
                title: "Erro ao cadastrar serviço.",
                description: "Ocorreu um erro ao tentar cadastrar o serviço. Tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true
            });
        } finally {
            setLoading(false);
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
        <div>
            <Header />
            <SidebarAdmin />
            <div className='form-service'>
                <form className='form-format' onSubmit={handleSubmit}>
                    <h2>CADASTRAR SERVIÇO</h2>
                    <FormControl isRequired>
                        <FormLabel mt={5}>Empresa</FormLabel>
                        <Select 
                            name="empresaId"
                            value={formData.empresaId}
                            onChange={handleChange}
                            placeholder="Selecione uma empresa"
                            border='1px'
                        >
                            {empresas.map(empresa => (
                                <option key={empresa.EmpresaID} value={empresa.EmpresaID}>{empresa.Nome}</option>
                            ))}
                        </Select>
                        <FormLabel mt={5}>Titulo Serviço</FormLabel>
                        <Input 
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder='serviço'
                            border='1px'
                            type='text' 
                        />
                        <FormLabel mt={5}>Descrição</FormLabel>
                        <Input 
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder='descrição'
                            border='1px'
                            type='text' 
                        />
                        <FormLabel mt={5}>Duração do Serviço</FormLabel>
                        <Input 
                            name="duracao"
                            value={formData.duracao}
                            onChange={handleChange}
                            placeholder='ex: 30 min'
                            border='1px'
                            type='number' 
                        />
                        <FormLabel mt={5}>Valor do Serviço</FormLabel>
                        <Input 
                            name="valor"
                            value={formData.valor}
                            onChange={handleChange}
                            placeholder='ex: 50'
                            border='1px'
                            type='number' 
                        />
                        <Button 
                            mt={7} 
                            colorScheme='blue' 
                            type="submit"
                        >
                            CADASTRAR SERVIÇO
                        </Button>
                    </FormControl>
                </form>
            </div>
        </div>
    );
};

export default Servico;
