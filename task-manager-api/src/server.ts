import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3001;

interface Task {
  id: number;
  title: string;
  description: string;
}

let tasks: Task[] = [];

app.use(bodyParser.json());
app.use(cors());

// Get all tasks
app.get('/api/tasks', (req: Request, res: Response) => {
  res.status(200).json(tasks);
});

// Get a task by ID
app.get('/api/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    res.status(404).json({ error: 'Task not found.' });
    return;
  }

  res.status(200).json(task);
});

// Add a new task
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title && !description) {
    res.status(400).json({ error: 'Title and description are required.' });
    return;
  }

  const newTask: Task = {
    id: tasks.length + 1,
    title,
    description,
  };

  tasks.push(newTask);
  console.log(tasks)

  res.status(201).json(newTask);
});

// Update a task
app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    res.status(404).json({ error: 'Task not found.' });
    return;
  }

  tasks[taskIndex].title = title || tasks[taskIndex].title;
  tasks[taskIndex].description = description || tasks[taskIndex].description;

  res.status(200).json(tasks[taskIndex]);
});

// Delete a task
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    res.status(404).json({ error: 'Task not found.' });
    return;
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json(deletedTask);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
