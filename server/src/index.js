const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Configure CORS properly
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "my_super_secret_key"; // In prod, use env var

// SSL configuration
const options = {
    key: fs.readFileSync('../ssl/key.pem'),
    cert: fs.readFileSync('../ssl/cert.pem')
};

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Nexus CRM API is running' });
});

app.use(express.json());

// --- Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body.email);
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log('Login failed: User not found', email);
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare hashed password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            // For backward compatibility with seeded plain-text passwords
            if (password === user.password) {
                console.log('Login success (plain-text):', email);
                const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
                return res.json({ token, user: { name: user.name, email: user.email, role: 'Admin' } });
            }
            console.log('Login failed: Invalid password', email);
            return res.status(400).json({ error: 'Invalid password' });
        }

        console.log('Login success:', email);
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email, role: 'Admin' } });
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('Register request body:', req.body);
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            console.log('Missing fields');
            return res.status(400).json({ error: 'Missing fields' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log('User exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });
        console.log('User created:', user.id);

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email, role: 'New User' } });
    } catch (e) {
        console.error('Register error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, email }
        });

        res.json({
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                role: 'Admin' // Keeping role consistent with existing logic
            }
        });
    } catch (e) {
        console.error('Profile update error:', e);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// --- Dashboard Routes ---
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const totalRevenue = await prisma.deal.aggregate({
            _sum: { value: true },
            where: { stage: 'Won' }
        });

        const activeUsers = await prisma.user.count();
        const newDeals = await prisma.deal.count({
            where: { stage: 'Lead' }
        });

        res.json({
            totalRevenue: totalRevenue._sum.value || 0,
            activeUsers,
            newDeals,
            retentionRate: 98.5 // Hardcoded for demo parity
        });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

app.get('/api/dashboard/recent-deals', authenticateToken, async (req, res) => {
    try {
        const deals = await prisma.deal.findMany({
            take: 5,
            orderBy: { id: 'desc' }
        });

        // Add some colors for the UI
        const colors = ['bg-primary-40', 'bg-secondary-40', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500'];
        const dealsWithColors = deals.map((deal, index) => ({
            ...deal,
            color: colors[index % colors.length]
        }));

        res.json(dealsWithColors);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch recent deals' });
    }
});

// --- Contacts Routes ---
app.get('/api/contacts', authenticateToken, async (req, res) => {
    const contacts = await prisma.contact.findMany();
    res.json(contacts);
});

app.post('/api/contacts', authenticateToken, async (req, res) => {
    const contact = await prisma.contact.create({ data: req.body });
    res.json(contact);
});

app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
    await prisma.contact.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

// --- Deals Routes ---
app.get('/api/deals', authenticateToken, async (req, res) => {
    const deals = await prisma.deal.findMany();
    res.json(deals);
});

app.post('/api/deals', authenticateToken, async (req, res) => {
    const deal = await prisma.deal.create({ data: req.body });
    res.json(deal);
});

app.put('/api/deals/:id', authenticateToken, async (req, res) => {
    const deal = await prisma.deal.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
    });
    res.json(deal);
});

app.delete('/api/deals/:id', authenticateToken, async (req, res) => {
    await prisma.deal.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

app.delete('/api/deals/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.deal.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete deal' });
    }
});

// --- Tasks Routes ---
app.get('/api/tasks', authenticateToken, async (req, res) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
    const task = await prisma.task.create({ data: req.body });
    res.json(task);
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    const task = await prisma.task.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
    });
    res.json(task);
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

// --- Backlog Routes ---
app.get('/api/backlog', authenticateToken, async (req, res) => {
    const items = await prisma.backlogItem.findMany();
    res.json(items);
});

app.post('/api/backlog', authenticateToken, async (req, res) => {
    const item = await prisma.backlogItem.create({ data: req.body });
    res.json(item);
});

app.delete('/api/backlog/:id', authenticateToken, async (req, res) => {
    await prisma.backlogItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

// --- Invoices Routes ---
app.get('/api/invoices', authenticateToken, async (req, res) => {
    const invoices = await prisma.invoice.findMany();
    res.json(invoices);
});

app.post('/api/invoices', authenticateToken, async (req, res) => {
    const invoice = await prisma.invoice.create({ data: req.body });
    res.json(invoice);
});

app.delete('/api/invoices/:id', authenticateToken, async (req, res) => {
    await prisma.invoice.delete({ where: { id: req.params.id } }); // String ID
    res.json({ message: 'Deleted' });
});

https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
});
