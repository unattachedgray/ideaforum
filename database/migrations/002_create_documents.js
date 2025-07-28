/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('documents', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title', 255).notNullable();
    table.text('description');
    table.uuid('author_id').notNullable();
    table.boolean('is_public').defaultTo(true);
    table.specificType('tags', 'text[]').defaultTo('{}');
    table.integer('view_count').defaultTo(0);
    table.timestamp('last_activity_at').defaultTo(knex.fn.now());
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('author_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index(['author_id']);
    table.index(['is_public']);
    table.index(['last_activity_at']);
    table.index(['view_count']);
    table.index(['tags'], 'documents_tags_gin', 'GIN');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('documents');
};
