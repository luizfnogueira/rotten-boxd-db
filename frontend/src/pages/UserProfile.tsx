import { Link } from 'react-router-dom';

export default function UserProfile() {
  const mockFavorites = [
    { id: '1', title: "Rosemary's Baby", poster: 'https://placehold.co/300x450/1b252d/ffffff?text=Rosemarys+Baby' },
    { id: '2', title: 'Videodrome', poster: 'https://placehold.co/300x450/1b252d/ffffff?text=Videodrome' },
    { id: '3', title: 'Do The Right Thing', poster: 'https://placehold.co/300x450/1b252d/ffffff?text=Do+The+Right+Thing' },
    { id: '4', title: 'The Bridges of Madison County', poster: 'https://placehold.co/300x450/1b252d/ffffff?text=Bridges+of+Madison+County' },
  ];

  const mockWatchlist = [
    { id: '10', title: 'Primer', poster: 'https://placehold.co/100x150/1b252d/ffffff?text=Primer' },
    { id: '11', title: 'Monster', poster: 'https://placehold.co/100x150/1b252d/ffffff?text=Monster' },
    { id: '12', title: 'Rio', poster: 'https://placehold.co/100x150/1b252d/ffffff?text=Rio' },
    { id: '13', title: 'Arc', poster: 'https://placehold.co/100x150/1b252d/ffffff?text=Arc' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto mt-10 font-sans text-gray-300">
      
      {/* Header Profile */}
      <div className="flex justify-between items-end border-b border-[#2c3440] pb-6 mb-2">
        <div className="flex gap-6 items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-600">
            <img src="https://placehold.co/200x200/1b252d/ffffff?text=User" alt="PIBEBRABO" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-3xl font-bold text-white font-serif">pibebrabo</h1>
              <button className="bg-[#445566] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded hover:bg-gray-500 transition">
                Edit Profile
              </button>
            </div>
            <p className="text-sm text-gray-400">larper de filmes</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span className="text-[10px]">📍</span> ohi city
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-xl font-bold text-white font-serif">1,004</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Films</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-serif">90</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">This Year</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-serif">27</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Lists</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-serif">82</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Following</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-serif">70</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Followers</div>
          </div>
        </div>
      </div>

      {/* Sub Menu */}
      <div className="flex justify-center border-b border-[#2c3440] mb-8">
        <div className="flex gap-6 text-sm">
          <Link to="#" className="px-2 py-3 text-white border-b-2 border-[#00e054]">Profile</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Activity</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Films</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Diary</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Reviews</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Watchlist</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Lists</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Likes</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Tags</Link>
          <Link to="#" className="px-2 py-3 hover:text-white transition">Network</Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-[1fr_300px] gap-8">
        
        {/* Left Column */}
        <div>
          <div className="flex justify-between items-center border-b border-[#2c3440] mb-4 pb-1">
            <h2 className="text-xs text-gray-400 uppercase tracking-widest">Favorite Films</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockFavorites.map((m) => (
              <div key={m.id} className="rounded border border-[#445566] overflow-hidden hover:border-[#00e054] transition cursor-pointer">
                <img src={m.poster} alt={m.title} className="w-full h-auto block" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-8">
          
          {/* Watchlist */}
          <div>
            <div className="flex justify-between items-center border-b border-[#2c3440] mb-3 pb-1">
              <h2 className="text-xs text-gray-400 uppercase tracking-widest">Watchlist</h2>
              <span className="text-xs text-gray-500">538</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {mockWatchlist.map((m) => (
                <div key={m.id} className="rounded overflow-hidden border border-[#2c3440]">
                  <img src={m.poster} alt={m.title} className="w-full h-auto block" />
                </div>
              ))}
            </div>
          </div>

          {/* Diary */}
          <div>
            <div className="flex justify-between items-center border-b border-[#2c3440] mb-3 pb-1">
              <h2 className="text-xs text-gray-400 uppercase tracking-widest">Diary</h2>
              <span className="text-xs text-gray-500">628</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-[#2c3440]">
              <div className="bg-[#2c3440] rounded flex flex-col items-center justify-center w-10 h-10">
                <span className="text-[10px] font-bold text-gray-400 leading-none">SEP</span>
                <span className="text-sm font-bold text-white leading-none mt-1">27</span>
              </div>
              <div className="text-sm text-blue-300 font-serif">Space Jam</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
