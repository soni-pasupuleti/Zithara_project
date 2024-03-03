const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Soni',
  port: 5432,
});

// Connect to PostgreSQL database
pool.connect(async (err, client, done) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    return;
  }

  try {
    const result = await client.query('SELECT * FROM customer');
    const staticData = result.rows;

    app.get('/data', (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const pageSize = 20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;

      let filteredData = staticData.slice(0); 

      // Filter the data based on the search query
      if (req.query.search) {
        const searchQuery = req.query.search.toLowerCase();
        filteredData = filteredData.filter(item => {
          return item.customer_name.toLowerCase().includes(searchQuery) || item.location.toLowerCase().includes(searchQuery);
        });
      }

      // Sort the data 
      if (req.query.sort === 'created_at') {
        if (req.query.order === 'asc') {
          filteredData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (req.query.order === 'desc') {
          filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
      }

      const results = filteredData.slice(startIndex, endIndex);

      // Determine the URLs for the sort options
      const sortUrls = {
        asc: `/data?page=${page}&sort=created_at&order=asc`,
        desc: `/data?page=${page}&sort=created_at&order=desc`,
        normal: `/data?page=${page}`
      };

      res.status(200).json({
        page: page,
        totalPages: Math.ceil(filteredData.length / pageSize),
        results: results,
        sortUrls: sortUrls,
        reqQuery: req.query,
        noResults: results.length === 0 
      });
    });

    app.listen(3001, () => {
      console.log("Server is listening on port 3001");
    });
  } catch (error) {
    console.error('Error executing query:', error);
    done();
  } finally {
    done(); 
  }
});
