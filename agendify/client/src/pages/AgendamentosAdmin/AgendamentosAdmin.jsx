import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import axios from 'axios';
import {
    Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer,
    Button, useToast, Box, Heading, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    useDisclosure, Text, Input, InputGroup, InputRightElement, IconButton
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import "./AgendamentosAdmin.css";

const AgendamentosAdmin = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
    const [agendamentoToConfirm, setAgendamentoToConfirm] = useState(null);
    const [agendamentoToCancel, setAgendamentoToCancel] = useState(null);
    const [filterDate, setFilterDate] = useState("");
    const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure();
    const { isOpen: isCancelModalOpen, onOpen: onCancelModalOpen, onClose: onCancelModalClose } = useDisclosure();
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
            setFilteredAgendamentos(response.data);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    };

    const handleConfirmAgendamento = async () => {
        if (!agendamentoToConfirm) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/auth/main/admin/agendamentos/confirmar/${agendamentoToConfirm}`, null, {
                headers: {
                    'x-access-token': token
                }
            });
            const updatedAgendamentos = agendamentos.map(agendamento => {
                if (agendamento.AgendamentoID === agendamentoToConfirm) {
                    return { ...agendamento, Status: 'Confirmado' };
                }
                return agendamento;
            });
            setAgendamentos(updatedAgendamentos);
            setFilteredAgendamentos(updatedAgendamentos);
            toast({
                title: "Status do agendamento atualizado para Confirmado.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            onConfirmModalClose();
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

    const handleCancelAgendamento = async () => {
        if (!agendamentoToCancel) return;
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
            setFilteredAgendamentos(updatedAgendamentos);
            toast({
                title: "Status do agendamento atualizado para Cancelado.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            onCancelModalClose();
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
        }
    };

    const handleFilterChange = (event) => {
        setFilterDate(event.target.value);
    };

    const handleFilter = () => {
        const filtered = agendamentos.filter(agendamento =>
            agendamento.DataAgendamento.includes(filterDate)
        );
        setFilteredAgendamentos(filtered);
    };

    return (
        <Box>
            <Header />
            <Sidebar />
            <Box className="container-agendamentos" p={5}>
                <Heading as="h1" size="lg" mb={5}>AGENDAMENTOS DA EMPRESA</Heading>
                <InputGroup width={'auto'} mb={5}>
                    <Input
                        type="date"
                        value={filterDate}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por data"
                    />
                    <InputRightElement>
                        <IconButton
                            aria-label="Search database"
                            icon={<SearchIcon />}
                            onClick={handleFilter}
                        />
                    </InputRightElement>
                </InputGroup>
                <TableContainer border='1px' maxHeight="360px" overflowY="auto">
                    <Table variant="striped" colorScheme="teal">
                        <Thead border='1px' bgColor={"black"}>
                            <Tr>
                                <Th color={"white"}>ID</Th>
                                <Th color={"white"}>Data</Th>
                                <Th color={"white"}>Cliente</Th>
                                <Th color={"white"}>Serviço</Th>
                                <Th color={"white"}>Horário</Th>
                                <Th color={"white"}>Status</Th>
                                <Th color={"white"}>Ação</Th>
                            </Tr>
                        </Thead>
                        <Tbody border='1px'>
                            {filteredAgendamentos.map(agendamento => (
                                <Tr key={agendamento.AgendamentoID}>
                                    <Td>{agendamento.AgendamentoID}</Td>
                                    <Td>{new Date(agendamento.DataAgendamento).toLocaleDateString('pt-BR')}</Td>
                                    <Td>{agendamento.Cliente}</Td>
                                    <Td>{agendamento.Servico}</Td>
                                    <Td>{agendamento.Horario}</Td>
                                    <Td>{agendamento.Status}</Td>
                                    <Td>
                                        <Button mr={5} colorScheme="teal" onClick={() => { setAgendamentoToConfirm(agendamento.AgendamentoID); onConfirmModalOpen(); }}>Confirmar</Button>
                                        <Button colorScheme="red" onClick={() => { setAgendamentoToCancel(agendamento.AgendamentoID); onCancelModalOpen(); }}>Cancelar</Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

            <Modal isOpen={isConfirmModalOpen} onClose={onConfirmModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar Agendamento</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Tem certeza que deseja confirmar este agendamento?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleConfirmAgendamento}>Confirmar</Button>
                        <Button variant="ghost" onClick={onConfirmModalClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isCancelModalOpen} onClose={onCancelModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Cancelar Agendamento</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Tem certeza que deseja cancelar este agendamento?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={handleCancelAgendamento}>Cancelar</Button>
                        <Button variant="ghost" onClick={onCancelModalClose}>Voltar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AgendamentosAdmin;
