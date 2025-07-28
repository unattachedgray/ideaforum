/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username', 50).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('provider', 50).notNullable().defaultTo('email'); // e.g., 'email', 'google'
    table.string('provider_id', 255); // ID from the provider (e.g., Google user ID)
    table.string('avatar_url', 500);
    table.text('bio');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.unique(['provider', 'provider_id']);
    table.index(['email']);
    table.index(['is_active']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
