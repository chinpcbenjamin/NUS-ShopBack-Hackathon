'use client'

import React, { useEffect, useState, CSSProperties } from 'react';
import { differenceInDays, parseISO } from 'date-fns';

const StreakPage: React.FC = () => {
    const [streak, setStreak] = useState<number>(() => {
        const storedStreak = localStorage.getItem('streak');
        return storedStreak ? parseInt(storedStreak, 10) : 0;
    });
    const [date, setDate] = useState<Date>(() => {
        const storedDate = localStorage.getItem('date');
        return storedDate ? new Date(storedDate) : new Date();
    });

    useEffect (() => {
        localStorage.setItem('streak', streak.toString());
        localStorage.setItem('date', date.toISOString());
    }, [streak, date]);
    
    function buy() {
        const today = new Date();
        const storedDate = localStorage.getItem('date');
        const previousDate = storedDate ? new Date(storedDate) : null;
        const difference = previousDate ? differenceInDays(today, previousDate) : Infinity;

        if (difference === 1) {
            if (streak >= 7) {
                setStreak(1);
            } else {
                setStreak(streak + 1);
            }
            setDate(today);
        } else if (difference > 1) {
            setStreak(1)
            setDate(today)
        } else if (difference === 0) {
            if (streak === 0) {
                setStreak(1)
            }
            setDate(today)
        }
        
    }

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Streak Tracker</h1>
            <div style={styles.card}>
                <p style={styles.text}>
                    <strong>Current Streak:</strong> {streak} day{streak !== 1 ? 's' : ''}
                </p>
                <p style={styles.text}>
                    <strong>Last Login:</strong>{' '}
                    {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <button
                    style={{
                        ...styles.button,
                        backgroundColor: isHovered ? '#45a049' : '#4caf50', // Change color on hover
                    }}
                    onMouseEnter={() => setIsHovered(true)} 
                    onMouseLeave={() => setIsHovered(false)} 
                    onClick={buy}
                >
                    Make Purchase!
                </button>
            </div>
        </div>
    );
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        padding: '20px',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#4caf50',
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
    },
    text: {
        fontSize: '1.2rem',
        margin: '10px 0',
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#4caf50',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default StreakPage;