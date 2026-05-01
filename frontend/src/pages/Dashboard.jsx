import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ status: '', page: 1 });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await taskAPI.getTasks(filters);
      setTasks(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask._id, taskData);
      } else {
        await taskAPI.createTask(taskData);
      }
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(id);
        fetchTasks();
      } catch (error) {
        alert(error.response?.data?.error || 'Delete failed');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Form & Filters */}
        <div className="space-y-6">
          <TaskForm
            onSubmit={handleCreateOrUpdate}
            initialData={editingTask}
            onCancel={editingTask ? () => setEditingTask(null) : null}
          />

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Main Content: List & Pagination */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading tasks...</p>
            </div>
          ) : (
            <>
              <TaskList
                tasks={tasks}
                onEdit={setEditingTask}
                onDelete={handleDelete}
              />

              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-4">
                  <button
                    disabled={filters.page === 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    disabled={filters.page === pagination.pages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
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
