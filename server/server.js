    const express = require('express');
    const connectDatabase = require('./db/Database');
    const authRoutes = require("./routes/auth");
    const taskRoutes = require("./routes/tasks");
    const cors = require('cors');
    const dotenv = require('dotenv');

    dotenv.config({
        path: "./config/.env",
    });

    const app = express();

    // Connect to the database
    connectDatabase();
    app.use(express.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });
    
    app.use(cors({
        origin: "*",
        credentials: true,
    }));

    // Set up routes
    app.use('/api/auth', authRoutes);
    app.use('/api', taskRoutes);

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
