// Node.js script to extract file metadata from Portfolio-Content folder
const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, 'Portfolio-Content');
const projects = fs.readdirSync(portfolioDir);

const allFiles = [];

projects.forEach(project => {
    const projectPath = path.join(portfolioDir, project);
    if (!fs.statSync(projectPath).isDirectory()) return;

    const files = fs.readdirSync(projectPath);
    files.forEach(file => {
        const filePath = path.join(projectPath, file);
        const stats = fs.statSync(filePath);
        const isVideo = /\.(mp4|mov)$/i.test(file);
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

        if (isImage || isVideo) {
            const modifiedDate = stats.mtime;
            const month = String(modifiedDate.getMonth() + 1).padStart(2, '0');
            const day = String(modifiedDate.getDate()).padStart(2, '0');
            const year = modifiedDate.getFullYear();
            const formattedDate = `${month}-${day}-${year}`;

            allFiles.push({
                type: isVideo ? 'video' : 'image',
                src: `Portfolio-Content/${project}/${file}`,
                alt: `${project} - ${file.split('.')[0]}`,
                category: project,
                dateModified: formattedDate
            });
        }
    });
});

// Output as JavaScript array
console.log('const portfolioGalleryData = [');
allFiles.forEach((file, index) => {
    const comma = index < allFiles.length - 1 ? ',' : '';
    console.log(`    { type: '${file.type}', src: '${file.src}', alt: '${file.alt}', category: '${file.category}', dateModified: '${file.dateModified}' }${comma}`);
});
console.log('];');
