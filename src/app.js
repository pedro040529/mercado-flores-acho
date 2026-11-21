const express = require("express");
const path = require("path");

const app = express();

// Sirve la carpeta public (index.html, css, js, img)
app.use(express.static(path.join(__dirname, "..", "public")));

// En local: node src/app.js. En Vercel se exporta la app.
if (require.main === module) {
  const PUERTO = process.env.PORT || 3000;
  app.listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
}

module.exports = app;
