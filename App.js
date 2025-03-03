function App() {
    const { db, loading } = useDatabase();
    const [view, setView] = React.useState("home");
    const [currentThread, setCurrentThread] = React.useState(null);
    const [currentAction, setCurrentAction] = React.useState(null);
  
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
  
    // Navigation handler
    const navigateTo = (newView, data = null) => {
      if (newView === "thread" && data) {
        setCurrentThread(data);
      } else if (newView === "action" && data) {
        setCurrentAction(data);
      }
      setView(newView);
      window.scrollTo(0, 0);
    };
  
    // Render the current view
    const renderView = () => {
      switch (view) {
        case "home":
          return <Home db={db} navigateTo={navigateTo} />;
        case "thread":
          return <ThreadDetail db={db} thread={currentThread} navigateTo={navigateTo} />;
        case "action":
          return <ActionDetail db={db} action={currentAction} navigateTo={navigateTo} />;
        case "newThread":
          return <NewThread db={db} navigateTo={navigateTo} />;
        case "actions":
          return <ActionsList db={db} navigateTo={navigateTo} />;
        case "actionGenerators":
          return <ActionGenerators db={db} navigateTo={navigateTo} />;
        case "reports":
          return <Reports db={db} navigateTo={navigateTo} />;
        case "topics":
          return <TopicsManager db={db} navigateTo={navigateTo} />;
        default:
          return <Home db={db} navigateTo={navigateTo} />;
      }
    };
  
    return (
      <div className="pb-24 min-h-screen bg-secondary-50 dark:bg-secondary-900 dark-mode">
        {renderView()}
        <BottomNav currentView={view} navigateTo={navigateTo} />
      </div>
    );
  }