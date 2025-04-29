import { table } from "console";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.string("role").nullable();
    table.string("firmName").nullable();
    table.text("firmAddress").nullable();
    table.string("jobTitle").nullable();
    table.string("document").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("role");
    table.dropColumn("firmName");
    table.dropColumn("firmAddress");
    table.dropColumn("jobTitle");
    table.dropColumn("document");
  });
}
