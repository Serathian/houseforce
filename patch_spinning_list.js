const fs = require('fs');

let file = fs.readFileSync('frontend/src/components/SpinningWheel.tsx', 'utf8');

const oldGetPosition = `    if (isMobile) {
      // 2 columns, 4 rows to give text labels plenty of breathing room horizontally
      const col = index % 2;
      const row = Math.floor(index / 2);
      
      // Horizontal spacing: 140px gap (-70 and +70 from center)
      const x = -70 + (col * 140);
      
      // Vertical spacing: 95px gap for text below icon
      // Construction text is Top, so icons go to Bottom (positive Y)
      // Keyholding text is Bottom, so icons go to Top (negative Y)
      const y = side === 'left' ? -70 + (row * 95) : -230 + (row * 95);
      return { x, y };
    }`;

const newGetPosition = `    if (isMobile) {
      // 1 column, 8 rows for a classic list layout
      const row = index;
      const x = 70; // Push icons to the right so text on the left has room
      const y = side === 'left' ? 30 + (row * 50) : -370 + (row * 50);
      return { x, y };
    }`;

file = file.replace(oldGetPosition, newGetPosition);

// Replace the text position for constItems (side === 'left')
const oldConstText = `className={\`absolute w-48 \${isMobile ? 'top-[130%] left-1/2 -translate-x-1/2 text-center' : 'top-1/2 -translate-y-1/2 text-left left-[130%]'}\`}`;
const newConstText = `className={\`absolute w-48 \${isMobile ? 'top-1/2 -translate-y-1/2 right-[120%] text-right pr-2' : 'top-1/2 -translate-y-1/2 text-left left-[130%]'}\`}`;

file = file.replace(oldConstText, newConstText);

// Replace the text position for keyItems (side === 'right')
// We can just globally replace it since they are identical
file = file.replace(/top-\[130%\] left-1\/2 -translate-x-1\/2 text-center/g, 'top-1/2 -translate-y-1/2 right-[120%] text-right pr-2');

fs.writeFileSync('frontend/src/components/SpinningWheel.tsx', file);
