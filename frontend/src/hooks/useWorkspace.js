import { useState, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useWorkspace() {
  const [currentRecord, setCurrentRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  };

  const executeSearch = useCallback(async (queryText) => {
    if (!queryText?.trim()) return;

    setStatus("searching");
    setError(null);
    setCurrentRecord(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/query/search`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ query: queryText })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to execute retrieval.");
      }

      const data = await response.json();

      setCurrentRecord({
        queryId: data.queryId,
        query: data.query,
        route: data.route,
        retrievedContexts: data.retrievedContexts || [],
        answer: null,
        sources: []
      });

      setStatus("contexts_ready");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("idle");
    }
  }, []);

  const executeSummarize = useCallback(async () => {
    if (!currentRecord?.queryId) return;

    setStatus("generating");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/query/summarize`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ queryId: currentRecord.queryId })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate answer.");
      }

      const data = await response.json();

      setCurrentRecord(prev => ({
        ...prev,
        answer: data.answer,
        sources: data.sources || []
      }));

      setStatus("complete");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("error");
    }
  }, [currentRecord]);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/query/history`,
        {
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch history.");
      }

      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, []);

  const getRecordById = useCallback(async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/query/${id}`,
        {
          method: "GET",
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch record details.");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    }
  }, []);

  const togglePin = useCallback(async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/query/pin/${id}`,
        {
          method: "PATCH",
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Failed to pin query.");
      }

      const updated = await response.json();

      setHistory(prev =>
        prev.map(item =>
          item._id === id ? updated : item
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, []);

  const deleteRecord = useCallback(async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/query/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete record.");
      }

      setHistory(prev =>
        prev.filter(item => item._id !== id)
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, []);

  return {
    currentRecord,
    history,
    status,
    error,
    executeSearch,
    executeSummarize,
    fetchHistory,
    getRecordById,
    togglePin,
    deleteRecord,
    setStatus,
    setCurrentRecord
  };
}