import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Room Booking API',
      version: '1.0.0',
      description: 'API documentation for Room Booking System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Booking: {
          type: 'object',
          properties: {
            bookingId: { type: 'string' },
            bookingName: { type: 'string' },
            bookingDESC: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            createdBy: { type: 'string' },
            modifiedBy: { type: 'string' },
            type: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'ONCE'] },
            repeatType: { type: 'string', enum: ['EVERY_DAY', 'EVERY_WEEK', 'EVERY_MONTH', 'NONE'] },
            repeatDay: { type: 'string', enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] },
            buildings_buildingId: { type: 'string' }
          }
        },
        Room: {
          type: 'object',
          properties: {
            roomId: { type: 'string' },
            roomStatus: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'] },
            buildings_buildingId: { type: 'string' }
          }
        },
        Building: {
          type: 'object',
          properties: {
            buildingId: { type: 'string' },
            floor: { type: 'integer' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], 
};

export const specs = swaggerJsdoc(options);
