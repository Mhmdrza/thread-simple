// services/database.js
const DB_NAME = "mindflow_db";
const DB_VERSION = 2; // Increased version to handle schema updates

async function initDB() {
  return idb.openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Topics store
      if (!db.objectStoreNames.contains("topics")) {
        const topicsStore = db.createObjectStore("topics", {
          keyPath: "id",
          autoIncrement: true,
        });
        topicsStore.createIndex("name", "name", { unique: true });

        // Add default topics
        topicsStore.add({ id: 1, name: "All", color: "#0ea5e9" });
        topicsStore.add({ id: 2, name: "Personal", color: "#22c55e" });
        topicsStore.add({ id: 3, name: "Work", color: "#f97316" });
        topicsStore.add({ id: 4, name: "Ideas", color: "#8b5cf6" });
      }

      // Threads store
      if (!db.objectStoreNames.contains("threads")) {
        const threadsStore = db.createObjectStore("threads", {
          keyPath: "id",
          autoIncrement: true,
        });
        threadsStore.createIndex("topicId", "topicId");
        threadsStore.createIndex("createdAt", "createdAt");
        threadsStore.createIndex("state", "state", { unique: false });
      }

      // Thread updates store
      if (!db.objectStoreNames.contains("threadUpdates")) {
        const updatesStore = db.createObjectStore("threadUpdates", {
          keyPath: "id",
          autoIncrement: true,
        });
        updatesStore.createIndex("threadId", "threadId");
        updatesStore.createIndex("timestamp", "timestamp");
      }

      // Thread actions store - modified with order field for sequence
      if (!db.objectStoreNames.contains("actions")) {
        const actionsStore = db.createObjectStore("actions", {
          keyPath: "id",
          autoIncrement: true,
        });
        actionsStore.createIndex("threadId", "threadId");
        actionsStore.createIndex("topicId", "topicId");
        actionsStore.createIndex("status", "status");
        actionsStore.createIndex("due", "due");
        actionsStore.createIndex("createdAt", "createdAt");
        actionsStore.createIndex("order", "order"); // To maintain action sequence
      } else if (oldVersion === 1) {
        // Add the order index to existing actions store if upgrading from v1
        const actionsStore = transaction.objectStore("actions");
        if (!actionsStore.indexNames.contains("order")) {
          actionsStore.createIndex("order", "order");
        }
      }

      // Action generators store
      if (!db.objectStoreNames.contains("actionGenerators")) {
        const generatorsStore = db.createObjectStore("actionGenerators", {
          keyPath: "id",
          autoIncrement: true,
        });
        generatorsStore.createIndex("topicId", "topicId");
        generatorsStore.createIndex("frequency", "frequency");
      }
    },
  });
}

export default { initDB };