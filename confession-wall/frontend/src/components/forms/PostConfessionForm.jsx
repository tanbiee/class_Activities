import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useConfession } from '../../contexts/ConfessionContext';

const PostConfessionForm = ({ onSuccess }) => {
  const { postConfession } = useConfession();
  const [text, setText] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [userId, setUserId] = useState('anonymous');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!text.trim()) {
      setError('Please write your confession');
      return;
    }

    if (!secretCode) {
      setError('Please set a secret code');
      return;
    }

    if (secretCode.length < 4) {
      setError('Secret code must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      await postConfession(text, secretCode, userId);
      setSuccess('Confession posted successfully! 🎉');
      setText('');
      setSecretCode('');
      setUserId('anonymous');
      
      setTimeout(() => {
        setSuccess('');
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error posting confession. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border-t-4 border-blue-500">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Share Your Confession
      </h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 p-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your Confession <span className="text-red-500">*</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts anonymously... (max 500 characters)"
            maxLength={500}
            rows={5}
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {text.length}/500 characters
          </p>
        </div>

        {/* User ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            User Identifier (optional)
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value || 'anonymous')}
            placeholder="Leave blank for truly anonymous"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This could be your Google ID if you logged in, or leave as anonymous
          </p>
        </div>

        {/* Secret Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Secret Code <span className="text-red-500">*</span>
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400"> (min 4 chars - for editing/deleting)</span>
          </label>
          <input
            type="password"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder="Enter a secret code (you'll need this to edit/delete)"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Remember this code! You'll need it to edit or delete your confession.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          <FaPaperPlane size={18} />
          {loading ? 'Posting...' : 'Post Confession'}
        </button>
      </form>
    </div>
  );
};

export default PostConfessionForm;
