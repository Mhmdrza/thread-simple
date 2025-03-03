// components/BottomNav.js
export function BottomNav({ currentView, navigateTo }) {
  return (
    <div className="fixed bottom-0 w-full bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 shadow-lg z-50">
      <div className="flex justify-around max-w-md mx-auto">
        <NavButton
          icon="home"
          label="Home"
          isActive={currentView === "home"}
          onClick={() => navigateTo("home")}
        />
        <NavButton
          icon="actions"
          label="Actions"
          isActive={currentView === "actions"}
          onClick={() => navigateTo("actions")}
        />
        <NavButton
          icon="generators"
          label="Generators"
          isActive={currentView === "actionGenerators"}
          onClick={() => navigateTo("actionGenerators")}
        />
        <NavButton
          icon="reports"
          label="Reports"
          isActive={currentView === "reports"}
          onClick={() => navigateTo("reports")}
        />
        <NavButton
          icon="topics"
          label="Topics"
          isActive={currentView === "topics"}
          onClick={() => navigateTo("topics")}
        />
      </div>
    </div>
  );
}
