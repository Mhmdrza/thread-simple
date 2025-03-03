export function TopicFilter({ topics, selectedTopic, onSelectTopic }) {
  return (
    <div className="overflow-x-auto pb-3 mb-4">
      <div className="flex space-x-2 w-max">
        <button
          onClick={() => onSelectTopic(0)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedTopic === 0
              ? "bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100"
              : "bg-white text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
          } shadow-sm`}
        >
          All Topics
        </button>

        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedTopic === topic.id
                ? "bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100"
                : "bg-white text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
            } shadow-sm`}
            style={
              selectedTopic === topic.id
                ? { backgroundColor: `${topic.color}20`, color: topic.color }
                : {}
            }
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
