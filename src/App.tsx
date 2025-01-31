import React, { useState, useEffect } from 'react';
import { Pill, Download, Trophy, Disc as Discord, Coffee, Sparkles, Lock } from 'lucide-react';

interface PillData {
  color: string;
  id: string;
  name: string;
  isUnique?: boolean;
  effect?: string;
}

interface EasterEgg {
  id: string;
  hint: string;
  unlocked: boolean;
}

// Define special elemental pill types
const uniquePillTypes = [
  { name: 'FIRE', color: '#FF4500' },
  { name: 'THUNDER', color: '#00FFFF' },
  { name: 'LIGHTNING', color: '#FFFF00' },
];

function App() {
  const [clicks, setClicks] = useState(0);
  const [requiredClicks, setRequiredClicks] = useState(generateRandomClicks());
  const [pills, setPills] = useState<PillData[]>([]);
  const [status, setStatus] = useState('');
  const [totalPills, setTotalPills] = useState(0);
  const [showLore, setShowLore] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>([
    { id: 'konami', hint: 'Up, Up, Down, Down, Left, Right, Left, Right, B, A', unlocked: false },
    { id: 'coffee', hint: 'Click the coffee cup 5 times', unlocked: false },
    { id: 'sparkle', hint: 'Generate a pill with a perfect RGB balance', unlocked: false }
  ]);
  const [coffeeClicks, setCoffeeClicks] = useState(0);

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    const handleKeyDown = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.key];
      if (newKonami.length > konamiCode.length) {
        newKonami.shift();
      }
      setKonami(newKonami);

      if (newKonami.join(',') === konamiCode.join(',')) {
        unlockEasterEgg('konami');
        setRequiredClicks(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konami]);

  function generateRandomClicks() {
    return Math.floor(Math.random() * (200 - 35 + 1)) + 35;
  }

  function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  function generateRandomId() {
    return Array.from({length: 25}, () => Math.floor(Math.random() * 10)).join('');
  }

  function generateRandomName() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return 'PILL-' + Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  }

  function unlockEasterEgg(id: string) {
    setEasterEggs(prev => prev.map(egg => 
      egg.id === id ? { ...egg, unlocked: true } : egg
    ));
    setStatus(`Easter egg unlocked: ${id.toUpperCase()}!`);
    setTimeout(() => setStatus(''), 2000);
  }

  function handleCoffeeClick() {
    const newClicks = coffeeClicks + 1;
    setCoffeeClicks(newClicks);
    if (newClicks === 5) {
      unlockEasterEgg('coffee');
      setClicks(prev => prev + 50);
    }
  }

  function handleClick() {
    setClicks(prev => {
      const newClicks = prev + 1;
      if (newClicks >= requiredClicks) {
        createNewPill();
        setRequiredClicks(generateRandomClicks());
        return 0;
      }
      return newClicks;
    });
  }

  function createNewPill() {
    // 5% chance of generating a unique elemental pill
    const chance = Math.random();
    if (chance < 0.05) {
      // pick a random special pill type
      const specialIndex = Math.floor(Math.random() * uniquePillTypes.length);
      const specialType = uniquePillTypes[specialIndex];
      const newPill: PillData = {
        color: specialType.color,
        id: `SPECIAL-${specialType.name}-${generateRandomId()}`,
        name: `PILL-${specialType.name}`,
        isUnique: true,
        effect: specialType.name,
      };

      setPills(prev => [...prev, newPill]);
      setTotalPills(prev => prev + 1);
      setStatus(`New UNIQUE pill unlocked: ${newPill.name}!`);
      setTimeout(() => setStatus(''), 2000);
      return;
    }

    // Otherwise generate a normal pill
    const color = generateRandomColor();
    const newPill = {
      color,
      id: generateRandomId(),
      name: generateRandomName(),
    };

    // Easter egg for perfect RGB balance
    const rgb = color.match(/[A-Fa-f0-9]{2}/g);
    if (rgb && rgb[0] === rgb[1] && rgb[1] === rgb[2]) {
      unlockEasterEgg('sparkle');
    }

    setPills(prev => [...prev, newPill]);
    setTotalPills(prev => prev + 1);
    setStatus(`New pill unlocked: ${newPill.name}!`);
    setTimeout(() => setStatus(''), 2000);
  }

  function downloadNFT(pill: PillData) {
    const content = `NFT Details:\nName: ${pill.name}\nID: ${pill.id}\nColor: ${pill.color}`;
    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pill.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="relative z-20 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Pill className="w-6 h-6 text-white" />
              <span className="ml-2 text-white font-bold">PillVerse</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowLore(!showLore)} className="hover:text-purple-200 transition-colors">
                Lore
              </button>
              <button 
                className="w-5 h-5 text-white hover:text-yellow-300 cursor-pointer transition-colors" 
                onClick={handleCoffeeClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                  <path d="M18.2505 10.5H19.6403C21.4918 10.5 22.0421 10.7655 21.9975 12.0838C21.9237 14.2674 20.939 16.8047 17 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M5.94627 20.6145C2.57185 18.02 2.07468 14.3401 2.00143 10.5001C1.96979 8.8413 2.45126 8.5 4.65919 8.5H15.3408C17.5487 8.5 18.0302 8.8413 17.9986 10.5001C17.9253 14.3401 17.4281 18.02 14.0537 20.6145C13.0934 21.3528 12.2831 21.5 10.9194 21.5H9.08064C7.71686 21.5 6.90658 21.3528 5.94627 20.6145Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M11.3089 2.5C10.7622 2.83861 10.0012 4 10.0012 5.5M7.53971 4C7.53971 4 7 4.5 7 5.5M14.0012 4C13.7279 4.1693 13.5 5 13.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              </button>
              <a href="https://pump.fun/coin/FLsVQQ1PGwVyFZfXR3qaqTuJGRdHHUTkKzJ7b4jUpump" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                  <path d="M11 7H17M11 5V9C11 10.6569 12.3431 12 14 12C15.6569 12 17 10.6569 17 9V5C17 3.34315 15.6569 2 14 2C12.3431 2 11 3.34315 11 5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M4 14H6.39482C6.68897 14 6.97908 14.0663 7.24217 14.1936L9.28415 15.1816C9.54724 15.3089 9.83735 15.3751 10.1315 15.3751H11.1741C12.1825 15.3751 13 16.1662 13 17.142C13 17.1814 12.973 17.2161 12.9338 17.2269L10.3929 17.9295C9.93707 18.0555 9.449 18.0116 9.025 17.8064L6.84211 16.7503" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M13 16.5L17.5928 15.0889C18.407 14.8352 19.2871 15.136 19.7971 15.8423C20.1659 16.3529 20.0157 17.0842 19.4785 17.3942L11.9629 21.7305C11.4849 22.0063 10.9209 22.0736 10.3952 21.9176L4 20.0199" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                    <path d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Background Pills Pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute pill-bg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow relative z-10">
        <div className="max-w-3xl mx-auto p-8">
          {showLore && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-4">The PillVerse Saga</h2>
              <p className="mb-4">In the year 2077, pharmaceutical engineering reached its peak with the creation of the PillVerse - a quantum realm where each pill contains its own unique universe.</p>
              <p className="mb-4">As a PillVerse Engineer, your mission is to generate and collect these extraordinary pills, each with its own unique signature and properties.</p>
              <p className="italic text-sm">Legend speaks of hidden secrets within the PillVerse, waiting to be discovered by the most dedicated collectors...</p>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">The PillVerse Collector</h1>
            <div className="flex items-center justify-center gap-4 text-white">
              <Trophy className="w-6 h-6" />
              <span className="text-xl">Total Pills: {totalPills}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <div className="text-center text-white text-xl mb-4">
              Clicks: {clicks}/<span className="hover:text-white cursor-help" title="Many">???</span>
            </div>
            
            <div className="bg-white/20 rounded-full h-4 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(clicks / requiredClicks) * 100}%` }}
              />
            </div>

            <button
              onClick={handleClick}
              className="w-full bg-white hover:bg-opacity-90 text-purple-600 font-bold py-4 px-8 rounded-xl 
                       transform transition-all duration-150 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <Pill className="w-6 h-6" />
                <span>CLICK TO GENERATE</span>
              </div>
            </button>
          </div>

          {/* Easter Eggs Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 mb-8">
            <div className="text-white text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Secrets discovered: {easterEggs.filter(egg => egg.unlocked).length}/{easterEggs.length}</span>
              </div>
              {easterEggs.map(egg => (
                <div key={egg.id} className="flex items-center gap-2 text-white/60">
                  {egg.unlocked ? <Sparkles className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  <span>{egg.unlocked ? egg.hint : '???'}</span>
                </div>
              ))}
            </div>
          </div>

          {status && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg 
                          animate-[slideIn_0.3s_ease-out]">
              {status}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pills.map((pill) => (
              <div key={pill.id} 
                   className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 ${pill.isUnique ? 'border-2 border-red-500 animate-pulse' : ''}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="pill-shape">
                    <div className="pill-half left bg-white" />
                    <div className="pill-half right" style={{ backgroundColor: pill.color }} />
                  </div>
                  <div className="text-white">
                    <div className="font-bold flex items-center gap-2">
                      {pill.name}
                      {pill.isUnique && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full uppercase font-bold">Unique</span>
                      )}
                    </div>
                    <div className="text-sm opacity-70">ID: {pill.id.slice(0, 8)}...</div>
                  </div>
                </div>
                
                <button
                  // onClick={() => downloadNFT(pill)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg 
                           flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>NFT Comming Soon!</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 bg-white/10 backdrop-blur-lg border-t border-white/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <p className="text-sm">© 2077 PillVerse. The PillVerse and the PillVerse Logo are trademarks of PillVerse, INC.</p>
            <p className="text-xs mt-2 text-white/60">
              <span className="hover:text-white cursor-help" title="Is this really the year?">1984</span> |  
              Version <span className="hover:text-white cursor-help" title="There might be more than meets the eye...">1.0.0</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
