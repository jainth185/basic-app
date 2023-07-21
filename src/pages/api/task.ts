// pages/api/tasks.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from './dbConnect';
import loggerMiddleware from './middleware';

interface Task {
  id: number;
  title: string;
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use the loggerMiddleware to log the incoming request
  loggerMiddleware(req, res, async () => {
    const client = await connectToDatabase();
    const db = client.db(); // Access your database
    const tasksCollection = db.collection<Task>('tasks');

    if (req.method === 'GET') {
      // Fetch tasks from MongoDB
      const tasks = await tasksCollection.find().toArray();
      res.status(200).json(tasks);
    } else if (req.method === 'POST') {
      const { title, description } = req.body;

      if (!title || !description) {
        res.status(400).json({ error: 'Title and description are required.' });
        return;
      }

      const newTask: Task = {
        id: Date.now(), // You may want to generate unique IDs using a better approach in production.
        title,
        description,
      };

      await tasksCollection.insertOne(newTask);
      res.status(201).json(newTask);
    } else if (req.method === 'PUT') {
      const id = parseInt(req.body.id);
      const { title, description } = req.body;

      if (!title || !description) {
        res.status(400).json({ error: 'Title and description are required.' });
        return;
      }

      // Construct the filter to identify the task to update based on the 'id'
      const filter = { id };
      console.log(filter)

      // Construct the update operation using the '$set' operator
      const update = { $set: { title, description } };
      try {
        const result = await tasksCollection.updateOne(filter, update);
        console.log(result)
        if (result.modifiedCount === 0) {
          res.status(404).json({ error: 'Task not found.' });
          return;
        }

        res.status(200).json({ id, title, description });
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'An error occurred while updating the task.' });
      }

    } else if (req.method === 'DELETE') {
      const id = parseInt(req.body); 

      const result = await tasksCollection.deleteOne({ id });

      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Task not found.' });
        return;
      }

      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed.' });
    }

    client.close(); // Close the MongoDB connection after each request
  });
}
