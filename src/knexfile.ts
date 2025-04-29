import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config(); // Load .env variables

const BASE_DIR = process.env.NODE_ENV === "production" ? "dist" : "src";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: +(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "ld_case_db",
    },
    migrations: {
      directory: path.join(__dirname, BASE_DIR, "migrations"),
      extension: "ts",
    },
    seeds: {
      directory: path.join(__dirname, BASE_DIR, "seeds"),
      extension: "ts",
    },
  },

  production: {
    client: "mysql2",
    connection: process.env.DATABASE_URL, // Full DB URL
    migrations: {
      directory: path.join(__dirname, "migrations"),
      extension: "js",
    },
    seeds: {
      directory: path.join(__dirname, "seeds"),
      extension: "js",
    },
  },
};

export default config;
