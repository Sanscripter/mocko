import {useEffect, useState} from "react";
import {client} from '../utils';
import {createContext} from "react";

export function useMocks() {
    const [mocks, setMocks] = useState(null);
    const [error, setError] = useState(null);
    const isLoading = mocks === null && error === null;
    const hasError = Boolean(error);

    const loadMocks = async () => {
        setMocks(null);
        setError(null);

        try {
            const { data } = await client.get('/mocks');
            setMocks(data);
        } catch(e) {
            setError(e);
        }
    };

    const createMock = async (mock) => {
        await client.post('/mocks', mock);
        await loadMocks();
    };

    const removeMock = async (id) => {
        await client.delete(`/mocks/${id}`);
        await loadMocks();
    };

    useEffect(() => {
        loadMocks();
    }, []);

    return { mocks, isLoading, hasError, removeMock, createMock };
}

export const Mocks = createContext(null);
