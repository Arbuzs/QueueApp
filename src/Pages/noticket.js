import React, {  useState } from "react";
import {  FONT } from "../Constants/theme.js";
import "../queue.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";


function Noticket() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [ticketNumber, setTicketNumber] = useState('');
    const [error] = useState('');

    const validateInput = (value) => {
        const isValid = true;
        return isValid;
    };

    const handleNameChange = (e) => {
        const { value } = e.target;
        setName(value.toUpperCase());  
    };

    const handleTicketNumberChange = (e) => {
        const { value } = e.target;
        setTicketNumber(value.toUpperCase());
        validateInput(value.toUpperCase());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInput(ticketNumber)) {
            alert("Invalid ticket number. It must start with INC or RITM.");
            return;
        }

        const formData = {
            visitor_name: name,
            ticket_number: ticketNumber,
            Time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            helping_now: 0,
            served: 0
        };

        try {
            const response = await axios.post('/api/queue', formData);
            if (response.status === 201) {
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
                        onChange={handleNameChange}
                    />
                    <label className="input-label">First Name</label>
                </div>
                    {error && <div className="error-message">{error}</div>}
                <div className='input-container'>
                    <input
                        type="text"
                        value={ticketNumber}
                        className="focus-input"
                        placeholder=" "
                        onChange={handleTicketNumberChange}
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
export default Noticket;
