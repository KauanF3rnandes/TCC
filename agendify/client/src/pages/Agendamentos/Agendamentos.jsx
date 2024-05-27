import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SidebarClient from "../../components/Sidebar/SidebarClient";
import axios from 'axios';
import "./Agendamentos.css";
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, Divider } from '@chakra-ui/react';

const Agendamentos = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth/listarAgendamentos', {
                    headers: {
                        'x-access-token': localStorage.getItem('token')
                    }
                });
                setAgendamentos(response.data);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };

        fetchAgendamentos();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = agendamentos.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <div>
                <Header className="testee"/>  
            </div>
            <SidebarClient />
            <div className="container-agendamentos">
                <div className="grid-container">
                    {currentItems.map(agendamento => (
                        <Card className="card-agendamentos" key={agendamento.id}>
                            <CardHeader>
                                <Heading size='md'>{agendamento.DataAgendamento}</Heading>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <Text className="card-text">Usuário: {agendamento.Usuario}</Text>
                                <Text className="card-text">Empresa: {agendamento.Empresa}</Text>
                                <Text className="card-text">Horário: {agendamento.Horario}</Text>
                                <Text className="card-text">Status: {agendamento.Status}</Text>
                            </CardBody>
                            <CardFooter>
                                <Button color={"white"} bg={"red"}>delete</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="pagination">
                    <Button color={"white"} bg="#333" mr={5} onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                    <Button color={"white"} bg="#333" onClick={nextPage} disabled={currentItems.length < itemsPerPage}>Próxima</Button>
                </div>
            </div>
        </div>
    );
};

export default Agendamentos;
