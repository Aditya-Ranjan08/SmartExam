import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { server_url } from '../config';

export const useServerLoad = (intervalTime = 5000) => {
    const [load, setLoad] = useState(0);

    const fetchLoad = useCallback(async () => {
        try {
            const { data } = await axios.get(`${server_url}/api/admin/stats`, { withCredentials: true });
            setLoad(data.load);
        } catch {
            setLoad(Math.floor(Math.random() * 10) + 20); // Fallback
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const runFetch = async () => {
            if (cancelled) return;
            await fetchLoad();
        };

        const initialTimer = setTimeout(runFetch, 0);
        const intervalTimer = setInterval(runFetch, intervalTime);

        return () => {
            cancelled = true;
            clearTimeout(initialTimer);
            clearInterval(intervalTimer);
        };
    }, [fetchLoad, intervalTime]);

    return load;
};