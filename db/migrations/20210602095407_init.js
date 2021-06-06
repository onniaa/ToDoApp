
exports.up = function(knex) {
  return knex.schema
    .createTable('tasks', table => {
      table.increments('id');
      table.string('header').notNullable();
      table.string('description');
      table.timestamps(true, true);
  })
    .createTable('users', table => {
      table.increments('id');
      table.string('username').notNullable();
      table.string('email').notNullable().unique();  
      table.timestamps(true, true);
    })
    .createTable('task_user_map', table => {
        table.increments('id');
        table.integer('user_id'); // change to foreign key
        table.integer('task_id'); // change to foreign key
        table.timestamps(true, true);
      })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('tasks')
    .dropTable('users')
    .dropTable('task_user_map');
};
