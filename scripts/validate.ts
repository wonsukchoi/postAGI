import { getOccupations } from "../src/lib/occupations";

try {
  const list = getOccupations();
  console.log(`OK: ${list.length} occupation file(s) valid.`);
} catch (e) {
  console.error((e as Error).message);
  process.exit(1);
}
