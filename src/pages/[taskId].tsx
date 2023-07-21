import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import "./globals.css";

type Task = {
  id: number;
  title: string;
  description: string;
};

const TaskDetails = () => {
  const router = useRouter();
  const id = router.query.taskId;
  const taskId = parseInt(id as string, 10); // Parse the id to an integer with base 10

  const [task, setTask] = useState<Task[] | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get<Task[]>(`/api/task/`); // Define the type of response.data as Task[]
        const fetchedTask = response.data;
        setTask(fetchedTask);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  const filteredTask = task.find((task) => task.id === taskId); // Change tasks to task for better clarity
  if (!filteredTask) {
    return <div>Task not found</div>;
  }

  const { title, description } = filteredTask;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default TaskDetails;
