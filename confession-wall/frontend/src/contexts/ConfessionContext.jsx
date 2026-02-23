import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ConfessionContext = createContext();

export const ConfessionProvider = ({ children }) => {
  const [confessions, setConfessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:3000';

  const fetchConfessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/confessions`);
      setConfessions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching confessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/confessions/stats/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Post confession — always sends real userId, isAnonymous is just a display flag
  const postConfession = async (text, secretCode, userId, vibe = 'secret', isAnonymous = true) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/confessions`, {
        text,
        secretCode,
        userId,
        vibe,
        isAnonymous
      });
      await fetchConfessions();
      await fetchStats();
      return response.data;
    } catch (error) {
      console.error('Error posting confession:', error);
      throw error;
    }
  };

  const addReaction = async (confessionId, reactionType, userId = 'anonymous') => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/confessions/${confessionId}/react`,
        { reactionType, userId }
      );
      await fetchConfessions();
      return response.data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  };

  const addComment = async (confessionId, text, userId = 'anonymous', username = 'Anon') => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/confessions/${confessionId}/comment`,
        { text, userId, username }
      );
      await fetchConfessions();
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const updateConfessed = async (confessionId, text, secretCode) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/confessions/${confessionId}`,
        { text, secretCode }
      );
      await fetchConfessions();
      return response.data;
    } catch (error) {
      console.error('Error updating confession:', error);
      throw error;
    }
  };

  const deleteConfessed = async (confessionId, secretCode) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/confessions/${confessionId}`,
        { data: { secretCode } }
      );
      await fetchConfessions();
      return response.data;
    } catch (error) {
      console.error('Error deleting confession:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchConfessions();
    fetchStats();
  }, []);

  return (
    <ConfessionContext.Provider
      value={{
        confessions, stats, loading,
        postConfession, addReaction, addComment,
        updateConfessed, deleteConfessed,
        fetchConfessions, fetchStats
      }}
    >
      {children}
    </ConfessionContext.Provider>
  );
};

export const useConfession = () => {
  const context = useContext(ConfessionContext);
  if (!context) throw new Error('useConfession must be used within ConfessionProvider');
  return context;
};
