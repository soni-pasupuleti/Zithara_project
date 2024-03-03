import React, { useState, useEffect } from 'react';
import './styles.css'; 
const App = () => {
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('unsorted');

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1); 
  const [darkTheme, setDarkTheme] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        let sort = 'created_at';
        let order = 'x';

        if (sortOrder === 'asc') {
          order = 'asc';
        } else if (sortOrder === 'desc') {
          order = 'desc';
        }

        const response = await fetch(`http://localhost:3001/data?page=${page}&sort=${sort}&order=${order}&search=${searchQuery}`);
        const jsonData = await response.json();
        setData(jsonData.results);
        setTotalPages(jsonData.totalPages); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page, sortOrder, searchQuery]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1); 
  };

  const handleClearFilter = () => {
    setSortOrder('unsorted');
    setPage(1);
    setSearchQuery('');
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); 
  };

  const isFirstPage = page === 1;

  useEffect(() => {
    document.body.classList.toggle('light', !darkTheme);
    document.body.classList.toggle('dark', darkTheme);
  }, [darkTheme]);

  return (
    <div className={`container-fluid mt-5 ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="row mb-3 justify-content-center">
        <div className="col-md-6">
          <input type="text" value={searchQuery} onChange={handleSearch} className="form-control dark-input" placeholder="Search by Customer Name or Location" />
        </div>
        <div className="col-md-5">
          <select value={sortOrder} onChange={handleSortChange} className="form-select dark-dropdown">
            <option value="unsorted">Sort by</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        
        <div className="col-md-4">
          <button onClick={handleClearFilter} className="btn dark-button">Clear Filter</button>
        </div>
        <div className="col-md-1">
          <select
            value={darkTheme ? 'dark' : 'light'}
            onChange={(e) => setDarkTheme(e.target.value === 'dark')}
            className="form-select dark-dropdown"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>
      <div className="row mb-1">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>Rows</th>
                <th>SNO</th>
                <th>Customer Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.sno}>
                  <td>{index + 1}</td>
                  <td>{item.sno}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.age}</td>
                  <td>{item.phone}</td>
                  <td>{item.location}</td>
                  <td>{new Date(item.created_at).toLocaleDateString('en-GB')}</td>
                  <td>{new Date(item.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row mb-2 justify-content-center">
        <div className="col-auto">
          <button onClick={handlePrevPage} disabled={isFirstPage} className="btn btn-secondary">Previous</button>
          <button onClick={handleNextPage} disabled={page === totalPages} className="btn btn-secondary">Next</button>
        </div>
      </div>
    </div>
  );
};

export default App;
