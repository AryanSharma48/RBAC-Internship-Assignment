import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_CREDENTIALS = [
  { label: 'Admin', email: 'aryansharma24106@gmail.com', password: 'aryan@23' },
  { label: 'User', email: 'demouser@example.com', password: 'demo123' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const fillCredentials = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {/* Demo credentials */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Demo credentials</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.label}
                type="button"
                onClick={() => fillCredentials(cred)}
                className="text-left p-3 bg-white border border-gray-200 rounded-md hover:border-indigo-400 hover:shadow-sm transition-all group"
              >
                <span className={`block text-xs font-semibold mb-1 ${cred.label === 'Admin' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                  {cred.label}
                </span>
                <span className="block text-xs text-gray-500 truncate">{cred.email}</span>
                <span className="block text-xs text-gray-400">{cred.password}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Click a card to auto-fill credentials</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>

        <div className="text-center">
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
