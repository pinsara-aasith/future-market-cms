import { runSeeder } from "./services/database-seeder";

runSeeder()
  .then(() => {
    console.log("Seeder finished successfully");
    process.exit(0); // ✅ Explicitly exit the process
  })
  .catch((err) => {
    console.error("Seeder failed", err);
    process.exit(1);
  });;
