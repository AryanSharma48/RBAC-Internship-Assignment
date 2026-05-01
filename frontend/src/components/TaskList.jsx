import { Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-gray-500">No tasks found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-start hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
              {task.status === 'completed' ? (
                <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3" />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3" />
                  <span>Pending</span>
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="text-[10px] text-gray-400">
              Owned by: {task.user?.name} ({task.user?.email})
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
