import { z } from 'zod';
import { 
  insertFarmSchema, farms, 
  insertFieldSchema, fields,
  insertCropSchema, crops,
  insertActivitySchema, activities,
  insertAdvisorySchema, advisories
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  farms: {
    list: {
      method: 'GET' as const,
      path: '/api/farms',
      responses: {
        200: z.array(z.custom<typeof farms.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/farms',
      input: insertFarmSchema,
      responses: {
        201: z.custom<typeof farms.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/farms/:id',
      responses: {
        200: z.custom<typeof farms.$inferSelect & { fields: (typeof fields.$inferSelect)[] }>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/farms/:id',
      input: insertFarmSchema.partial(),
      responses: {
        200: z.custom<typeof farms.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/farms/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  fields: {
    list: {
      method: 'GET' as const,
      path: '/api/farms/:farmId/fields',
      responses: {
        200: z.array(z.custom<typeof fields.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/farms/:farmId/fields',
      input: insertFieldSchema.omit({ farmId: true }),
      responses: {
        201: z.custom<typeof fields.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/fields/:id',
      responses: {
        200: z.custom<typeof fields.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/fields/:id',
      input: insertFieldSchema.partial(),
      responses: {
        200: z.custom<typeof fields.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/fields/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  crops: {
    list: {
      method: 'GET' as const,
      path: '/api/fields/:fieldId/crops',
      responses: {
        200: z.array(z.custom<typeof crops.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/fields/:fieldId/crops',
      input: insertCropSchema.omit({ fieldId: true }),
      responses: {
        201: z.custom<typeof crops.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/crops/:id',
      responses: {
        200: z.custom<typeof crops.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/crops/:id',
      input: insertCropSchema.partial(),
      responses: {
        200: z.custom<typeof crops.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  activities: {
    list: {
      method: 'GET' as const,
      path: '/api/activities',
      input: z.object({
        fieldId: z.coerce.number().optional(),
        cropId: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/activities',
      input: insertActivitySchema,
      responses: {
        201: z.custom<typeof activities.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  advisories: {
    list: {
      method: 'GET' as const,
      path: '/api/advisories',
      responses: {
        200: z.array(z.custom<typeof advisories.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/advisories/generate',
      input: z.object({
        fieldId: z.number().optional(),
        cropId: z.number().optional(),
        context: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof advisories.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
