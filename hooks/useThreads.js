// hooks/useThreads.js
export function useThreads(db, topicId = 0) {
  const [threads, setThreads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadThreads = React.useCallback(async () => {
    setLoading(true);
    let allThreads;

    if (topicId === 0) {
      allThreads = await db.getAll("threads");
    } else {
      const index = db.transaction("threads").store.index("topicId");
      allThreads = await index.getAll(IDBKeyRange.only(topicId));
    }

    const threadsWithUpdates = await Promise.all(
      allThreads.map(async (thread) => {
        const index = db.transaction("threadUpdates").store.index("threadId");
        const updates = await index.getAll(IDBKeyRange.only(thread.id));
        updates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return {
          ...thread,
          latestUpdate: updates[0] || null,
        };
      })
    );

    threadsWithUpdates.sort((a, b) => {
      const dateA = a.latestUpdate
        ? new Date(a.latestUpdate.timestamp)
        : new Date(a.createdAt);
      const dateB = b.latestUpdate
        ? new Date(b.latestUpdate.timestamp)
        : new Date(b.createdAt);
      return dateB - dateA;
    });

    setThreads(threadsWithUpdates);
    setLoading(false);
  }, [db, topicId]);

  React.useEffect(() => {
    if (!db) return;
    loadThreads();
  }, [db, topicId, loadThreads]);

  return { threads, loading, loadThreads };
}
