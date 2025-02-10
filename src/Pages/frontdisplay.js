// QueueDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../FrontDisplay.css";

const FrontDisplay = () => {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const response = await axios.get('/api/queue'); // Adjust the URL to your API endpoint
                setQueue(response.data);
            } catch (error) {
                console.error("Error fetching queue:", error);
            }
        };

        const interval = setInterval(fetchQueue, 1000); // Fetch data every second

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    const getQueueData = () => {
        const servingNow = [];
        const waiting = [];
        const totalNonEmptyNames = queue.filter(row => row.visitor_name).length;

        let servingNowCount = 0;
        let waitingCount = 0;

        for (let i = 0; i < queue.length; i++) {
            const item = queue[i];
            const customerName = item.visitor_name.split(" ")[0]; // Extract the first word
            const isServing = item.helping_now;
            const isServed = item.served;

            if (customerName) {
                if (isServing && !isServed && (servingNowCount + waitingCount) < 5) {
                    servingNow.push(customerName);
                    servingNowCount++;
                } else if (!isServing && !isServed && (servingNowCount + waitingCount) < 5) {
                    waiting.push(customerName);
                    waitingCount++;
                } else if ((servingNowCount + waitingCount) >= 5) {
                    waiting.push("+" + (totalNonEmptyNames - 5));
                    break;
                }
            }
        }
        return { servingNow, waiting };
    };

    const { servingNow, waiting } = getQueueData();

    return (
        <div className='queue-display-container'>

       
        <div className="container">
            <div className="section">
                <h2>Helping Now</h2>
                <ul id="servingNowList" className="queue-list">
                    {servingNow.map((name, index) => (
                        <li key={index} className="green-text">{name}</li>
                    ))}
                </ul>
            </div>
            <div className="section">
                <h2>Waiting</h2>
                <ul id="waitingList" className="queue-list">
                    {waiting.map((name, index) => (
                        <li key={index} className="yellow-text">{name}</li>
                    ))}
                </ul>
            </div>
        </div>
        </div>
    );
};

export default FrontDisplay;
