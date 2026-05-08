import express from 'express';
import routes from './routes';
import cors from 'cors';
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv';
import { PrismaService } from '../prisma/prismaService';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1818;

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
))

app.use(fileUpload({ useTempFiles: false }))

app.use(express.json());
app.use(routes);

app.use(errorHandler);

async function startServer() {
    try {
        await PrismaService.$connect();
        console.log('Connected to database');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

startServer();

process.on('beforeExit', async () => {
    await PrismaService.$disconnect();
});
