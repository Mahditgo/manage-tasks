const { z } = require('zod');

const taskValidationSchema = z.object({
  taskName: z.string().min(1, { message: "Task name is required" }),  
  description: z.string().optional(), 
  attachment: z.string().optional(),   
});


module.exports = {
    taskValidationSchema
}