import express from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       409:
 *         description: Room is not available
 * 
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */

const router = express.Router();
const prisma = new PrismaClient();

// check room is available
const isRoomAvailable = async (buildings_buildingId, startTime, endTime, excludeBookingId = null) => {
  const room = await prisma.room.findFirst({
    where: {
      buildings_buildingId: buildings_buildingId,
    }
  });

  if (!room || room.roomStatus !== 'AVAILABLE') {
    return {
      available: false,
      message: room ? 'Room is currently unavailable or under maintenance' : 'Room not found'
    };
  }

  //check existing bookings
  const existingBooking = await prisma.booking.findFirst({
    where: {
      buildings_buildingId: buildings_buildingId,
      AND: [
        {
          startTime: {
            lte: new Date(endTime)
          }
        },
        {
          endTime: {
            gte: new Date(startTime)
          }
        },
        {
          bookingId: {
            not: excludeBookingId
          }
        }
      ]
    }
  });

  return {
    available: !existingBooking,
    message: existingBooking ? 'Room is already booked for this time period' : null
  };
};

//Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        building: true
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by id
router.get('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingId: req.params.id },
      include: {
        building: true
      }
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { buildings_buildingId, startTime, endTime } = req.body;

    const availabilityCheck = await isRoomAvailable(buildings_buildingId, startTime, endTime);
    
    if (!availabilityCheck.available) {
      return res.status(409).json({ 
        error: availabilityCheck.message 
      });
    }

    const booking = await prisma.booking.create({
      data: {
        ...req.body,
        lastUpdate: new Date()
      }
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const { buildings_buildingId, startTime, endTime } = req.body;

    const availabilityCheck = await isRoomAvailable(
      buildings_buildingId, 
      startTime, 
      endTime, 
      req.params.id
    );
    
    if (!availabilityCheck.available) {
      return res.status(409).json({ 
        error: availabilityCheck.message 
      });
    }

    const booking = await prisma.booking.update({
      where: { bookingId: req.params.id },
      data: {
        ...req.body,
        lastUpdate: new Date()
      }
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { bookingId: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;