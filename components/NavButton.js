export function NavButton({ icon, label, isActive, onClick }) {
  let iconElement;

  switch (icon) {
    case "home":
      iconElement = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      );
      break;
    // ...other icons
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-3 w-full ${
        isActive
          ? "text-primary-600 dark:text-primary-400"
          : "text-secondary-500 dark:text-secondary-400"
      }`}
    >
      {iconElement}
      <span className="text-xs">{label}</span>
    </button>
  );
}
