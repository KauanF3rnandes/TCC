import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SidebarClient from "../../components/Sidebar/SidebarClient";
import axios from 'axios';
import "./Agendamentos.css";
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, Divider, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';

const Agendamentos = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const toast = useToast();
    const [agendamentoToCancel, setAgendamentoToCancel] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef();

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/auth/listarAgendamentos', {
                    headers: {
                        'x-access-token': token
                    }
                });
                setAgendamentos(response.data);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };

        fetchAgendamentos();
    }, []);

    const handleCancelAgendamento = (id) => {
        setAgendamentoToCancel(id);
        setIsOpen(true);
    };

    const cancelAgendamento = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/auth/main/admin/agendamentos/cancelar/${agendamentoToCancel}`, null, {
                headers: {
                    'x-access-token': token
                }
            });
            const updatedAgendamentos = agendamentos.map(agendamento => {
                if (agendamento.AgendamentoID === agendamentoToCancel) {
                    return { ...agendamento, Status: 'Cancelado' };
                }
                return agendamento;
            });
            setAgendamentos(updatedAgendamentos);
            toast({
                title: "Status do agendamento atualizado para Cancelado.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            console.error('Erro ao Cancelar agendamento:', error);
            toast({
                title: "Erro ao Cancelar agendamento.",
                description: "Ocorreu um erro ao tentar Cancelar o agendamento. Por favor, tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        } finally {
            setIsOpen(false);
        }
    };

    const totalPages = Math.ceil(agendamentos.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = agendamentos.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <Header className="testee"/>  
            <SidebarClient />
            <div className="container-agendamentos">
                <h1 className="title-agendamentos">SEUS AGENDAMENTOS:</h1>
                <div className="grid-container">
                    {currentItems.map(agendamento => (
                        <Card className="card-agendamentos" key={agendamento.AgendamentoID}>
                            <CardHeader>
                                <Heading size='md'>{new Date(agendamento.DataAgendamento).toLocaleDateString('pt-BR')}</Heading>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <Text className="card-text">ID: {agendamento.AgendamentoID}</Text>
                                <Text className="card-text">Usuário: {agendamento.Usuario}</Text>
                                <Text className="card-text">Empresa: {agendamento.Empresa}</Text>
                                <Text className="card-text">Horário: {agendamento.Horario}</Text>
                                <Text className="card-text">Status: {agendamento.Status}</Text>
                            </CardBody>
                            <CardFooter>
                                <Button color={"white"} bg={"red"} onClick={() => handleCancelAgendamento(agendamento.AgendamentoID)}>Excluir</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="pagination">
                    <Button color={"white"} bg="#333" mr={5} onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                    <Button color={"white"} bg="#333" onClick={nextPage} disabled={currentPage === totalPages || currentItems.length < itemsPerPage}>Próxima</Button>
                </div>
            </div>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Cancelar Agendamento
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja cancelar este agendamento?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Não
                            </Button>
                            <Button colorScheme="red" onClick={cancelAgendamento} ml={3}>
                                Sim
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
};

export default Agendamentos;
