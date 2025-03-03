// hooks/useTopics.js
export function useTopics(db) {
  const [topics, setTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!db) return;

    async function loadTopics() {
      const allTopics = await db.getAll("topics");
      setTopics(allTopics);
      setLoading(false);
    }

    loadTopics();
  }, [db]);

  return { topics, loading };
}
