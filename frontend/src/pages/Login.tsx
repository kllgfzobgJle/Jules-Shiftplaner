import React, { useState } from 'react';
import { useStore } from '../store';
import { AuthService } from '../services/api';
import { Lock } from 'lucide-react';

const Login: React.FC = () => {
    const { login } = useStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await AuthService.login(username, password);
            login(data.token);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Lock className="text-blue-600" size={24} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
                {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-4 text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
