import React, { useEffect, useState } from "react";
import { Flex, Progress } from "antd";
import { COLORS, FONT } from "../Constants/theme.js";
import "../queue.css";
import {useNavigate} from "react-router-dom";

const Noticket = () => {
    const navigate = useNavigate(); 
    return ( 
        <div>

        <div className='title-container'>
        <p style = {FONT.bold_50}>DON'T HAVE A TICKET?</p>
        </div>
        <div className = 'noticket-container'>
            <button className= 'button' onClick={() => navigate("/form")}>
                <p style ={FONT.bold_40}>Cannot access laptop,phone, etc.</p> 
                </button>
            
                <button className= 'button' onClick={() => navigate("/form")}>
                <p style ={FONT.bold_40}>Other</p> 
                </button>
            
                <button className= 'button' onClick={() => navigate("/form")}>
                <p style ={FONT.bold_40}>Other</p> 
                </button>
                <button className= 'button' onClick={() => navigate("/form")}>
                <p style ={FONT.bold_40}>Other</p> 
                </button>
            
        </div>
        </div>

    );
};

export default Noticket;
