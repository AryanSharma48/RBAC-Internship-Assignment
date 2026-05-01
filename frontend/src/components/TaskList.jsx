import { useState } from 'react';
import { Trash2, CheckCircle, Clock, Pencil, Check, X } from 'lucide-react';

const TaskCard = ({ task, onDelete, onToggle, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    onUpdate(task._id, { title: title.trim(), description: description.trim(), status: task.status });
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setEditing(false);
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm transition-all ${task.status === 'completed' ? 'opacity-70' : ''}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Toggle complete button */}
          <button
            onClick={() => onToggle(task._id, task.status)}
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.status === 'completed'
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {task.status === 'completed' && <Check className="h-3 w-3" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2">
                <input
                  autoFocus
                  className="w-full text-sm font-medium border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="w-full text-sm text-gray-600 border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            ) : (
              <>
                <p className={`font-medium text-gray-900 break-words ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-500 mt-0.5 break-words">{task.description}</p>
              </>
            )}

            <div className="flex items-center gap-2 mt-2">
              {task.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3" /> Completed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  <Clock className="h-3 w-3" /> Pending
                </span>
              )}
              {task.user?.name && (
                <span className="text-[10px] text-gray-400">{task.user.name}</span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  title="Save"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, onDelete, onToggle, onUpdate }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border">
        <CheckCircle className="h-10 w-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">No tasks yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TaskList;
