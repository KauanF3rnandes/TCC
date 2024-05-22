const express = require("express");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { verifyJWT, roleMiddleware, adminRoute, clientRoute } = require('./controllers/authController');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);

app.get('/admin', verifyJWT, roleMiddleware('admin'), adminRoute);
app.get('/client', verifyJWT, roleMiddleware('client'), clientRoute);

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
});
