import { useState } from 'react';

export default function Login({ onLogin }: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] bg-[#14181c] text-[#8b9bab]">
      <div className="bg-[#1b2228] p-8 rounded border border-[#2c3440] w-[400px]">
        <h2 className="text-white text-2xl font-serif mb-6 text-center">Login to RottenBoxdbd</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-bold tracking-widest uppercase mb-2">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#cdd8e4] text-[#14181c] px-3 py-2 rounded font-bold outline-none"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#00e054] hover:bg-[#00c04b] text-white font-bold tracking-widest uppercase py-3 rounded mt-4 transition-colors text-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
