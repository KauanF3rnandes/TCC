import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Button, useToast, Box, Flex, Heading } from '@chakra-ui/react';
import "./AgendamentosAdmin.css";

const AgendamentosAdmin = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [agendamentoToConfirm, setAgendamentoToConfirm] = useState(null);
    const itemsPerPage = 4;
    const toast = useToast();

    useEffect(() => {
        fetchAgendamentos();
    }, []);

    const fetchAgendamentos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/auth/main/admin/agendamentos', {
                headers: {
                    'x-access-token': token
                }
            });
            setAgendamentos(response.data);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    };

    const deleteAgendamento = async (id) => {
        console.log("ID do agendamento a ser excluído:", id);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/auth/main/admin/deletar_agendamento/${id}`, {
                headers: {
                    'x-access-token': token
                }
            });
            const updatedAgendamentos = agendamentos.filter(agendamento => agendamento.AgendamentoID !== id);
            setAgendamentos(updatedAgendamentos);
            toast({
                title: "Agendamento excluído com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
            toast({
                title: "Erro ao excluir agendamento.",
                description: "Ocorreu um erro ao tentar excluir o agendamento. Por favor, tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const handleConfirmAgendamento = async (id) => {
        setAgendamentoToConfirm(id);
        await confirmAgendamento(id); // Passe o ID diretamente
    };
    
    const confirmAgendamento = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/auth/main/admin/agendamentos/confirmar/${id}`, null, {
                headers: {
                    'x-access-token': token
                }
            });
            const updatedAgendamentos = agendamentos.map(agendamento => {
                if (agendamento.AgendamentoID === id) {
                    return { ...agendamento, Status: 'Confirmado' };
                }
                return agendamento;
            });
            setAgendamentos(updatedAgendamentos);
            toast({
                title: "Status do agendamento atualizado para Confirmado.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            console.error('Erro ao confirmar agendamento:', error);
            toast({
                title: "Erro ao confirmar agendamento.",
                description: "Ocorreu um erro ao tentar confirmar o agendamento. Por favor, tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
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
        <Box>
            <Header />  
            <Sidebar />
            <Box className="container-agendamentos" p={5}>
                <Heading as="h1" size="lg" mb={5}>AGENDAMENTOS DA EMPRESA</Heading>
                <TableContainer>
                    <Table variant="striped" colorScheme="teal">
                        <TableCaption>Lista de Agendamentos</TableCaption>
                        <Thead border='1px' bgColor={"black"}>
                            <Tr>
                                <Th color={"white"}>Data</Th>
                                <Th color={"white"}>Cliente</Th>
                                <Th color={"white"}>Serviço</Th>
                                <Th color={"white"}>Horário</Th>
                                <Th color={"white"}>Status</Th>
                                <Th color={"white"}>Ação</Th>
                            </Tr>
                        </Thead>
                        <Tbody border='1px'>
                            {currentItems.map(agendamento => (
                                <Tr key={agendamento.AgendamentoID}>
                                    <Td>{new Date(agendamento.DataAgendamento).toLocaleDateString('pt-BR')}</Td>
                                    <Td>{agendamento.Cliente}</Td>
                                    <Td>{agendamento.Servico}</Td>
                                    <Td>{agendamento.Horario}</Td>
                                    <Td>{agendamento.Status}</Td>
                                    <Td>    
                                        <Button mr={5} colorScheme="teal" onClick={() => handleConfirmAgendamento(agendamento.AgendamentoID)}>Confirmar</Button>
                                        <Button colorScheme="red" onClick={() => deleteAgendamento(agendamento.AgendamentoID)}>Excluir</Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Flex mt={5} justifyContent="space-between">
                    <Button onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                    <Button onClick={nextPage} disabled={currentPage === totalPages || currentItems.length < itemsPerPage}>Próxima</Button>
                </Flex>
            </Box>
        </Box>
    );
};

export default AgendamentosAdmin;
