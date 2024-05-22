import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar/SidebarClient";
import { Center, Spinner, Box, Text, Button } from '@chakra-ui/react';
import './Main.css';
import agenda from "../../img/AgendaLogo.jpg";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, useDisclosure, Select } from '@chakra-ui/react';
import Header from "../../components/Header";
import axios from 'axios';

const Main = () => {
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [empresas, setEmpresas] = useState([]);
    const [empresaId, setEmpresaId] = useState('');
    const [data, setData] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [horarioSelecionado, setHorarioSelecionado] = useState('');

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

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

    const handleDataChange = (e) => {
        const selectedData = e.target.value;
        setData(selectedData);
        fetchHorarios(empresaId, selectedData);
    };

    const handleEmpresaChange = (e) => {
        const selectedEmpresaId = e.target.value;
        setEmpresaId(selectedEmpresaId);
        fetchHorarios(selectedEmpresaId, data);
    };

    const handleHorarioClick = (horario) => {
        setHorarioSelecionado(horario);
    };

    const handleAgendarClick = () => {
        if (!empresaId || !data || !horarioSelecionado) {
            alert("Por favor, selecione a empresa, a data e o horário");
            return;
        }


        console.log("Agendamento realizado:", { empresaId, data, horarioSelecionado });
        onClose();
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
        <body className="bgColorMain">
            <div>
                <Header />
            </div>
            <div>
                <Sidebar />
            </div>
            <div className="category">
                <h1>MARCAR AGENDAMENTO</h1>
            </div>
            <div className="container-main">
                <div className="content">
                    <img src={agenda} alt="logo de calendario" />
                    <Button bg='#333' color='white' onClick={onOpen}>+ Novo agendamento</Button>
                </div>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Novo Agendamento:</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={4}>
                            <FormControl mt={4}>
                                <FormLabel>Data:</FormLabel>
                                <Input border='1px' type="date" placeholder='data' value={data} onChange={handleDataChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel mt={4}>Empresa</FormLabel>
                                <Select border='1px' placeholder="Selecione uma empresa" value={empresaId} onChange={handleEmpresaChange}>
                                    {empresas.map(empresa => (
                                        <option key={empresa.EmpresaID} value={empresa.EmpresaID}>{empresa.Nome}</option>
                                    ))}
                                </Select>
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
                            <Button colorScheme='blue' mr={3} onClick={handleAgendarClick}>
                                Agendar
                            </Button>
                            <Button onClick={onClose}>Cancelar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </body>
    );
}

export default Main;
