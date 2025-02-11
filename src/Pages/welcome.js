
import {  FONT } from "../Constants/theme.js";
import "../queue.css";
import {useNavigate} from "react-router-dom";
import React from "react";
const Welcome = () => {
    const navigate = useNavigate(); 
    return ( 
        <div>

        <div className='title-container'>
        <p style = {FONT.bold_50}>WELCOME TO IT SUPPORT</p>
        </div>
        <div className = 'button-container'>
            <button className= 'button' onClick={() => navigate("/form")}>
                <p style ={FONT.bold_40}>I have a ticket</p> 
                </button>
            
            <button className= 'button2' onClick={() => navigate("/noticket")}> <p style ={FONT.bold_40}>No ticket</p> </button>
        </div>
        </div>

    );
};

export default Welcome;
