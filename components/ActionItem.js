export function ActionItem({
  action,
  topic,
  onStatusChange,
  navigateToThread,
}) {
  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-4 flex items-center border-l-4 ${
        action.untouched
          ? "border-red-500"
          : "border-secondary-300 dark:border-secondary-600"
      }`}
    >
      <button
        onClick={() => onStatusChange(action.id, "completed")}
        className="w-6 h-6 rounded-full border-2 border-secondary-300 dark:border-secondary-500 hover:border-accent-500 dark:hover:border-accent-400 mr-3 flex-shrink-0"
        aria-label="Mark as completed"
      ></button>
      <div className="flex-grow">
        <p className="text-secondary-900 dark:text-secondary-100 line-clamp-2">
          {action.text}
        </p>

        {/* If this is a thread action, show the thread title and link */}
        {action.threadId && action.threadTitle && (
          <button
            onClick={() => navigateToThread(action.threadId)}
            className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
          >
            From thread: {action.threadTitle}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {action.untouched && (
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            Untouched for over a day
          </span>
        )}

        {topic && (
          <span
            className="text-xs px-2 py-0.5 rounded-full ml-2"
            style={{
              backgroundColor: `${topic.color}20`,
              color: topic.color,
            }}
          >
            {topic.name}
          </span>
        )}
      </div>
      <div className="flex space-x-1 ml-2">
        <button
          onClick={() => onStatusChange(action.id, "delayed")}
          className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 p-2"
          title="Delay"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <button
          onClick={() => onStatusChange(action.id, "discarded")}
          className="text-red-500 hover:text-red-600 dark:hover:text-red-400 p-2"
          title="Discard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
