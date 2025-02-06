import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LifeguardImg from '../../Images/Lifeguard.png';
import ReportsImg from '../../Images/Reports.png';
import BeachImg from '../../Images/beachesADMIN.png';
import SensorsImg from '../../Images/Sensors.png';
import { jwtDecode } from 'jwt-decode';

const AdminPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || !(jwtDecode(token).role === "ADMIN")) {
            navigate('/home');
        }
      }, );
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '100px 20px 20px',
        backgroundColor: '#f5f5f5',
        minHeight: 'calc(100vh - 50px)',
        boxSizing: 'border-box',
    };

    const outerCardContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '100px',
        padding: '75px',
        border: '2px solid rgba(0, 0, 0, 0.6)',
        borderRadius: '16px',
        boxShadow: '8px 8px 25px rgba(0, 0, 0, 0.7)',
        backgroundColor: '#ffffff',
    };

    const cardColumnStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    };

    const cardStyle = (bgColor, height) => ({
        backgroundColor: bgColor,
        width: '600px',
        height: height,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        borderRadius: '12px',
        cursor: 'pointer',
    });

    const imageStyle = {
        width: '40%',
        height: 'auto',
    };

    const lifeguardImageStyle = {
        width: '28%', // Reduzi o tamanho da imagem específica para Lifeguards
        height: 'auto',
        marginRight: '8%',
    };

    const textStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
        marginLeft: '20px',
    };

    const goToLifeguardPage = () => navigate('/LifeguardGerir');
    const goToReportsPage = () => navigate('/AdminReports');
    const goToBeachesPage = () => navigate('/AdminBeach');
    const goToSensorsPage = () => navigate('/sensors');

    return (
        <div style={containerStyle}>
            <div style={outerCardContainerStyle}>
                {/* Coluna da esquerda */}
                <div style={cardColumnStyle}>
                    <div style={cardStyle('#3dbf92', '290px')} onClick={goToLifeguardPage}>
                        <span style={textStyle}>Lifeguards</span>
                        <img src={LifeguardImg} alt="Lifeguard" style={lifeguardImageStyle} />
                    </div>
                    <div style={cardStyle('#8673A1', '290px')} onClick={goToSensorsPage}>
                        <span style={textStyle}>Sensors</span>
                        <img src={SensorsImg} alt="Sensors" style={imageStyle} />
                    </div>
                </div>

                {/* Coluna da direita */}
                <div style={cardColumnStyle}>
                    <div style={cardStyle('#e53935', '290px')} onClick={goToReportsPage}>
                        <span style={textStyle}>Reports</span>
                        <img src={ReportsImg} alt="Reports" style={imageStyle} />
                    </div>
                    <div style={cardStyle('#1976d2', '290px')} onClick={goToBeachesPage}>
                        <span style={textStyle}>Beaches</span>
                        <img src={BeachImg} alt="Beach" style={imageStyle} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
