import { useState, useCallback } from 'react';
import api from "../axiosConfig"; 


const useAxios = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const execute = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};

export default useAxios;
