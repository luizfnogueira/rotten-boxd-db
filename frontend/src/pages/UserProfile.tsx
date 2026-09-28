import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [profile, setProfile] = useState<{username: string, films_count: number} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  
  const [showReviews, setShowReviews] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const activeUser = localStorage.getItem('activeUser');
    if (!activeUser) {
      navigate('/'); 
      return;
    }

    const profileData = localStorage.getItem(`profile_${activeUser}`);
    if (profileData) {
      const parsed = JSON.parse(profileData);
      setProfile(parsed);
      setNewUsername(parsed.username);
    } else {
      const defaultProfile = { username: activeUser, films_count: 0 };
      setProfile(defaultProfile);
      setNewUsername(activeUser);
    }
  }, [navigate]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !profile) return;

    const oldUsername = profile.username;
    const newName = newUsername.trim();

    if (oldUsername !== newName) {
      // Transfer profile data
      const updatedProfile = { ...profile, username: newName };
      localStorage.setItem(`profile_${newName}`, JSON.stringify(updatedProfile));
      localStorage.removeItem(`profile_${oldUsername}`); // Remove old key
      
      // Update active user
      localStorage.setItem('activeUser', newName);
      
      setProfile(updatedProfile);
    }

    setIsEditing(false);
  };

  const handleToggleReviews = () => {
    setShowReviews(!showReviews);
  };

  if (!profile) return null;

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-12 text-[#9ab] font-sans pb-20">
      
      {/* Very Simple Profile Container */}
      <div className="bg-[#1b2228] p-12 rounded-lg border border-[#2c3440] flex flex-col items-center justify-center gap-8 shadow-lg">
        
        {/* Username */}
        {!isEditing ? (
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-white text-5xl font-bold font-serif m-0">{profile.username}</h1>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-[#8b9bab] hover:text-white text-[11px] font-bold tracking-widest uppercase transition-colors bg-[#2c3440] hover:bg-[#445566] px-4 py-1.5 rounded-full"
            >
              Edit Username
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveName} className="flex flex-col items-center gap-4">
            <input 
              type="text" 
              value={newUsername} 
              onChange={e => setNewUsername(e.target.value)}
              className="bg-[#cdd8e4] text-[#14181c] px-4 py-2 rounded text-xl font-bold outline-none text-center shadow-inner" 
              placeholder="New Username"
              required
            />
            <div className="flex gap-3">
              <button type="submit" className="bg-[#00e054] hover:bg-[#00c04b] transition-colors text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-md">Save</button>
              <button type="button" onClick={() => { setIsEditing(false); setNewUsername(profile.username); }} className="bg-[#445566] hover:bg-[#556677] transition-colors text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-md">Cancel</button>
            </div>
          </form>
        )}
        
        {/* Divider */}
        <div className="w-16 h-px bg-[#2c3440]"></div>

        {/* Films Count */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#00e054] text-4xl font-bold font-serif leading-none">{profile.films_count.toLocaleString()}</span>
          <span className="text-[#8b9bab] text-[12px] font-bold tracking-widest uppercase">Films Watched</span>
        </div>

        {/* View Reviews Button */}
        <button 
          onClick={handleToggleReviews}
          className="bg-[#2c3440] hover:bg-[#445566] text-white px-8 py-3 rounded text-[13px] font-bold tracking-widest uppercase transition-colors mt-2 shadow-md border border-[#445566]"
        >
          {showReviews ? "Hide My Reviews" : "View My Reviews"}
        </button>

      </div>
      
      {/* Reviews Section */}
      {showReviews && (
        <div className="mt-12 max-w-[800px] mx-auto animate-fade-in">
          <h2 className="text-white font-serif text-2xl border-b border-[#2c3440] pb-3 mb-6 flex items-center justify-between">
            <span>My Reviews</span>
            <span className="text-sm font-sans text-gray-500">0 total</span>
          </h2>
          
          <div className="text-center py-10 text-gray-500 italic">You haven't reviewed any films yet. (Integration disabled)</div>
        </div>
      )}

    </div>
  );
}
