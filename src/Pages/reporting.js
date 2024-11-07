import React, { useEffect, useState } from "react";
import { Flex, Progress } from "antd";
import { COLORS, FONT } from "../Constants/theme.js";
import "../queue.css";
import {useNavigate} from "react-router-dom";

const Reporting = () => {
    const navigate = useNavigate(); 
    return ( 
        <div>

        <div className='title-container'>
        <p style = {FONT.bold_50}>\Articles/ and other things</p>
        </div>
         </div>
        

    );
};

export default Reporting;
