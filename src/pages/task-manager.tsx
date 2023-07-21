import { useState, useEffect } from "react";
import "./globals.css";
import axios from "axios";
import Link from "next/link";


interface Task {
  id: number;
  title: string;
  description: string;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState<{
    taskId: number | null;
    title: string;
    description: string;
  }>({
    taskId: null,
    title: "",
    description: "",
  });

  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
    setEditingTask((prevEditingTask) => ({
      ...prevEditingTask,
      title: e.target.value,
    }));
  };

  const handleNewTaskDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewTaskDescription(e.target.value);
    setEditingTask((prevEditingTask) => ({
      ...prevEditingTask,
      description: e.target.value,
    }));
  };

  const handleAddTask = async () => {
    if (newTask.trim() !== "" && newTaskDescription.trim() !== "") {
      const taskData = {
        title: newTask,
        description: newTaskDescription,
      };
  
      try {
        const response = await axios.post("/api/task", taskData);
        const newTask = response.data;
  
        // Check if the new task already exists in the tasks array (based on the task ID)
        const taskAlreadyExists = tasks.some((task) => task.id === newTask.id);
  
        if (!taskAlreadyExists) {
          // Add the new task to the tasks state only if it doesn't already exist
          setTasks([...tasks, newTask]);
        }
  
        // Reset the input fields
        setNewTask("");
        setNewTaskDescription("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };
  


  const handleEditTask = (task: Task) => {
    setEditingTask({
      taskId: task.id,
      title: task.title,
      description: task.description,
    });
    setNewTask(task.title);
    setNewTaskDescription(task.description);
  };

  const handleUpdateTask = async () => {
    if (
      editingTask.taskId !== null &&
      editingTask.title.trim() !== "" &&
      editingTask.description.trim() !== ""
    ) {
      try {
        const updatedTaskData = {
          id: editingTask.taskId,
          title: editingTask.title,
          description: editingTask.description,
        };

        // Make the PUT request to update the task
        await axios.put(`/api/task/`, updatedTaskData);

        // Find the index of the old task in the tasks array
        const index = tasks.findIndex((task) => task.id === editingTask.taskId);

        // Create the updated task object
        const updatedTask = { ...editingTask, id: editingTask.taskId };

        // Create a new array with the updated task and remove the old task
        const updatedTasks = [
          ...tasks.slice(0, index),
          updatedTask,
          ...tasks.slice(index + 1),
        ];

        // Update the tasks state with the new array
        setTasks(updatedTasks);

        // Reset the editingTask state
        setEditingTask({ taskId: null, title: "", description: "" });
        setNewTask("");
        setNewTaskDescription("");
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingTask({ taskId: null, title: "", description: "" });
    setNewTask("");
    setNewTaskDescription("");
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`/api/task/`, { data: taskId });
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/task");
        const fetchedTasks = response.data;
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Manager</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={editingTask.taskId !== null ? editingTask.title : newTask}
          onChange={handleNewTaskChange}
          className="flex-grow border border-gray-300 rounded-l p-2"
          placeholder="Enter a title of the blog"
        />
      </div>
      <div className="mb-4">
        <textarea
          value={editingTask.taskId !== null ? editingTask.description : newTaskDescription}
          onChange={handleNewTaskDescriptionChange}
          className="w-full border border-gray-300 rounded p-2 resize-y h-40"
          placeholder="Enter the blog content"
        />
      </div>
      <button
        onClick={editingTask.taskId !== null ? handleUpdateTask : handleAddTask}
        className="bg-blue-500 text-white px-6 py-1 mb-4 rounded-r hover:bg-blue-600"
      >
        {editingTask.taskId !== null ? "Save" : "Add"}
      </button>
      {editingTask.taskId !== null && (
        <button
          onClick={cancelEdit}
          className="text-gray-500 px-4 py-1 mb-4"
        >
          Cancel
        </button>
      )}
      <Link href='/' className="mt-4 text-blue  p-2 pd-2.5 ml-2 rounded-md hover:bg-gray-200 transition-all duration-200">
        Home
      </Link>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-gray-100 shadow-lg rounded p-3"
          >
            <>
              <Link href={`/${task.id}`} passHref legacyBehavior>
                {task.title}
              </Link>
              <div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEditTask(task)}
                  className="text-blue-500 hover:text-blue-600 ml-2"
                >
                  Edit
                </button>
              </div>
            </>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default TaskManager;
