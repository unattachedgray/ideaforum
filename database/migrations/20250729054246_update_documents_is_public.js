/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex('documents')
    .whereNull('is_public')
    .update({ is_public: true });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // No rollback needed for this data migration
  return Promise.resolve();
};
