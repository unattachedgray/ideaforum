/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('sections', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('document_id').notNullable();
    table.text('content').notNullable();
    table.uuid('author_id').notNullable();
    table.uuid('parent_id');
    table.integer('position').defaultTo(0);
    table.jsonb('metadata').defaultTo(JSON.stringify({
      wikiVisibility: false,
      wikiPosition: null,
      consensusLevel: null,
      promotionVotes: 0,
      status: 'draft',
      markupTags: [],
      threadDepth: 0
    }));
    table.integer('vote_score').defaultTo(0);
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('document_id').references('id').inTable('documents').onDelete('CASCADE');
    table.foreign('author_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('parent_id').references('id').inTable('sections').onDelete('CASCADE');
    
    // Indexes
    table.index(['document_id']);
    table.index(['author_id']);
    table.index(['parent_id']);
    table.index(['position']);
    table.index(['vote_score']);
    table.index(['metadata'], 'sections_metadata_gin', 'GIN');
    table.index(['document_id', 'position']);
    table.index(['document_id', 'parent_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('sections');
};
