import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import API_URL from './config';

const LatestQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Fetch initial quotes
        fetchLatestQuotes();
        
        // Setup WebSocket connection
        const sock = new SockJS(`${API_URL}/ws-quotes`);
        const client = new Client({
            webSocketFactory: () => sock,
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            client.subscribe('/topic/quotes', (message) => {
                const newQuote = JSON.parse(message.body);
                setQuotes(prevQuotes => {
                    const updatedQuotes = [newQuote, ...prevQuotes].slice(0, 5);
                    return updatedQuotes;
                });
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP error', frame);
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []);

    const fetchLatestQuotes = async () => {
        try {
            const response = await fetch(`${API_URL}/quotes/latest`);
            const data = await response.json();
            setQuotes(data);
        } catch (error) {
            console.error('Error fetching latest quotes:', error);
        }
    };

    return (
        <div className="latest-quotes p-4">
            <h3 className="text-xl font-bold mb-4">Latest Quotes</h3>
            <div className="space-y-4">
                {quotes.map((quote, index) => (
                    <div key={quote.quoteId || index} className="quote-card bg-white p-4 rounded-lg shadow">
                        <p className="text-lg italic mb-2">"{quote.quote}"</p>
                        <p className="text-sm font-semibold">- {quote.character}</p>
                        <p className="text-xs text-gray-600">
                            From: {quote.movie?.title || 'Unknown Movie'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LatestQuotes;