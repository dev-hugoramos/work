const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'img');
const outputFile = path.join(__dirname, '..', 'js', 'gallery-data.js');

const categories = {
    'blackwork': { filter: 'blackwork', label: 'Blackwork' },
    'color': { filter: 'realismo', label: 'Color' },
    'fine line': { filter: 'tradicional', label: 'Fine Line' }
};

const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

let images = [];

Object.entries(categories).forEach(([folder, { filter, label }]) => {
    const folderPath = path.join(imgDir, folder);

    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);

        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();

            if (validExtensions.includes(ext)) {
                images.push({
                    src: `img/${folder}/${file}`,
                    category: filter,
                    title: label
                });
            }
        });
    }
});

// Mezclar imágenes
for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
}

const output = `// Auto-generated - Do not edit manually
// Run: npm run build:gallery
const GALLERY_IMAGES = ${JSON.stringify(images, null, 2)};
`;

fs.writeFileSync(outputFile, output);
console.log(`Gallery data generated: ${images.length} images`);
