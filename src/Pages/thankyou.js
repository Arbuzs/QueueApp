
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FONT } from "../Constants/theme.js"; // Ensure this path is correct based on your project structure

function ThankYou() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/welcome");
        }, 3000);

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [navigate]);

    return (
        <div style={styles.container}>
            <p style={FONT.bold_50}>Thank you</p>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
    },
};

export default ThankYou;
