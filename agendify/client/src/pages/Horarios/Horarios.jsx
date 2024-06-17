import Header from '../../components/Header/index';
import SidebarAdmin from "../../components/Sidebar/SidebarAdmin";
import React, { useState, useEffect } from 'react';
import {Center,Spinner,Table,Thead,Tbody,Tr,Th,Td,TableCaption,Button,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,useToast} from '@chakra-ui/react';
import axios from 'axios';
import './Horarios.css';

const Horarios = () => {
    const [loading, setLoading] = useState(true);
    const [horarios, setHorarios] = useState([]);
    const [horarioToDelete, setHorarioToDelete] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const toast = useToast(); 

    useEffect(() => {
        const loadHorarios = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("http://localhost:3001/auth/main/cliente/horarios", {
                    headers: {
                        'x-access-token': token
                    }
                });
                setHorarios(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar horários:", error);
                setLoading(false);
            }
        };

        loadHorarios();
    }, []);

    const handleDeleteHorario = async (horarioId) => {
        setHorarioToDelete(horarioId); 
        setIsModalOpen(true); 
    };

    const confirmDeleteHorario = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/auth/main/admin/deletar_horario/${horarioToDelete}`, {
                headers: {
                    'x-access-token': token
                }
            });
            const updatedHorarios = horarios.filter(horario => horario.HorarioID !== horarioToDelete);
            setHorarios(updatedHorarios);
            closeDeleteModal(); 
            toast({
                title: "Horário excluído com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Erro ao deletar horário:", error);
            toast({
                title: "Erro ao excluir horário.",
                description: "Ocorreu um erro ao tentar excluir o horário. Por favor, tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false); 
        setHorarioToDelete(null); 
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
            <div className='container-horarios'>
                <h1 className='title-horarios'>Horários Cadastrados</h1>
                <Table border='1px' variant="simple">
                    <TableCaption>Horários cadastrados</TableCaption>
                    <Thead>
                        <Tr border='1px' bgColor='#333'>
                            <Th border='1px' color='white'>ID do Horário</Th>
                            <Th border='1px' color='white'>Data</Th>
                            <Th border='1px' color='white'>Horário</Th>
                            <Th border='1px' color='white'>Ações</Th> 
                        </Tr>
                    </Thead>
                    <Tbody>
                        {horarios.map(horario => (
                            <Tr key={horario.HorarioID}>
                                <Td border='1px'>{horario.HorarioID}</Td>
                                <Td border='1px'>{new Date(horario.Data).toLocaleDateString('pt-BR')}</Td>
                                <Td border='1px'>{horario.Horario}</Td>
                                <Td border='1px'>
                                    <Button colorScheme="red" size="sm" onClick={() => handleDeleteHorario(horario.HorarioID)}>Excluir</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>

                <Modal isOpen={isModalOpen} onClose={closeDeleteModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirmação</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Tem certeza que deseja excluir este horário?
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="red" mr={3} onClick={confirmDeleteHorario}>
                                Excluir
                            </Button>
                            <Button variant="ghost" onClick={closeDeleteModal}>Cancelar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
};

export default Horarios;
