import React, { useEffect, useState } from "react";
import { Flex, Progress } from "antd";
import { COLORS, FONT } from "../Constants/theme.js";
import "../queue.css";
import {useNavigate} from "react-router-dom";

function Form() {
    const navigate =  useNavigate(); 
    const [name, setName] = useState('');
    const [ticketNumber, setTicketNumber] = useState('');
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSdhnbXrn0w8y5yeNnXE9k-dY8H6hkV4P9etzS9u8JcCPpwFYg/formResponse";
      const formData = new FormData();
      formData.append("entry.1434050950", name);  // Replace with the actual entry ID for "Your Name"
      formData.append("entry.533996118", ticketNumber);  // Replace with the actual entry ID for "Ticket Number"
  
      const requestOptions = {
        method: 'POST',
        body: new URLSearchParams(formData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
  
      try {
        const response = await fetch(formURL, requestOptions);
        if (response.ok) {
          alert("Form submitted successfully!");
        } else {
          alert("Form submission failed.");
        }
      } catch (error) {
      }
    };
  
    return (
    <div>

      <div className="formtitle-container">
        <p style= {FONT.bold_50}>FILL OUT INFORMATION</p>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
          <div className = 'input-container'>
          <input
              type="text"
              value={name}
              class= "focus-input"
              placeholder=" "
              onChange={(e) => setName(e.target.value)}
            />
            <label class= "input-label"> Name</label>
          </div>
          <div className = 'input-container'>
          <input
              type="text"
              value={ticketNumber}
              class= "focus-input"
              placeholder=" "
              onChange={(e) => setTicketNumber(e.target.value)}
            />
            <label class= "input-label"> Ticket Number</label>
          </div>
         
          
          <button className="button" type= 'submit' onClick={() => navigate("/thankyou")}><p style= {FONT.bold_50}>QUEUE UP</p></button>
        </form>
    </div>
    );
  }
  
  export default Form;