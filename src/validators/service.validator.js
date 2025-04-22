const { z } = require("zod");

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fromLocation: z.string().min(1, "From location is required"),
  toLocation: z.string().min(1, "To location is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  departureTime: z.coerce.date({ invalid_type_error: "Invalid date format" }),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  isActive: z.boolean(),
});

module.exports = {
  serviceSchema,
};
