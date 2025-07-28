/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('votes', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('section_id').notNullable();
    table.enum('type', ['up', 'down', 'promote']).notNullable();
    table.integer('value').notNullable(); // 1 for up, -1 for down, 2 for promote
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('section_id').references('id').inTable('sections').onDelete('CASCADE');
    
    // Indexes
    table.index(['user_id']);
    table.index(['section_id']);
    table.index(['type']);
    table.index(['section_id', 'type']);
    
    // Unique constraint to prevent duplicate votes
    table.unique(['user_id', 'section_id', 'type']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('votes');
};
