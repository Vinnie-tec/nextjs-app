"use server";

import db from "@/lib/db.Setup";

export async function getDataBaseContents() {
  try {
    const tables = db
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
      )
      .all();

    const result = {};

    for (const table of tables) {
      const rows = db.prepare(`SELECT * FROM ${table.name}`).all();
      result[table.name] = rows;
    }
    return result;
  } catch (error) {
    console.error("Error fetching database contents:", error);
    throw new Error("Failed to fetch database contents");
  }
}
