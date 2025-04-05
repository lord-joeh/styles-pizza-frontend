import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const useAxios = (url, method = 'GET', payload = null, headers = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controllerRef = useRef(new AbortController());

  // Fetch data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios({
          method: method.toUpperCase(),
          url,
          data: payload,
          headers,
          signal: controllerRef.current.signal,
        });
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup: abort ongoing request and reset controller
    return () => {
      controllerRef.current.abort();
      controllerRef.current = new AbortController();
    };
  }, [url, method, payload, headers]);

  // Refetch function, wrapped in useCallback for stability
  const refetch = useCallback(
    async (
      newUrl = url,
      newMethod = method,
      newPayload = payload,
      newHeaders = headers,
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios({
          method: newMethod.toUpperCase(),
          url: newUrl,
          data: newPayload,
          headers: newHeaders,
          signal: controllerRef.current.signal,
        });

        setData(response.data);
        return response.data;
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [url, method, payload, headers],
  );

  return { data, loading, error, refetch };
};

export default useAxios;
