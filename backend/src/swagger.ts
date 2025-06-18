import swaggerJSDoc from 'swagger-jsdoc';
import {} from './swagger/paths/index'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Supermarket Complaint Management API',
    version: '1.0.0',
    description: 'API documentation for Supermarket Complaint Management System',
  },
  servers: [
    {
      url: 'http://localhost:3344',
      description: 'Development server'
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '60f1b2b3c4e5f6g7h8i9j0k1'
          },
          fullName: {
            type: 'string',
            example: 'John Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com'
          },
          phoneNo: {
            type: 'string',
            example: '+1234567890'
          },
          role: {
            type: 'string',
            enum: ['customer', 'branch_supervisor', 'admin'],
            example: 'customer'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Branch: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '60f1b2b3c4e5f6g7h8i9j0k1'
          },
          branchCode: {
            type: 'string',
            example: 'BR001'
          },
          branchName: {
            type: 'string',
            example: 'Downtown Branch'
          },
          address: {
            type: 'string',
            example: '123 Main Street, City, State 12345'
          },
          phoneNo: {
            type: 'string',
            example: '+1234567890'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      BranchSupervisor: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '60f1b2b3c4e5f6g7h8i9j0k1'
          },
          branchCode: {
            type: 'string',
            example: 'BR001'
          },
          user: {
            $ref: '#/components/schemas/User'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Customer: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '60f1b2b3c4e5f6g7h8i9j0k1'
          },
          user: {
            $ref: '#/components/schemas/User'
          },
          eCardHolder: {
            type: 'boolean',
            example: false
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Complaint: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '60f1b2b3c4e5f6g7h8i9j0k1'
          },
          description: {
            type: 'string',
            example: 'Poor customer service experience'
          },
          branchCode: {
            type: 'string',
            example: 'BR001'
          },
          createdBy: {
            type: 'string',
            nullable: true,
            example: '60f1b2b3c4e5f6g7h8i9j0k1'
          },
          isAnonymous: {
            type: 'boolean',
            example: false
          },
          actionsTaken: {
            type: 'array',
            items: {
              type: 'object'
            }
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'resolved', 'rejected'],
            example: 'pending'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Error message'
          },
          errors: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Operation successful'
          },
          data: {
            type: 'object'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    'src/swagger/paths/*.ts'
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;