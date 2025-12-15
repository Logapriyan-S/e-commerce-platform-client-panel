import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../components/LoadingSpinner';
import bgImage from '../assets/auth-bg.jpg';
import CustomToast from '../components/CustomToast';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.access) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        setSuccessMessage('Login successful  Redirecting to home...');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        toast.error(data.detail || 'Login failed ❌', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Server error or network issue. Please check your backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center md:justify-start p-8 sm:p-12 md:p-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative bg-black bg-opacity-60 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-md">
        {isLoading && <LoadingSpinner />}

        {successMessage ? (
          <div className="text-center text-white space-y-4 p-4">
            <h2 className="text-3xl font-bold">Login Successful!</h2>
            <p className="text-lg">{successMessage}</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-white font-inter rounded-md">Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-400 font-inter"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-3 text-sm text-gray-400">OR</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            <div className="space-y-4">
              <button
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-semibold"
              >
                {/* CORRECTED: Google SVG and text */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.24 10.27c.45-.63.92-1.23 1.4-1.8.6-.78 1.46-1.55 2.5-1.55 1.5 0 2.22.95 2.22 2.27 0 1.25-.97 2.12-2.18 2.12-.9 0-1.87-.5-2.58-.93-1.04-.62-1.92-1.3-2.6-2.18-.73-1.03-1.12-2.22-1.12-3.6 0-3.37 2.5-6.2 6.18-6.2 2.8 0 4.7 1.57 5.58 3.5.76 1.6-1.25 2.7-1.25 2.7-.44-.24-1.2-.5-2.07-.5-1.1 0-1.7.5-1.7 1.2 0 .55.5 1.2 1.3 1.2.78 0 1.5-.42 2.1-1.06 1.05-1.13 1.7-2.7 1.7-4.57 0-3.13-2.45-5.58-5.5-5.58-3.05 0-5.5 2.45-5.5 5.5s2.45 5.5 5.5 5.5c1.47 0 2.8-.57 3.8-1.58L12.24 10.27z"></path><path d="M20.25 10.27h-7.63v2.85h4.35c-.24.78-1.18 2.05-4.35 2.05-2.73 0-4.93-2.13-4.93-4.7s2.2-4.7 4.93-4.7c1.42 0 2.57.6 3.45 1.48l1.9-1.9c-1.14-1.1-2.9-1.9-4.83-1.9-4.13 0-7.5 3.37-7.5 7.5s3.37 7.5 7.5 7.5c4.13 0 7.3-3.27 7.43-7.4h-7.43v-2.85z"></path></svg>
                <span>Sign in with Google</span>
              </button>
            </div>

            <p className="text-sm mt-6 text-center text-gray-300 font-inter">
              Don't have an account?{' '}
              <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-blue-400 hover:underline">
                Register
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;