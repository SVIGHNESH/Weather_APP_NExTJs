"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../generated/prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient({});
router.use(auth_1.authMiddleware);
router.post('/', async (req, res) => {
    try {
        const { name, latitude, longitude, isFavorite } = req.body;
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!name || latitude === undefined || longitude === undefined) {
            res.status(400).json({ error: 'name, latitude, and longitude are required' });
            return;
        }
        const location = await prisma.location.create({
            data: {
                name,
                latitude,
                longitude,
                isFavorite: isFavorite || false,
                userId: req.userId,
            },
        });
        res.status(201).json(location);
    }
    catch (error) {
        console.error('Create location error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/', async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const locations = await prisma.location.findMany({
            where: { userId: req.userId },
            orderBy: { lastAccessedAt: 'desc' },
        });
        res.json(locations);
    }
    catch (error) {
        console.error('Get locations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const location = await prisma.location.findUnique({ where: { id } });
        if (!location || location.userId !== req.userId) {
            res.status(404).json({ error: 'Location not found' });
            return;
        }
        await prisma.location.delete({ where: { id } });
        res.json({ message: 'Location deleted' });
    }
    catch (error) {
        console.error('Delete location error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.patch('/:id', async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { isFavorite } = req.body;
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (isFavorite === undefined) {
            res.status(400).json({ error: 'isFavorite field is required' });
            return;
        }
        const location = await prisma.location.findUnique({ where: { id } });
        if (!location || location.userId !== req.userId) {
            res.status(404).json({ error: 'Location not found' });
            return;
        }
        const updatedLocation = await prisma.location.update({
            where: { id },
            data: { isFavorite },
        });
        res.json(updatedLocation);
    }
    catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
