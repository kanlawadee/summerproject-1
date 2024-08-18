import React, { useState, useEffect } from 'react';
import './home.css'; 

function Home() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    licensePlate: '' 
  });

  useEffect(() => {
    // Fetch ticket data from API based on filters only on component mount
    fetchTickets(); 
  }, []); 

  const fetchTickets = async () => {
    if (!filters.startDate && !filters.endDate && !filters.status && !filters.licensePlate) {
      return; // Don't fetch if all filters are empty
    }
    
    try {
      const response = await fetch('/api/tickets', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters) 
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Handle error, e.g., show error message to user
    }
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSearch = () => {
    fetchTickets();
  };

  return (
    <header>
        <nav>
            <div className='container'>
            <h1 className='had'>SMART TICKET</h1>
            <ul>
                <li>ชื่อผู้ใช้</li>
                <li>ออกจากระบบ</li>
            </ul>
            </div>
        </nav>
    <div className="app-container">

      {/* Filter Section */}
      <div className="filter-section">
        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">ทั้งหมด</option>
          <option value="รอชำระ">รอชำระ</option>
          <option value="ยกเลิกการชำระ">ยกเลิกการชำระ</option>
          <option value="ชำระแล้ว">ชำระแล้ว</option>
        </select>
        <input type="text" name="licensePlate" value={filters.licensePlate} onChange={handleFilterChange} placeholder="เลขทะเบียนรถยนต์"/>
        <button onClick={handleSearch}>ค้นหา</button>
      </div>

      {/* Ticket List */}
      <table>
        <thead>
          <tr>
            <th>หมายเลขใบสั่ง</th>
            <th>เลขบัตรประชาชน</th>
            <th>ผู้ขับขี่</th>
            <th>วันที่ออก</th>
            <th>ข้อหา</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket.id}> 
                <td>{ticket.ticketNumber}</td>
                <td>{ticket.citizenId}</td>
                <td>{ticket.driverName}</td>
                <td>{ticket.issueDate}</td>
                <td>{ticket.violation}</td>
                <td>{ticket.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">ไม่พบข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </header>
  );
}

export default Home;
