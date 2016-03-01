module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/movie_inventory_crud'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
