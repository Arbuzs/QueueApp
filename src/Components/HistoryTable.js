import React from "react";
import { COLORS, FONT } from "../Constants/theme.js";
import "../queue.css"

const HistoryTable = ({ statistics }) => {
  
  const exportToCSV = () => {
    const csvHeader = "Analyst Name,Visitor Name,Date,Ticket Number\n";
    const csvRows = statistics.map(stat => 
      `${stat.analyst_name},${stat.visitor_name},${new Date(stat.date).toLocaleDateString()},${stat.ticket_number}`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvHeader + csvRows.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "history_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-container">
      <div className="header-container">
        <h2 style={FONT.bold_50}>History</h2>
        <div className="view-buttons" style={{ width: "200px", margin: "20px" }}>
          <button style={{ width: "200px", padding: "20px" }} onClick={exportToCSV} className="button">
            Export Raw ticket data
          </button>
        </div>
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
                <a
                  href={`https://agcbio.service-now.com/now/nav/ui/search/${stat.ticket_number}/params/search-term/${stat.ticket_number}/global-search-data-config-id/c861cea2c7022010099a308dc7c26041/back-button-label/Tasks/search-context/now%2Fnav%2Fui`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'black' }}
                >
                  {stat.ticket_number}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          margin: 20px;
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 10px; /* Rounded corners */
          overflow: hidden; /* Ensures the content stays within rounded corners */
          background-color: ${COLORS.white};
        }
        thead th {
          background-color: ${COLORS.primary_2};
          color: black;
          font-weight: bold;
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid gray; /* Keeps a visible separator */
          padding: 12px;
        }
        tbody tr:nth-child(odd) {
          background-color: white;
        }
        tbody tr:nth-child(even) {
          background-color: rgba(177, 225, 64, 0.8);
        }
        th, td {
          padding: 10px;
          text-align: left;
          font-weight: bold;
          border: 1px solid grey;
        }
      `}</style>
    </div>
  );
};

export default HistoryTable;
