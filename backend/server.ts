import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'Platform API is running!' });
});

// Code execution mock endpoint (will merge with Judge0 later)
app.post('/api/execute', async (req: Request, res: Response) => {
    try {
        const { code, language, problemId } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required.' });
        }

        // TODO: Integrate local Judge0 container here
        console.log(`Received ${language} code for problem ${problemId}`);

        // Mocking a successful response for now
        setTimeout(() => {
            res.json({
                status: 'Accepted',
                output: '[0, 1]',
                executionTime: '45 ms',
                memory: '41.2 MB'
            });
        }, 1500);

    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({ error: 'Internal server error during execution' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
