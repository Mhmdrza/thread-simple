// hooks/useThreadActions.js
export function useThreadActions(db, threadId) {
  const [actions, setActions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadThreadActions = React.useCallback(async () => {
    if (!threadId) return;

    setLoading(true);
    const index = db.transaction("actions").store.index("threadId");
    const threadActions = await index.getAll(IDBKeyRange.only(threadId));

    // Sort by order to maintain sequence
    threadActions.sort((a, b) => (a.order || 0) - (b.order || 0));
    setActions(threadActions);
    setLoading(false);
  }, [db, threadId]);

  React.useEffect(() => {
    if (!db || !threadId) return;
    loadThreadActions();
  }, [db, threadId, loadThreadActions]);

  const addThreadAction = async (text) => {
    // Find the highest order value
    const maxOrder =
      actions.length > 0 ? Math.max(...actions.map((a) => a.order || 0)) : -1;

    const newAction = {
      text,
      threadId,
      status: "pending",
      createdAt: new Date().toISOString(),
      order: maxOrder + 1, // Set next in sequence
    };

    await db.add("actions", newAction);
    await loadThreadActions(); // Reload to get updated list with proper order
  };

  const updateActionStatus = async (actionId, newStatus) => {
    const action = await db.get("actions", actionId);
    action.status = newStatus;
    action.completedAt = ["completed", "discarded", "delegated"].includes(
      newStatus
    )
      ? new Date().toISOString()
      : null;
    await db.put("actions", action);

    await loadThreadActions();
  };

  return { actions, loading, addThreadAction, updateActionStatus };
}
