import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../queue.css";
import historyButton from '../Assets/history_button.png'; // Import the image
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const analystOptions = ['Liviu', 'Iqbal', 'Haris', 'Leo', 'Amalie', 'Dimitrios', 'Kledi' , 'Olga' , 'Mona', 'Sigurdur' ,'Arif']; // Analyst names

function QueueDisplay() {
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);


    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const response = await axios.get('api/queue');
                const fetchedQueue = response.data;
    
                setQueue((prevQueue) => {
                    // Create a mapping of old positions
                    const positionMap = new Map(prevQueue.map((item, index) => [item.id, index]));
    
                    // Keep previous order for existing items, add new ones at the end
                    const sortedQueue = fetchedQueue.sort((a, b) => {
                        if (a.served !== b.served) return a.served ? 1 : -1; // Only move "Served" items to the bottom
                        return (positionMap.get(a.id) ?? Infinity) - (positionMap.get(b.id) ?? Infinity);
                    });
    
                    return [...sortedQueue];
                });
            } catch (error) {
                console.error("Error fetching queue:", error);
            }
        };
    
        fetchQueue();
        const intervalId = setInterval(fetchQueue, 5000);
    
        return () => clearInterval(intervalId);
    }, []);
    
    
   
    const updateQueueStatus = async (id, helping_now, served, analyst_name) => {
        if (served) {
            helping_now = false; // Uncheck "Helping Now" when "Served" is checked
        }
        try {
            await axios.put(`api/queue/${id}`, { helping_now, served, analyst_name });
            setQueue(prevQueue => {
                // Update the item
                const updatedQueue = prevQueue.map(item =>
                    item.id === id ? { ...item, helping_now, served, analyst_name } : item
                );
    
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
                        <th>TIME</th>
                        <th>VISITOR NAME</th>
                        <th>TICKET NUMBER/ REASON</th>
                        <th>HELPING NOW</th>
                        <th>SERVED</th>
                        <th>STATUS</th>
                        <th>ANALYST NAME</th> {/* Add a column for Analyst Name */}
                    </tr>
                </thead>
                <tbody>
  <AnimatePresence>
    {queue.map((item) => {
      const status = getStatus(item.helping_now, item.served);

      return (
        <motion.tr
          key={item.id}
          layout // Enables smooth reordering
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
   <td>
  {item.Time.slice(-7)}
</td>



          <td>{item.visitor_name}</td>
          <td>
            <a
              href={`https://agcbio.service-now.com/now/nav/ui/search/${item.ticket_number}/params/search-term/${item.ticket_number}/global-search-data-config-id/c861cea2c7022010099a308dc7c26041/back-button-label/Tasks/search-context/now%2Fnav%2Fui`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.ticket_number}
            </a>
          </td>
          <td>
            <input
              type="checkbox"
              className="big-checkbox"
              checked={item.helping_now}
              onChange={() =>
                updateQueueStatus(item.id, !item.helping_now, item.served, item.analyst_name)
              }
            />
          </td>
          <td>
            <input
              type="checkbox"
              className="big-checkbox"
              checked={item.served}
              onChange={() =>
                updateQueueStatus(item.id, item.helping_now, !item.served, item.analyst_name)
              }
            />
          </td>
          <td className={getStatusClass(status)}>{status}</td>
          <td>
            <select value={item.analyst_name || ""} onChange={(e) => handleAnalystChange(item.id, e.target.value)}>
              <option value="">Select Analyst</option>
              {analystOptions.map((analyst, index) => (
                <option key={index} value={analyst}>
                  {analyst}
                </option>
              ))}
            </select>
          </td>
        </motion.tr>
      );
    })}
  </AnimatePresence>
</tbody>


            </table>

            {/* Add a button with the image */}
            <div className='view-buttons' style= {{ width:"130px", }}>

            <button className="history-button" style= {{  padding:"10px"}}onClick={() => navigate("/history")}>
              History   <img src={historyButton} alt="History Button" />
            </button>
            </div>
            

            {/* Adding some CSS styles */}
            <style jsx>{`
    table {
        margin-top:30px;
        width: 100%;
        border-collapse: collapse;
        border-radius: 20px;
        overflow: hidden; /* Ensures rounded corners apply properly */
        font-family: 'Manrope', sans-serif; /* Changed to Manrope */
    }

    th {
        padding: 12px;
        text-align: center;
        background-color: rgba(177,225,64);
        color: black; /* Column headers are now black */

        font-family: 'Manrope', sans-serif; /* Changed to Manrope */
    }

    td {
        text-align: center;
        border: 1px solid #ddd;
        padding: 8px;
   
        font-family: 'Manrope', sans-serif; /* Changed to Manrope */
    }

    /* Remove borders from the top row */
    tr:first-child td {
        border-top: none;
    }

    /* Alternate row colors */
    tr:nth-child(odd) {
        background-color: rgba(177,225,64, 0.5); /* Semi-transparent green */
    }

    tr:nth-child(even) {
        background-color: rgba(177,225,64, 0.5); /* Solid green */
    }

    .big-checkbox {
        width: 18px; /* Reduced size */
        height: 18px; /* Reduced size */
        transform: scale(1.2); /* Slightly smaller than before */
        margin: 5px;
        accent-color: black; /* Ensures checkboxes are black and white */
    }

    .helping-status {
        color: green;
        font-size: 20px;
        font-family: 'Syne'; /* Changed to Manrope */
        font-weight: bold;
    }

    .served-status {
        color: blue;
        font-size: 20px;
        font-family: 'Syne'; /* Changed to Manrope */
        font-weight: bold;
    }

    .waiting-status {
        color: orange;
        font-size: 20px;
        font-family: 'Syne'; /* Changed to Manrope */
        font-weight: bold;
    }

    /* Style ticket number links */
    td a {
        color: black;
        text-decoration: underline;
        font-family: 'Manrope', sans-serif; /* Changed to Manrope */
    }

    /* Updated select styling */
    select {
        padding: 6px;
        font-size: 16px;
        font-family: 'Manrope', sans-serif; /* Changed to Manrope */
         /* Made it bold */
        background-color: rgba(177,225,64, 0.5); /* Blends with table */
        color: black;
        
        border-radius: 10px;
        outline: none;
        cursor: pointer;
        text-align: center;
    }

    /* Optional: Darken dropdown on hover */
    select:hover {
        background-color: rgba(177,225,64, 0.7);
    }

    .history-button {
        margin-top: 40px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: 'Manrope', sans-serif; /* Changed to Manrope */
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .history-button img {
        padding-left: 5px;
        width: 20px;
        height: 20px;
    }
`}</style>


        </div>
    );
}

export default QueueDisplay;
