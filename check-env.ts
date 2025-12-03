// check-env.ts
const requiredEnv = ["DATABASE_URL", "DIRECT_URL"];
const validPrefixes = ["postgresql://", "postgres://"];

console.log("Checking environment variables...");

let good = true;

requiredEnv.forEach((key) => {
  const val = process.env[key];
  if (!val) {
    console.error(`❌ Environment variable ${key} is missing (undefined or empty).`);
    good = false;
  } else {
    console.log(`✅ ${key} = ${val}`);
    if (!validPrefixes.some((p) => val.startsWith(p))) {
      console.error(
        `❌ ${key} does not start with a valid protocol (must start with ${validPrefixes.join(" or ")}).`
      );
      good = false;
    }
  }
});

if (!good) {
  console.error("❗ One or more environment variables are invalid. Exiting.");
  process.exit(1);
} else {
  console.log("🎉 All required environment variables appear valid.");
}

console.log("Environment check complete.");