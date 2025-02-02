import express from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of all rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room created successfully
 * 
 * /api/rooms/{id}/status:
 *   patch:
 *     summary: Update room status
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomStatus:
 *                 type: string
 *                 enum: [AVAILABLE, UNAVAILABLE, MAINTENANCE]
 *     responses:
 *       200:
 *         description: Room status updated successfully
 */

const router = express.Router();
const prisma = new PrismaClient();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        building: true
      }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { roomId: req.params.id },
      include: {
        building: true
      }
    });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create room
router.post('/', async (req, res) => {
  try {
    const room = await prisma.room.create({
      data: req.body
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update room
router.put('/:id', async (req, res) => {
  try {
    const room = await prisma.room.update({
      where: { roomId: req.params.id },
      data: req.body
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update room status
router.patch('/:id/status', async (req, res) => {
  try {
    const { roomStatus } = req.body;
    const room = await prisma.room.update({
      where: { roomId: req.params.id },
      data: { roomStatus }
    });
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete room
router.delete('/:id', async (req, res) => {
  try {
    await prisma.room.delete({
      where: { roomId: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;