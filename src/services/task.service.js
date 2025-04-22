const prisma = require('../config/db.config');

exports.createTask = async (data) => {
  return await prisma.task.create({ data });
};

exports.getAllTasks = async () => {
  return await prisma.task.findMany();
};

exports.getTaskById = async (id) => {
  const task = await prisma.task.findMany({ where: { userId : Number(id) } });
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }
  return task;
};

exports.updateTask = async (id, data, userId) => {

   const task = await prisma.task.findUnique({ where: {id : Number(id)} });

   
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
    }
    console.log(task, 'iddddd');
    
   if (task.userId !== userId) {
  const error = new Error('Access denied');
  error.status = 403;
  throw error;
}

  return await prisma.task.update({
    where: { id: Number(id) },
    data,
  });
};

exports.deleteTask = async (id, userId) => {
   const task = await prisma.task.findUnique({ where: {id : Number(id)} });

   
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
    }
    console.log(task, 'iddddd');
    
   if (task.userId !== userId) {
  const error = new Error('Access denied');
  error.status = 403;
  throw error;
}

  return await prisma.task.delete({
    where: { id: Number(id) },
  });
};
