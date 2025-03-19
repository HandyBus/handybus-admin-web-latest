import { z } from 'zod';

export const FutureRouteSchema = z.object({
  trans_id: z.string(),
  routes: z.array(
    z.object({
      result_code: z.number(),
      result_msg: z.string(),
      summary: z.object({
        origin: z.object({
          name: z.string(),
          x: z.number(),
          y: z.number(),
        }),
        destination: z.object({
          name: z.string(),
          x: z.number(),
          y: z.number(),
        }),
        waypoints: z.array(
          z.object({
            name: z.string(),
            x: z.number(),
            y: z.number(),
          }),
        ),
        priority: z.string(),
        bound: z
          .object({
            min_x: z.number(),
            min_y: z.number(),
            max_x: z.number(),
            max_y: z.number(),
          })
          .optional(),
        fare: z.object({
          taxi: z.number(),
          toll: z.number(),
        }),
        distance: z.number(),
        duration: z.number(),
      }),
      sections: z.array(
        z.object({
          distance: z.number(),
          duration: z.number(),
          bound: z
            .object({
              min_x: z.number(),
              min_y: z.number(),
              max_x: z.number(),
              max_y: z.number(),
            })
            .optional(),
          roads: z
            .array(
              z.object({
                name: z.string(),
                distance: z.number(),
                duration: z.number(),
                traffic_speed: z.number(),
                traffic_state: z.number(),
                vertexes: z.array(z.number()),
              }),
            )
            .optional(),
          guide: z
            .object({
              name: z.string(),
              x: z.number(),
              y: z.number(),
              distance: z.number(),
              duration: z.number(),
              type: z.string(),
              guidance: z.string(),
              road_index: z.number(),
            })
            .optional(),
        }),
      ),
    }),
  ),
});

export type FutureRouteSchemaType = z.infer<typeof FutureRouteSchema>;
