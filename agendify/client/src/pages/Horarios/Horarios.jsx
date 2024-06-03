import Header from '../../components/Header/index';
import SidebarAdmin from "../../components/Sidebar/SidebarAdmin";
import React, { useState, useEffect } from 'react';
import { Center, Spinner, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import axios from 'axios';
import './Horarios.css';

const Horarios = () => {
    const [loading, setLoading] = useState(true);
    const [horarios, setHorarios] = useState([]);

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
            <Header/>
            <SidebarAdmin/>
            <div className='container-horarios'>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID do Horário</Th>
                            <Th>Data</Th>
                            <Th>Horário</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {horarios.map(horario => (
                            <Tr key={horario.HorarioID}>
                                <Td>{horario.HorarioID}</Td>
                                <Td>{horario.Data}</Td>
                                <Td>{horario.Horario}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </div>
        </div>
    );
};

export default Horarios;
