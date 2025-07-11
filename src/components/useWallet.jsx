// hooks/useWallet.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function useWallet(token) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  });

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/wallet/balance`, { headers }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/wallet/transactions?page=${pagination.page}&limit=${pagination.limit}`, { headers })
      ]);

      setBalance(balanceRes.data.data.balance);
      setTransactions(transactionsRes.data.data);
      setPagination(prev => ({
        ...prev,
        total: transactionsRes.data.meta.total,
        hasMore: transactionsRes.data.meta.hasMore
      }));
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchWalletData();
  }, [pagination.page, token]);

  return {
    balance,
    transactions,
    loading,
    pagination,
    setPagination,
    fetchWalletData
  };
}