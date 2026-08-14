import { useState, useEffect } from 'react';

export function useRecommendations(userId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!!userId);   // initial based on userId

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // Replace with real API call
        const result = await fetch(`/api/recommendations?userId=${userId}`);
        const json = await result.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      } finally {
        setLoading(false);        // now we’re inside an async callback → no warning
      }
    };

    fetchData();
  }, [userId]);   // note: we don't need to worry about stale closures because the component remounts

  return { data, loading };
}