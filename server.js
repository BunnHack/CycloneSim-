const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Check if a production build exists in the dist directory
const distPath = path.join(__dirname, 'dist');
const useDist = fs.existsSync(distPath);

if (useDist) {
  console.log('Serving production build from dist/ directory');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.log('Serving development files from root directory');
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
