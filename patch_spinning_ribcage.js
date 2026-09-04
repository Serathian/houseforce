const fs = require('fs');

let file = fs.readFileSync('frontend/src/components/SpinningWheel.tsx', 'utf8');

const oldGetPosition = `    if (isMobile) {
      // 1 column, 8 rows for a classic list layout
      const row = index;
      const x = 70; // Push icons to the right so text on the left has room
      const y = side === 'left' ? 30 + (row * 50) : -370 + (row * 50);
      return { x, y };
    }`;

const newGetPosition = `    if (isMobile) {
      // 2 columns, 4 rows for a symmetrical ribcage layout
      const col = index % 2;
      const row = Math.floor(index / 2);
      // Center icons tightly to leave maximum width for text on the edges
      const x = col === 0 ? -45 : 45; 
      // Vertically compact
      const y = side === 'left' ? -20 + (row * 60) : -260 + (row * 60);
      return { x, y };
    }`;

file = file.replace(oldGetPosition, newGetPosition);

// Replace the text classes for constItems (side === 'left')
const oldConstTextDiv = /className=\{\`absolute w-48 \$\{isMobile \? 'top-1\/2 -translate-y-1\/2 right-\[120%\] text-right pr-2' : 'top-1\/2 -translate-y-1\/2 text-left left-\[130%\]'\}\`\}/g;
const newConstTextDiv = `className={\`absolute \${isMobile ? (i % 2 === 0 ? 'w-[100px] top-1/2 -translate-y-1/2 right-[115%] text-right pr-1' : 'w-[100px] top-1/2 -translate-y-1/2 left-[115%] text-left pl-1') : 'w-48 top-1/2 -translate-y-1/2 text-left left-[130%]'}\`}`;

file = file.replace(oldConstTextDiv, newConstTextDiv);

const oldH3 = /<h3 className="font-bold text-white text-sm whitespace-nowrap drop-shadow-sm">\{item\.label\}<\/h3>/g;
const newH3 = `<h3 className={\`font-bold text-white drop-shadow-sm \${isMobile ? 'text-[10px] uppercase tracking-wider leading-[1.2] whitespace-normal' : 'text-sm whitespace-nowrap'}\`}>{item.label}</h3>`;

file = file.replace(oldH3, newH3);

fs.writeFileSync('frontend/src/components/SpinningWheel.tsx', file);
