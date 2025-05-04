import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }
  
    const endpoint = isRegistering ? '/api/register' : '/api/login';
    const body = isRegistering ? { username, email, password } : { username, password };
  
    try {
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (data.success) {
        if (isRegistering) {
          alert('Registration successful! Please log in.');
          setIsRegistering(false); // Switch to login form
          setEmail('');
          setPassword('');
        } else {
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('username', data.username);
          navigate('/chat'); // Redirect to chat page
        }
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during authentication');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-indigo-200">
      <form
        onSubmit={handleAuth}
        className="bg-white p-10 rounded-2xl shadow-2xl w-96 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {isRegistering && (
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
         
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
        >
          {isRegistering ? 'Register' : 'Log In'}
        </button>
        
        <p className="text-center text-xs text-gray-400">
          {isRegistering ? 'Already have an account? ' : 'Need an account? '}
          <button 
            type="button"
            className="text-indigo-600 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Log in' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;