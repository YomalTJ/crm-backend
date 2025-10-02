import { DataSource } from "typeorm";
import dataSource from "../data-source";

async function revertMigration() {
  try {
    await dataSource.initialize();
    await dataSource.undoLastMigration();
    console.log("✅ Last migration reverted successfully");
    await dataSource.destroy();
  } catch (error) {
    console.error("❌ Error reverting migration:", error);
    process.exit(1);
  }
}

revertMigration();
