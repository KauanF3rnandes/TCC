import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import Header from '../../components/Header/index'
import { Button, Center, Spinner } from '@chakra-ui/react';


const AgendamentosAdmin = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };

        loadData();
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
            <Sidebar/>
            <div>
                
            </div>
        </div>
    );
};

export default AgendamentosAdmin