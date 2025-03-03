export function ThreadDetail({ db, thread, navigateTo }) {
  const [currentThread, setCurrentThread] = React.useState(thread);
  const [updates, setUpdates] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [newUpdate, setNewUpdate] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Load the thread data
      const threadData = await db.get("threads", thread.id);
      setCurrentThread(threadData);

      // Load thread updates
      const index = db.transaction("threadUpdates").store.index("threadId");
      const updateData = await index.getAll(IDBKeyRange.only(thread.id));
      updateData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setUpdates(updateData);

      // Load topics
      const topicsData = await db.getAll("topics");
      setTopics(topicsData);

      setLoading(false);
    }

    loadData();
  }, [db, thread.id]);

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.trim()) return;

    const update = {
      threadId: thread.id,
      content: newUpdate,
      timestamp: new Date().toISOString(),
    };

    const id = await db.add("threadUpdates", update);
    const newUpdateWithId = { ...update, id };
    setUpdates([newUpdateWithId, ...updates]);
    setNewUpdate("");
  };

  const handleStateChange = async (e) => {
    const newState = e.target.value;
    const updatedThread = { ...currentThread, state: newState };
    await db.put("threads", updatedThread);
    setCurrentThread(updatedThread);
  };

  const handleTopicChange = async (e) => {
    const topicId = parseInt(e.target.value);
    const updatedThread = { ...currentThread, topicId };
    await db.put("threads", updatedThread);
    setCurrentThread(updatedThread);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <button
        onClick={() => navigateTo("home")}
        className="mb-4 flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>

      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-6">
        {/* Thread header */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {currentThread.title}
          </h1>

          <div className="flex space-x-2">
            <select
              value={currentThread.state || "open"}
              onChange={handleStateChange}
              className="px-2 py-1 text-sm border border-secondary-200 dark:border-secondary-700 rounded dark:bg-secondary-700 dark:text-white"
            >
              <option value="open">Open</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={currentThread.topicId}
              onChange={handleTopicChange}
              className="px-2 py-1 text-sm border border-secondary-200 dark:border-secondary-700 rounded dark:bg-secondary-700 dark:text-white"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thread actions component */}
        <ThreadActions db={db} threadId={thread.id} />

        {/* Thread updates section */}
        <div className="mt-8 border-t border-secondary-200 dark:border-secondary-700 pt-6">
          <h2 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
            Thread Updates
          </h2>

          <form onSubmit={handleAddUpdate} className="mb-6">
            <textarea
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              placeholder="Add an update to this thread..."
              className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-white"
              rows="3"
            ></textarea>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Add Update
            </button>
          </form>

          {updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-lg"
                >
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">
                    {new Date(update.timestamp).toLocaleString()}
                  </div>
                  <p className="text-secondary-900 dark:text-secondary-100">
                    {update.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary-500 dark:text-secondary-400 py-4">
              No updates yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
