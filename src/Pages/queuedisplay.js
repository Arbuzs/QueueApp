import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QueueDisplay() {
    const [queue, setQueue] = useState([]);
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/queue');
                setQueue(response.data);
            } catch (error) {
                console.error("Error fetching queue:", error);
            }
        };
        fetchQueue();
    }, []);

    const updateQueueStatus = async (id, helping_now, served) => {
        if (served) {
            helping_now = false; // Uncheck "Helping Now" when "Served" is checked
        }
        try {
            await axios.put(`http://localhost:3000/api/queue/${id}`, { helping_now, served });
            setQueue(prevQueue => {
                // Update the item
                const updatedQueue = prevQueue.map(item => item.id === id ? { ...item, helping_now, served } : item);

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

    const resetQueue = async () => {
        setResetting(true);
        try {
            const response = await axios.post('http://localhost:3000/api/reset');
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
            return "Helping";
        } else if (served) {
            return "Served";
        } else {
            return "Waiting";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Helping":
                return "helping-status";
            case "Served":
                return "served-status";
            default:
                return "waiting-status";
        }
    };

    return (
        <div>
            <h1>Queue Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Visitor Name</th>
                        <th>Ticket Number</th>
                        <th>Helping Now</th>
                        <th>Served</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {queue.map(item => {
                        const status = getStatus(item.helping_now, item.served);
                        return (
                            <tr key={item.id}>
                                <td>{item.Time}</td>
                                <td>{item.visitor_name}</td>
                                <td>{item.ticket_number}</td>
                                <td>
                                    <input type="checkbox" checked={item.helping_now} onChange={() => updateQueueStatus(item.id, !item.helping_now, item.served)} />
                                </td>
                                <td>
                                    <input type="checkbox" checked={item.served} onChange={() => updateQueueStatus(item.id, item.helping_now, !item.served)} />
                                </td>
                                <td className={getStatusClass(status)}>{status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button onClick={resetQueue} disabled={resetting} className="reset-button">
                {resetting ? "Resetting..." : "Reset Queue"}
            </button>

            {/* Adding some CSS styles */}
            <style jsx>{`
                .helping-status {
                    color: green;
                }
                .served-status {
                    color: blue;
                }
                .waiting-status {
                    color: orange;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
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
            `}</style>
        </div>
    );
}

export default QueueDisplay;
