import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../queue.css";
import { FONT } from "../Constants/theme.js";
import historyButton from '../Assets/history_button.png'; // Import the image
import { useNavigate } from 'react-router-dom';

const analystOptions = ['Liviu', 'Iqbal', 'Haris', 'Cristian C', 'Amalie', 'Dimitrios', 'Kledi' , 'Olga' , 'Mona', 'Sigurdur' ]; // Analyst names

function QueueDisplay() {
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const response = await axios.get('http://10.84.140.132:3000/api/queue');
                setQueue(response.data);
            } catch (error) {
                console.error("Error fetching queue:", error);
            }
        };
        fetchQueue();
        // Set up polling every 5 seconds to keep the table updated
        const intervalId = setInterval(fetchQueue, 5000);

        // Clean up interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    const updateQueueStatus = async (id, helping_now, served, analyst_name) => {
        if (served) {
            helping_now = false; // Uncheck "Helping Now" when "Served" is checked
        }
        try {
            await axios.put(`http://10.84.140.132:3000/api/queue/${id}`, { helping_now, served, analyst_name });
            setQueue(prevQueue => {
                // Update the item
                const updatedQueue = prevQueue.map(item => item.id === id ? { ...item, helping_now, served, analyst_name } : item);

                // Reorder the queue
                const helpingItems = updatedQueue.filter(item => item.helping_now && !item.served);
                const waitingItems = updatedQueue.filter(item => !item.helping_now && !item.served);
                const servedItems = updatedQueue.filter(item => item.served);

                return [...helpingItems, ...waitingItems, ...servedItems];
            });
        } catch (error) {
            console.error("Error updating queue status:", error);
        }
    };

    const handleAnalystChange = (id, value) => {
        const item = queue.find(item => item.id === id);
        updateQueueStatus(id, item.helping_now, item.served, value);
    };

    const resetQueue = async () => {
        setResetting(true);
        try {
            const response = await axios.post('http://10.84.140.132:3000/api/reset');
            if (response.data.success) {
                setQueue([]);
                alert("Queue reset successfully!");
            } else {
                alert("Failed to reset the queue.");
            }
        } catch (error) {
            console.error("Error resetting queue:", error);
            alert("Error resetting queue.");
        } finally {
            setResetting(false);
        }
    };

    const getStatus = (helping_now, served) => {
        if (helping_now) {
            return "HELPING";
        } else if (served) {
            return "SERVED";
        } else {
            return "WAITING";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "HELPING":
                return "helping-status";
            case "SERVED":
                return "served-status";
            default:
                return "waiting-status";
        }
    };

    return (
        <div className='queue-container'>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Visitor Name</th>
                        <th>Ticket Number / Reason</th>
                        <th>Helping Now</th>
                        <th>Served</th>
                        <th>Status</th>
                        <th>Analyst Name</th> {/* Add a column for Analyst Name */}
                    </tr>
                </thead>
                <tbody>
                    {queue.map(item => {
                        const status = getStatus(item.helping_now, item.served);
                        return (
                            <tr key={item.id}>
                                <td>{item.Time}</td>
                                <td>{item.visitor_name}</td>
                                <td>
                                    <a href={`https://agcbio.service-now.com/now/nav/ui/search/${item.ticket_number}/params/search-term/${item.ticket_number}/global-search-data-config-id/c861cea2c7022010099a308dc7c26041/back-button-label/Tasks/search-context/now%2Fnav%2Fui`} target="_blank" rel="noopener noreferrer">
                                        {item.ticket_number}
                                    </a>
                                </td>
                                <td>
                                    <input type="checkbox" className='big-checkbox' checked={item.helping_now} onChange={() => updateQueueStatus(item.id, !item.helping_now, item.served, item.analyst_name)} />
                                </td>
                                <td>
                                    <input type="checkbox" className='big-checkbox' checked={item.served} onChange={() => updateQueueStatus(item.id, item.helping_now, !item.served, item.analyst_name)} />
                                </td>
                                <td className={getStatusClass(status)}>{status}</td>
                                <td>
                                    <select value={item.analyst_name || ''} onChange={(e) => handleAnalystChange(item.id, e.target.value)}>
                                        <option value="">Select Analyst</option>
                                        {analystOptions.map((analyst, index) => (
                                            <option key={index} value={analyst}>{analyst}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {/*
             <button onClick={resetQueue} disabled={resetting} className="reset-button">
                {resetting ? "Resetting..." : " Reset Queue"}
            </button>
           */}

            {/* Add a button with the image */}
          
            <button className="history-button" onClick={() => navigate("/history")}>
              History   <img src={historyButton} alt="History Button" />
            </button>
            

            {/* Adding some CSS styles */}
            <style jsx>{`
                .helping-status {
                    color: green;
                    font-size: 20px;
                    font-family: 'Syne';
                    font-weight: bold;
                }
                .served-status {
                    color: blue;
                    font-size: 20px;
                    font-family: 'Syne';
                    font-weight: bold;
                }
                .waiting-status {
                    color: orange;
                    font-size: 20px;
                    font-family: 'Syne';
                    font-weight: bold;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th {
                    padding-top: 12px;
                    padding-bottom: 12px;
                    text-align: center;
                    background-color: #04AA6D;
                    color: white;
                }
                td {
                    text-align: center;
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                tr:nth-child(even) {
                    background-color: #e3e2e2; 
                }
                .big-checkbox {
                    width: 20px; /* Adjust the width as needed */
                    height: 20px; /* Adjust the height as needed */
                    transform: scale(1.5); /* Scale the checkbox up to 1.5 times its original size */
                    margin: 5px; /* Optional: Add some margin for better spacing */
                }
                .reset-button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #f44336;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                .reset-button:disabled {
                    background-color: #e57373;
                    cursor: not-allowed;
                }
                select {
                    padding: 5px;
                    font-size: 16px;
                }
              .history-button  {
              margin-top:40px;
                      display: flex;
                        align-items: center;
        font-size: 16px;
        font-family: 'Syne';
         background-color: transparent;
                    border: none;
                    cursor:pointer;

    }
                .history-button img {
                padding-left:5px;
                    width: 20px; /* Adjust the size as needed */
                    height: 20px; /* Adjust the size as needed */
                }
            `}</style>
        </div>
    );
}

export default QueueDisplay;
