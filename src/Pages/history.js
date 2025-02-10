import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { COLORS } from "../Constants/theme.js";
import { useNavigate } from 'react-router-dom';
import arrowLeft from '../Assets/arrow-left.png';

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
        <div className='table-container'>
            <button className="arrow-left" onClick={() => navigate(-1)}>
                <img src={arrowLeft} alt="Arrow Left" />
            </button>
            <h1>History</h1>
            <div className="controls">
                <div className="date-picker">
                    <label>Start Date:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy-MM-dd"
                    />
                    <label>End Date:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
                <button className="preset-button" onClick={setLastSevenDays}>
                    Last 7 Days
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Analyst Name</th>
                        <th>Visitor Name</th>
                        <th>Date</th>
                        <th>Ticket Number</th>
                    </tr>
                </thead>
                <tbody>
                    {statistics.map((stat, index) => (
                        <tr key={index}>
                            <td>{stat.analyst_name}</td>
                            <td>{stat.visitor_name}</td>
                            <td>{new Date(stat.date).toLocaleDateString()}</td>
                            <td>
                                <a href={`https://agcbio.service-now.com/now/nav/ui/search/${stat.ticket_number}/params/search-term/${stat.ticket_number}/global-search-data-config-id/c861cea2c7022010099a308dc7c26041/back-button-label/Tasks/search-context/now%2Fnav%2Fui`} target="_blank" rel="noopener noreferrer">
                                    {stat.ticket_number}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                .preset-button {
                    align-self: flex-end;
                    margin-left: 20px;
                    padding: 5px 10px;
                    background-color: ${COLORS.black};
                    color: white;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
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
                .arrow-left {
                    margin-top: 40px;
                    align-items: center;
                    font-size: 16px;
                    font-family: 'Syne';
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                }
                .arrow-left img {
                    width: 40px;
                    height: 40px;
                }
            `}</style>
        </div>
    );
};

export default StatisticsPage;
