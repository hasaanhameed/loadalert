import React from 'react';

export const DnaHelix = () => {
  // We'll create about 50 pairs to cover the full vertical height of the section
  const pairs = Array.from({ length: 50 });

  return (
    <div className="flex flex-col items-center justify-around h-full w-full py-8 overflow-hidden pointer-events-none">
      {pairs.map((_, i) => (
        <div 
          key={i} 
          className="relative flex items-center justify-center w-24 h-4"
        >
          {/* Dot 1 */}
          <div 
            className="absolute w-[10px] h-[10px] rounded-full bg-obsidian-blood"
            style={{ 
              animation: 'dna-rotate 3s ease-in-out infinite',
              animationDelay: `-${i * 0.15}s`
            }} 
          />
          
          {/* Connector Line */}
          <div 
            className="w-full h-[1px] bg-obsidian-blood/30"
            style={{ 
              animation: 'dna-scale-line 3s ease-in-out infinite',
              animationDelay: `-${i * 0.15}s`
            }}
          />
          
          {/* Dot 2 */}
          <div 
            className="absolute w-[10px] h-[10px] rounded-full bg-obsidian-blood"
            style={{ 
              animation: 'dna-rotate 3s ease-in-out infinite',
              animationDelay: `-${(i * 0.15) + 1.5}s` // Offset by half cycle (1.5s)
            }} 
          />
        </div>
      ))}
    </div>
  );
};

