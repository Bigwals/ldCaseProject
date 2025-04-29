import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('devices', (table) => {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable();
        table.string('deviceId').notNullable();
        table.string('deviceType').notNullable();

        // Foreign
        table.foreign('userId').references('id').inTable('users');
    })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('devices');
}

