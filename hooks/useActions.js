// hooks/useActions.js
export function useActions(db, topicId = 0) {
  const [actions, setActions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadActions = React.useCallback(async () => {
    setLoading(true);
    let actionsList;

    if (topicId === 0) {
      // Get standalone actions
      const index = db.transaction("actions").store.index("status");
      const standardActions = await index.getAll(IDBKeyRange.only("pending"));

      // Get only the first pending action from each thread
      const threadActions = await getFirstPendingThreadActions(db);

      // Combine them
      actionsList = [...standardActions, ...threadActions];
    } else {
      const index = db.transaction("actions").store.index("topicId");
      actionsList = await index.getAll(IDBKeyRange.only(topicId));
      actionsList = actionsList.filter((action) => action.status === "pending");
    }

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const processedActions = actionsList.map((action) => {
      const createdAt = new Date(action.createdAt);
      if (createdAt < oneDayAgo && action.status === "pending") {
        return { ...action, untouched: true };
      }
      return action;
    });

    setActions(processedActions);
    setLoading(false);
  }, [db, topicId]);

  React.useEffect(() => {
    if (!db) return;
    loadActions();
  }, [db, topicId, loadActions]);

  // Helper function to get only first pending action from each thread
  async function getFirstPendingThreadActions(db) {
    const threads = await db.getAll("threads");
    const result = [];

    for (const thread of threads) {
      const index = db.transaction("actions").store.index("threadId");
      const threadActions = await index.getAll(IDBKeyRange.only(thread.id));

      // Sort by order to ensure we get the earliest action in sequence
      threadActions.sort((a, b) => (a.order || 0) - (b.order || 0));

      // Find the first pending action
      const firstPending = threadActions.find((a) => a.status === "pending");
      if (firstPending) {
        result.push({
          ...firstPending,
          threadTitle: thread.title, // Include thread title for UI
        });
      }
    }

    return result;
  }

  const handleActionStatusChange = async (actionId, newStatus) => {
    const action = await db.get("actions", actionId);
    action.status = newStatus;
    action.completedAt =
      newStatus === "completed" ? new Date().toISOString() : null;
    await db.put("actions", action);

    // Reload actions to show the next pending action if this was part of a thread
    await loadActions();
  };

  return { actions, loading, handleActionStatusChange, loadActions };
}
