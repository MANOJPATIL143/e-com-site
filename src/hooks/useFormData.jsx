import { useState } from "react";
import api from "../axiosConfig";

const useFormDataApi = (url) => {
  const [datas, setData] = useState(null);
  const [loadings, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (reqBody, headers = {}) => {
    setLoading(true);
    setError(null);

    const formData = reqBody instanceof FormData ? reqBody : new FormData();
    if (!(reqBody instanceof FormData)) {
      Object.keys(reqBody).forEach((key) => {
        formData.append(key, reqBody[key]);
      });
    }

    try {
      const response = await api.post(url, formData, { headers });
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { datas, loadings, error, postData };
};

export default useFormDataApi;
