// components/ThreadActions.js
export function ThreadActions({ db, threadId }) {
  const { actions, loading, addThreadAction, updateActionStatus } =
    useThreadActions(db, threadId);
  const [newActionText, setNewActionText] = React.useState("");

  const handleAddAction = async (e) => {
    e.preventDefault();
    if (!newActionText.trim()) return;

    await addThreadAction(newActionText);
    setNewActionText("");
  };

  if (loading) {
    return <LoadingSpinner size="md" />;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
        Thread Actions
      </h3>

      {/* Vertical stepper for thread actions */}
      <div className="relative pl-8 mb-6">
        {actions.length > 0 && (
          <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-secondary-200 dark:bg-secondary-700"></div>
        )}

        {actions.map((action, index) => {
          // Find the first pending action index
          const firstPendingIndex = actions.findIndex(
            (a) => a.status === "pending"
          );

          // Determine if this action is the current active step
          const isCurrent =
            action.status === "pending" && index === firstPendingIndex;

          return (
            <div key={action.id} className="mb-6 relative">
              {/* Status indicator dot */}
              <div
                className={`absolute left-3 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                  action.status === "completed"
                    ? "bg-accent-500 text-white"
                    : isCurrent
                    ? "bg-primary-500 text-white"
                    : action.status === "pending"
                    ? "bg-white dark:bg-secondary-800 border-2 border-primary-500 dark:border-primary-400"
                    : "bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400"
                }`}
              >
                {action.status === "completed" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {action.status === "discarded" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {action.status === "delegated" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6H2a8 8 0 0116 0h-2a6 6 0 00-6-6z" />
                  </svg>
                )}
              </div>

              {/* Action content */}
              <div
                className={`pl-6 ${
                  action.status === "completed"
                    ? "text-secondary-500 dark:text-secondary-400 line-through"
                    : isCurrent
                    ? "text-secondary-900 dark:text-secondary-100 font-medium"
                    : action.status === "pending"
                    ? "text-secondary-700 dark:text-secondary-300"
                    : "text-secondary-500 dark:text-secondary-400"
                }`}
              >
                <p>{action.text}</p>

                {action.status === "pending" && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => updateActionStatus(action.id, "completed")}
                      className="px-2 py-1 text-xs font-medium rounded bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300 hover:bg-accent-200 dark:hover:bg-accent-800"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateActionStatus(action.id, "discarded")}
                      className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => updateActionStatus(action.id, "delegated")}
                      className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800"
                    >
                      Delegate
                    </button>
                  </div>
                )}

                {action.status !== "pending" && (
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                    {action.status}{" "}
                    {action.completedAt
                      ? `on ${new Date(
                          action.completedAt
                        ).toLocaleDateString()}`
                      : ""}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add new action form */}
      <form onSubmit={handleAddAction} className="mt-4">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={newActionText}
            onChange={(e) => setNewActionText(e.target.value)}
            placeholder="Add a new action step..."
            className="px-4 py-2 border border-secondary-200 dark:border-secondary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Add Action
          </button>
        </div>
      </form>
    </div>
  );
}
