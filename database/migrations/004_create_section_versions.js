/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('section_versions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('section_id').notNullable();
    table.text('content').notNullable();
    table.jsonb('metadata').notNullable();
    table.integer('version').notNullable();
    table.string('change_reason', 500);
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('section_id').references('id').inTable('sections').onDelete('CASCADE');
    
    // Indexes
    table.index(['section_id']);
    table.index(['version']);
    table.index(['section_id', 'version']);
    table.unique(['section_id', 'version']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('section_versions');
};
