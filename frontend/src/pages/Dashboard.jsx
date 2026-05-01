import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ status: '', page: 1 });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await taskAPI.getTasks(filters);
      setTasks(data.data);
      setPagination({ page: data.page, pages: data.pages });
    } catch (err) {
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (taskData) => {
    try {
      await taskAPI.createTask(taskData);
      showToast('Task created');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
    }
  };

  // Called by inline edit on the card
  const handleUpdate = async (id, taskData) => {
    try {
      await taskAPI.updateTask(id, taskData);
      showToast('Task updated');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
    }
  };

  // Toggle between pending ↔ completed directly from the circle button
  const handleToggle = async (id, currentStatus) => {
    const next = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      const task = tasks.find(t => t._id === id);
      await taskAPI.updateTask(id, { title: task.title, description: task.description, status: next });
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status: next } : t));
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.deleteTask(id);
      showToast('Task deleted');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <TaskForm onSubmit={handleCreate} />

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">Filter by status</h3>
            </div>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Task list */}
        <div className="lg:col-span-2 space-y-5">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto" />
              <p className="mt-4 text-sm text-gray-400">Loading tasks...</p>
            </div>
          ) : (
            <>
              <TaskList
                tasks={tasks}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
              />

              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-2">
                  <button
                    disabled={filters.page === 1}
                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                    className="p-2 border rounded-md disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    disabled={filters.page === pagination.pages}
                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                    className="p-2 border rounded-md disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
