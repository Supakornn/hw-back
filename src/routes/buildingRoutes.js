import express from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * @swagger
 * /api/buildings:
 *   get:
 *     summary: Get all buildings
 *     tags: [Buildings]
 *     responses:
 *       200:
 *         description: List of all buildings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Building'
 *   post:
 *     summary: Create a new building
 *     tags: [Buildings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Building'
 *     responses:
 *       201:
 *         description: Building created successfully
 * 
 * /api/buildings/{id}:
 *   get:
 *     summary: Get building by ID
 *     tags: [Buildings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Building details
 *       404:
 *         description: Building not found
 */

const router = express.Router();
const prisma = new PrismaClient();

// Get all buildings
router.get('/', async (req, res) => {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        rooms: true,
        bookings: true
      }
    });
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get building by ID
router.get('/:id', async (req, res) => {
  try {
    const building = await prisma.building.findUnique({
      where: { buildingId: req.params.id },
      include: {
        rooms: true,
        bookings: true
      }
    });
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }
    res.json(building);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create building
router.post('/', async (req, res) => {
  try {
    const building = await prisma.building.create({
      data: req.body
    });
    res.status(201).json(building);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update building
router.put('/:id', async (req, res) => {
  try {
    const building = await prisma.building.update({
      where: { buildingId: req.params.id },
      data: req.body
    });
    res.json(building);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete building
router.delete('/:id', async (req, res) => {
  try {
    await prisma.building.delete({
      where: { buildingId: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

