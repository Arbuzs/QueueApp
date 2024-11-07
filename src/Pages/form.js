import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FONT } from "../Constants/theme.js";
import "../queue.css";

function Form() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [ticketNumber, setTicketNumber] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            visitor_name: name,
            ticket_number: ticketNumber,
            queue_number: Math.floor(Math.random() * 1000), // Or generate this number as needed
            Time: new Date().toLocaleTimeString(),
            helping_now: false,
            served: false
        };

        try {
            const response = await axios.post('http://localhost:3000/api/queue', formData);
            if (response.status === 201) {
                alert("Form submitted successfully!");
                navigate("/thankyou");
            } else {
                alert("Form submission failed.");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            alert("Form submission error.");
        }
    };

    return (
        <div>
            <div className="formtitle-container">
                <p style={FONT.bold_50}>FILL OUT INFORMATION</p>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
                <div className='input-container'>
                    <input
                        type="text"
                        value={name}
                        className="focus-input"
                        placeholder=" "
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label className="input-label">First Name</label>
                </div>
                <div className='input-container'>
                    <input
                        type="text"
                        value={ticketNumber}
                        className="focus-input"
                        placeholder=" "
                        onChange={(e) => setTicketNumber(e.target.value)}
                    />
                    <label className="input-label">Ticket Number</label>
                </div>
                <button className="button" type='submit'>
                    <p style={FONT.bold_50}>SUBMIT</p>
                </button>
            </form>
        </div>
    );
}

export default Form;
