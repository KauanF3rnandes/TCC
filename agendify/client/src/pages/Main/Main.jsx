import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar/SidebarClient";
import { Center, Spinner, Box, Text, Button, FormControl, FormLabel, Input, Select, useDisclosure, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tooltip } from '@chakra-ui/react';
import './Main.css';
import agenda from "../../img/AgendaLogo.jpg";
import Header from "../../components/Header";
import axios from 'axios';

const Main = () => {
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [empresa, setEmpresa] = useState(null);
    const [empresaId, setEmpresaId] = useState('');
    const [data, setData] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [horarioSelecionado, setHorarioSelecionado] = useState('');
    const [servicos, setServicos] = useState([]);
    const [servicoSelecionado, setServicoSelecionado] = useState('');
    const toast = useToast();

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth/minha-empresa', {
                    headers: {
                        'x-access-token': localStorage.getItem('token')
                    }
                });
                setEmpresa(response.data);
            } catch (error) {
                console.error('Erro ao buscar empresa do usuário:', error);
            }
        };

        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };

        fetchEmpresa();
        loadData();
    }, []);

    const fetchHorarios = (empresaId, data) => {
        if (empresaId && data) {
            axios.get(`http://localhost:3001/auth/main/cliente/horarios_disponiveis?empresaId=${empresaId}&data=${data}`)
                .then(response => {
                    setHorarios(response.data);
                })
                .catch(error => {
                    console.error('Erro ao buscar horários:', error);
                });
        }
    };

    const fetchServicos = (empresaId) => {
        if (empresaId) {
            axios.get(`http://localhost:3001/auth/servicos?empresaId=${empresaId}`, {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            .then(response => {
                setServicos(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar serviços:', error);
            });
        }
    };

    const handleDataChange = (e) => {
        const selectedData = e.target.value;
        setData(selectedData);
        fetchHorarios(empresaId, selectedData);
    };

    const handleEmpresaChange = (e) => {
        const selectedEmpresaId = e.target.value;
        setEmpresaId(selectedEmpresaId);
        fetchHorarios(selectedEmpresaId, data);
        fetchServicos(selectedEmpresaId);
    };

    const handleServicoClick = (servicoId) => {
        setServicoSelecionado(servicoId);
    };

    const handleHorarioClick = (horario) => {
        setHorarioSelecionado(horario);
    };

    const handleAgendarClick = () => {
        const usuarioId = localStorage.getItem('userId');
    
        const agendamento = {
            usuarioId,
            empresaId,
            servicoId: servicoSelecionado,
            data,
            horario: horarioSelecionado
        };
    
        axios.post('http://localhost:3001/auth/agendamento', agendamento, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(response => {
                toast({
                    title: "Agendamento feito com sucesso!",
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
    
                setEmpresaId('');
                setData('');
                setServicoSelecionado('');
                setHorarioSelecionado('');
                setHorarios([]);
            })
            .catch(error => {
                console.error('Erro ao realizar agendamento:', error);
                toast({
                    title: "Erro ao realizar agendamento",
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
                setEmpresaId('');
                setData('');
                setServicoSelecionado('');
                setHorarioSelecionado('');
                setHorarios([]);
            });
    };
    

    const handleClickClose = () => {
        onClose();
        setEmpresaId('');
        setData('');
        setServicoSelecionado('');
        setHorarioSelecionado('');
        setHorarios([]);
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
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
        <div className="bgColorMain">
            <Header />
            <Sidebar />
            <div className="container-main">
                <div className="content">
                    <img src={agenda} alt="logo de calendario" />
                    <Button bg='#333' color='white' onClick={onOpen}>+ Novo agendamento</Button>
                </div>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={isOpen}
                    onClose={handleClickClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Novo Agendamento:</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={4}>
                            <FormControl mt={4}>
                                <FormLabel>Data:</FormLabel>
                                <Input
                                    border='1px'
                                    type="date"
                                    placeholder='data'
                                    value={data}
                                    onChange={handleDataChange}
                                    min={getCurrentDate()}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel mt={4}>Empresa</FormLabel>
                                <Select
                                    border='1px'
                                    placeholder="Selecione uma empresa"
                                    value={empresaId}
                                    onChange={handleEmpresaChange}
                                >
                                    <option key={empresa.EmpresaID} value={empresa.EmpresaID}>{empresa.Nome}</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel mt={4}>Serviço</FormLabel>
                                <Box>
                                    {servicos.length > 0 ? (
                                        servicos.map(servico => (
                                            <Tooltip 
                                                key={servico.ServicoID}
                                                label={`Descrição: ${servico.Descricao}\nDuração: ${servico.Duracao} minutos\nPreço: R$${servico.Preco}`}
                                                aria-label="A tooltip"
                                                whiteSpace="pre-line"
                                            >
                                                <Button
                                                    onClick={() => handleServicoClick(servico.ServicoID)}
                                                    m={1}
                                                    colorScheme={servicoSelecionado === servico.ServicoID ? 'blue' : 'gray'}
                                                >
                                                    {servico.Nome}
                                                </Button>
                                            </Tooltip>
                                        ))
                                    ) : (
                                        <Text>Nenhum serviço disponível</Text>
                                    )}
                                </Box>
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Horários Disponíveis:</FormLabel>
                                <Box>
                                    {horarios.length > 0 ? (
                                        horarios.map(horario => (
                                            <Button
                                                key={horario.Horario}
                                                onClick={() => handleHorarioClick(horario.Horario)}
                                                m={1}
                                                colorScheme={horarioSelecionado === horario.Horario ? 'blue' : 'gray'}
                                            >
                                                {horario.Horario}
                                            </Button>
                                        ))
                                    ) : (
                                        <Text>Nenhum horário disponível</Text>
                                    )}
                                </Box>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme='blue'
                                mr={3}
                                onClick={handleAgendarClick}
                                isDisabled={!empresaId || !data || !horarioSelecionado || !servicoSelecionado}
                            >
                                Agendar
                            </Button>
                            <Button onClick={handleClickClose}>Cancelar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}

export default Main;
