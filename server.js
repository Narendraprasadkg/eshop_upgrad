const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Replace with your actual JSON file
const middlewares = jsonServer.defaults();

server.use(cors()); // Enable CORS for all routes

server.use(middlewares);
server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running at http://localhost:${PORT}`);
});