import React, { useState, useEffect } from 'react';
import { Pill, Download, Trophy, Github, Twitter, Disc as Discord, Coffee, Sparkles, Lock } from 'lucide-react';

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
              <button onClick={() => setShowLore(!showLore)} className="text-white hover:text-purple-200 transition-colors">
                Lore
              </button>
              <Coffee 
                className="w-5 h-5 text-white hover:text-yellow-300 cursor-pointer transition-colors" 
                onClick={handleCoffeeClick}
              />
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-200">
                <Discord className="w-5 h-5" />
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
