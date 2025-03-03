// hooks/useDatabase.js
function useDatabase() {
  const [db, setDb] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function setupDb() {
      const database = await DatabaseService.initDB();
      setDb(database);
      setLoading(false);
    }
    setupDb();
  }, []);

  return { db, loading };
}
