'use client';

import { useEffect, useState } from 'react';
import { postsAPI } from '@/lib/api';
import { FiPlus, FiClock, FiCheckCircle } from 'react-icons/fi';

// Task columns
const COLUMNS = {
    OPEN: 'To Do',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Done'
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            // Filter for posts of type TASK
            const response = await postsAPI.getAll({ type: 'TASK' });
            setTasks(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = (result: any) => {
        // Implementing optimistic update for drag and drop
        // In a real app, we would make an API call to update status
        if (!result.destination) return;

        // Logic to update local state...
    };

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.taskStatus === status);
    };

    return (
        <div className="min-h-screen p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Project <span className="gradient-text">Board</span></h1>
                    <p className="text-gray-400">Manage tasks and collaborations</p>
                </div>
                <button className="btn-primary flex items-center">
                    <FiPlus className="mr-2" /> New Task
                </button>
            </header>

            {loading ? (
                <div className="text-center">Loading board...</div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    {Object.entries(COLUMNS).map(([statusKey, title]) => (
                        <div key={statusKey} className="glass-card flex flex-col h-full bg-dark-800/50">
                            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
                                <h3 className="font-bold text-lg">{title}</h3>
                                <span className="bg-dark-700 px-2 py-1 rounded text-xs">{getTasksByStatus(statusKey).length}</span>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                {getTasksByStatus(statusKey).map(task => (
                                    <div key={task.id} className="bg-dark-700 p-4 rounded-lg border border-dark-600 hover:border-primary-500 cursor-pointer transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs px-2 py-0.5 rounded ${task.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {task.isPaid ? 'Paid' : 'Volunteer'}
                                            </span>
                                            {task.deadline && (
                                                <span className="text-xs text-red-400 flex items-center">
                                                    <FiClock className="mr-1" /> Due soon
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold mb-2">{task.title}</h4>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex -space-x-2">
                                                <img src={`https://ui-avatars.com/api/?name=${task.author?.name}`} className="w-6 h-6 rounded-full border border-dark-800" />
                                            </div>
                                            <span className="text-xs text-gray-500">{task.applyCount} applicants</span>
                                        </div>
                                    </div>
                                ))}

                                {getTasksByStatus(statusKey).length === 0 && (
                                    <div className="text-center py-10 text-gray-600 border-2 border-dashed border-dark-700 rounded-lg">
                                        No tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
