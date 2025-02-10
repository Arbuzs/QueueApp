import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { COLORS, FONT } from "../Constants/theme.js";

const AnalystDetails = () => {
  const { analystName } = useParams();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/statistic?analyst_name=${analystName}`);
        console.log('Fetched data:', response.data);
        setData(response.data);
        setFilteredData(response.data); // Initialize filtered data
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, [analystName]);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [startDate, endDate, data]);

  return (
    <div>
      <div className='title-container'>
        <p style={FONT.bold_50}>Analyst Details for {analystName}</p>
      </div>
      <div className="controls">
        <div className="date-picker">
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
          />
        </div>
      </div>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Visitor Name</th>
              <th>Ticket Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.visitor_name}</td>
                <td>{item.ticket_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default AnalystDetails;
