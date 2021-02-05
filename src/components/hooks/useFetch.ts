import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        const result = await response.json();
        setResponse(result);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchInfo();
  }, [url]);

  return { error, loading, response };
};

/*
  const FetchExample = () => {
    const res = useFetch('someurl', {});
    if (!res.response) {
      return <div>Loading...</div>;
    }

    const data = res.response.data;
    return (
      <div><span>{data}</span></div>
    );
  };
*/

export default useFetch;
