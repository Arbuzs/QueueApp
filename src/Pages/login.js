import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FONT } from "../Constants/theme.js";
import "../queue.css";

const LogIn = () => {
    const navigate = useNavigate(); 
    return ( 
        <div>

        <div className='title-container'>
        <p style = {FONT.bold_50}>CHOOSE WORKSCREEN</p>
        </div>
        <div className = 'button-container'>
            <button className= 'button' onClick={() => navigate("/welcome")}>
                <p style ={FONT.bold_40}>User version</p> 
                </button>
            
            <button className= 'button' onClick={() => navigate("/queuedisplay")}> <p style ={FONT.bold_40}>Queue Management</p> </button>
            <button className= 'button' onClick={() => navigate("/reporting")}> <p style ={FONT.bold_40}>Reporting</p> </button>
        
        </div>
        </div>

    );
};

export default LogIn;

