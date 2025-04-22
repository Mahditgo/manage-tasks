
const taskService = require('../services/task.service');
const { taskValidationSchema } = require('../validators/task.validator');

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
     const parsedData = taskValidationSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.errors[0].message });
    }
    const { taskName, description } = parsedData.data;
    const attachment = req.file ? req.file.path : null;

    const task = await taskService.createTask({ taskName, description, attachment, userId });

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};


exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json({ tasks });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};


exports.getTaskById = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id, '333333333');
    
    const task = await taskService.getTaskById(id);
    res.json({ task });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const userId = req.user.id
  try {
    const task = await taskService.updateTask(req.params.id, req.body, userId);
    res.json({ message: 'Task updated', task });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const userId = req.user.id
  try {
    await taskService.deleteTask(req.params.id, userId);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
