import { useState } from "react";
import api from "../axiosConfig"; 

const usePostApi = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const postData = async (reqBody, headers = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(url, reqBody, { headers });
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    return { data, loading, error, postData };
  };
  
  export default usePostApi;

