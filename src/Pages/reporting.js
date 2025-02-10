import React, { useEffect, useState } from "react";
import axios from 'axios';
import { COLORS, FONT } from '../Constants/theme.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,LabelList } from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../queue.css";

const COLOR = {
  ritm: '#e17840',
  inc: '#4099e1',
  no_ticket: '#e140a6'
};

const Reporting = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState('daily');
  const [isStacked, setIsStacked] = useState(true);
  const [selectedAnalyst, setSelectedAnalyst] = useState('all');
  const [analystList, setAnalystList] = useState([]);
  const [analystDetails, setAnalystDetails] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/statistic');
        console.log('Fetched data:', response.data);
        setData(response.data);
        setFilteredData(response.data); // Initialize filtered data
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    const fetchAnalysts = async () => {
      try {
        const response = await axios.get('/api/analysts');
        setAnalystList(response.data);
      } catch (error) {
        console.error('Error fetching analysts:', error);
      }
    };

    fetchData();
    fetchAnalysts();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filtered = data;
      if (startDate && endDate) {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      if (selectedAnalyst !== 'all') {
        filtered = filtered.filter(item => item.analyst_name === selectedAnalyst);
      }
      setFilteredData(filtered);
    };

    filterData();
  }, [startDate, endDate, selectedAnalyst, data]);

  const handleViewChange = (view) => {
    setView(view);
  };

  const processData = (data, view) => {
    if (view === 'daily') {
      return  data.map(item => ({
        ...item,
        date: item.date.split('T')[0] // Extract only the date part
      }));;
    }

    const groupedData = {};
  data.forEach(item => {
    const date = new Date(item.date);
    let key;
    if (view === 'monthly') {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    } else if (view === 'yearly') {
      key = `${date.getFullYear()}`;
    } else if (view === 'analyst') {
      key = item.analyst_name;
    }

    if (!groupedData[key]) {
      groupedData[key] = { date: key, ritm_count: 0, inc_count: 0, noticket_count: 0, analyst_name: item.analyst_name };
    }
    groupedData[key].ritm_count += item.ritm_count;
    groupedData[key].inc_count += item.inc_count;
    groupedData[key].noticket_count += item.noticket_count;
  });

  return Object.values(groupedData);
};

  const plotData = processData(filteredData, view);
  const calculateTotalCount = (data) => {
    return data.map(entry => ({
      ...entry,
      total_count: entry.ritm_count + entry.inc_count + entry.noticket_count
    }));
  };
  
  const updatedPlotData = calculateTotalCount(plotData);

  // Group filtered data by analyst name
  const groupByAnalyst = (data) => {
    return data.reduce((acc, item) => {
      const { analyst_name } = item;
      if (!acc[analyst_name]) {
        acc[analyst_name] = [];
      }
      acc[analyst_name].push(item);
      return acc;
    }, {});
    
  };

  const groupedByAnalyst = groupByAnalyst(filteredData);

  return (
    <div>
      <div className='title-container'>
        <p style={FONT.bold_50}>Reports</p>
      </div>
      <div className="controls">
      <div className="date-picker-wrapper">
          <div className="date-picker-container">
            <label className="date-label">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="date-picker-input"
            />
          </div>
          <div className="date-picker-container">
            <label className="date-label">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="date-picker-input"
            />
          </div>

        <div className="view-buttons">
          <button onClick={() => handleViewChange('daily')}>Daily</button>
        </div> 
        <div className="view-buttons">
          <button onClick={() => handleViewChange('monthly')}>Monthly</button>
        </div>
        <div className="view-buttons">
          <button onClick={() => handleViewChange('yearly')}>Yearly</button>
          </div>
          <div className="view-buttons">
          <button onClick={() => handleViewChange('analyst')}>By Analyst</button>
        </div>
        <div className="view-buttons" >
  <button onClick={() => setIsStacked(!isStacked)}
      style={{ width: '250px' }}>
    {isStacked ? 'Switch to Grouped' : 'Switch to Stacked'}
  </button>
</div>
      </div>
      </div>

<div className='chart-container green-background'>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={updatedPlotData}>
      <XAxis dataKey="date" stroke="#000" />
      <YAxis stroke="#000" />
      <Tooltip />
      <Legend />
      <Bar dataKey="ritm_count" name="RITM Count" fill={COLOR.ritm} stackId={isStacked ? "a" : undefined}>
        <LabelList dataKey="total_count" position="top" style={{ fill: '#000', fontFamily: 'Syne', fontSize: '16px', fontWeight: 'bold' }} />
      </Bar>
      <Bar dataKey="inc_count" name="INC Count" fill={COLOR.inc} stackId={isStacked ? "a" : undefined}>
        <LabelList dataKey="total_count" position="top" style={{ fill: '#000', fontFamily: 'Syne', fontSize: '16px', fontWeight: 'bold' }} />
      </Bar>
      <Bar dataKey="noticket_count" name="No Ticket" fill={COLOR.no_ticket} stackId={isStacked ? "a" : undefined}>
        <LabelList dataKey="total_count" position="top" style={{ fill: '#000', fontFamily: 'Syne', fontSize: '16px', fontWeight: 'bold' }} />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

      {/* Analyst Table Section */}
      <div className="analyst-details">
        <h2>Analyst Details</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Analyst Name</th>
                <th>Visitor Name</th>
                <th>Ticket Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.analyst_name}</td>
                  <td>{item.visitor_name}</td>
                  <td>{item.ticket_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .title-container {
          margin-bottom: 20px;
        }
        .controls {
          display: flex;
          justify-content: space-between;
          margin: 20px;
        }
        .date-picker {
          display: flex;
          gap: 10px;
          margin-left: 20px;
        }
        
        .chart-container {
          margin: 20px;
        }
        .analyst-details {
          margin: 20px;
        }
        .table-container {
          margin: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid ${COLORS.grey};
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: ${COLORS.black};
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Reporting;
