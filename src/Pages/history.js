import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import arrowLeft from '../Assets/arrow-left.png';
import HistoryTable from '../Components/HistoryTable.js';
import "../queue.css";

const StatisticsPage = () => {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        // Fetch statistics data from the backend API
        const fetchStatistics = async () => {
            try {
                let url = 'api/statistic';
                if (startDate && endDate) {
                    const start = startDate.toISOString();
                    const end = endDate.toISOString();
                    url = `${url}?start_date=${start}&end_date=${end}`;
                }

                const response = await axios.get(url);
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [startDate, endDate]);

    const setLastSevenDays = () => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        setStartDate(lastWeek);
        setEndDate(today);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
       <div>
       
          <div className="controls" style={{paddingTop:"60px"}}>
            <div className='date-picker-wrapper' style={{gap:"20px"}}>
                <div className="date-picker-container"> 
                    <div className='view-buttons'style={{width:"70px"}}>`
                    <button className="arrow-left"   onClick={() => navigate(-1)}>
                    <img style={{ width: '40px', height: '40px', padding:"10px"

                     }} src={arrowLeft} alt="Arrow Left" />
                    </button>
                    </div>
                </div>
                <div className='date-picker-container' style={{marginTop:"20px"}}>
                    <div className="date-label">
                    <label>Start Date:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy-MM-dd"
                        className='date-picker-input'
                        />
                    </div>
                </div>    
                <div className='date-picker-container'  style={{marginTop:"20px"}}>
                <div className="date-label">
                    <label>End Date:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="yyyy-MM-dd"
                        className='date-picker-input'
                        />
                </div>
                </div>
                <div className='view-buttons' style={{width:"60%", paddingRight:"60px"}}>
                <button  onClick={setLastSevenDays}>
                Last 7 Days
                </button>

                </div>
                </div>
          
          </div>
         
       <div className="table-container">
          <HistoryTable statistics={statistics} />
                </div>
        
        </div>
      );}

export default StatisticsPage;
