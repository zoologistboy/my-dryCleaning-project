import { useState } from 'react';
import { Wallet, CreditCard, Plus, Minus, ArrowUpDown } from 'lucide-react';

const transactions = [
  { id: 1, type: 'topup', amount: 5000, date: '2023-06-15', status: 'completed' },
  { id: 2, type: 'payment', amount: -1200, date: '2023-06-10', status: 'completed' },
  { id: 3, type: 'topup', amount: 3000, date: '2023-06-05', status: 'completed' },
  { id: 4, type: 'payment', amount: -750, date: '2023-05-28', status: 'completed' },
  { id: 5, type: 'refund', amount: 750, date: '2023-05-20', status: 'completed' }
];

export default function WalletPage() {
  const [balance] = useState(6800);
  const [activeTab, setActiveTab] = useState('transactions');
  const [topupAmount, setTopupAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleTopup = async (e) => {
    e.preventDefault();
    if (!topupAmount || isNaN(topupAmount) || topupAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      // Topup logic here
      setMessage(`Successfully added ₦${parseFloat(topupAmount).toFixed(2)} to your wallet`);
      setTopupAmount('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Wallet Balance</h2>
                <p className="text-3xl font-bold mt-2">₦{balance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Wallet className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('topup')}
                className={`py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'topup'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Top Up
              </button>
              <button
                onClick={() => setActiveTab('cards')}
                className={`py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'cards'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Payment Methods
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {message && (
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-md">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
                {error}
              </div>
            )}
            
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No transactions yet
                  </p>
                ) : (
                  transactions.map((txn) => (
                    <div key={txn.id} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${
                          txn.amount > 0 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                        }`}>
                          {txn.amount > 0 ? (
                            <Plus className="w-5 h-5" />
                          ) : (
                            <Minus className="w-5 h-5" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium capitalize">{txn.type}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(txn.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className={`font-medium ${
                        txn.amount > 0 
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'topup' && (
              <form onSubmit={handleTopup}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount to Top Up
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">₦</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        min="100"
                        step="100"
                        value={topupAmount}
                        onChange={(e) => setTopupAmount(e.target.value)}
                        className="pl-8 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2000, 5000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setTopupAmount(amount)}
                        className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        ₦{amount}
                      </button>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                        <span className="font-medium">Credit Card ending in 4242</span>
                      </div>
                      <button
                        type="button"
                        className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add New Payment Method
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || !topupAmount}
                      className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        loading || !topupAmount ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Processing...' : 'Top Up Wallet'}
                    </button>
                  </div>
                </div>
              </form>
            )}
            
            {activeTab === 'cards' && (
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300">
                      Remove
                    </button>
                  </div>
                </div>
                
                <button
                  type="button"
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}