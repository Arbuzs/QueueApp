import { useNavigate } from "react-router-dom";
import React from "react";
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
                <p style ={FONT.bold_40}>USER VERSION</p> 
                </button>
            
            <button className= 'button' onClick={() => navigate("/queuedisplay")}> <p style ={FONT.bold_40}>QUEUE TABLE</p> </button>
            <button className= 'button' onClick={() => navigate("/reporting")}> <p style ={FONT.bold_40}>REPORTING</p> </button>
        
        </div>
        </div>

    );
};

export default LogIn;

