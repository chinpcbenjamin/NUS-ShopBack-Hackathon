"use client";

import React, { useState } from 'react';
import { Container, Fab, Typography, Box, Button } from '@mui/material';

const Home: React.FC = () => {
  const [popup, setPopup] = useState<string | null>(null);

  const handleRedeemRewards = () => {
    window.location.href = '/rewards';
  };

  const handleWeeklyQuest = () => {
    setPopup('weeklyQuest');
  };

  const handlePurchaseStreak = () => {
    window.location.href = '/streak';
  };

  return (
    <Box className="min-h-screen flex flex-col">
      <Box component="header" className="bg-gray-800 text-white py-4">
        <Container className="flex flex-wrap items-center justify-between">
          <Box className="flex space-x-4">
            {['Categories', 'Travel', 'Fashion', 'Electronics', 'Health', 'Marketplace', 'Beauty'].map((item) => (
              <Button key={item} className="text-sm font-medium hover:text-gray-300" color="inherit">
                {item}
              </Button>
            ))}
            <Fab 
              size="small" 
              variant="extended" 
              color="success" 
              onClick={handleRedeemRewards} 
              className="text-sm font-medium"
            >
              <span className="material-icons mr-2">redeem</span>
              Redeem Rewards
            </Fab>
            <Fab 
              size="small" 
              variant="extended" 
              color="primary" 
              onClick={handleWeeklyQuest} 
              className="text-sm font-medium"
            >
              <span className="material-icons mr-2">assignment</span>
              Weekly Quest
            </Fab>
            <Fab 
              size="small" 
              variant="extended" 
              color="secondary" 
              onClick={handlePurchaseStreak} 
              className="text-sm font-medium"
            >
              <span className="material-icons mr-2">stars</span>
              Purchase Streak Rewards
            </Fab>
          </Box>
        </Container>
      </Box>

      {popup === 'weeklyQuest' && (
        <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Box className="bg-white p-6 rounded shadow-md w-96">
            <Typography variant="h6" className="mb-4">Weekly Quest</Typography>
            <ul className="list-disc list-inside space-y-2">
              <li>Complete 3 purchases to earn 10 points</li>
              <li>Refer 2 friends to get 20 points</li>
              <li>Shop from our partners to unlock special rewards</li>
            </ul>
            <Button 
              variant="contained" 
              color="error" 
              className="mt-4"
              onClick={() => setPopup(null)}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}

      <Box component="main" className="flex-grow bg-gray-100 py-8">
        <Container className="text-center">
          <Typography variant="h4" className="mb-4">Welcome to ShopBack</Typography>
          <Typography variant="body1" color="textSecondary">Start shopping and earn cashback rewards!</Typography>
        </Container>
      </Box>

      <Box component="footer" className="bg-gray-800 text-white py-4">
        <Container className="text-center">
          <Typography variant="body2">&copy; 2025 ShopBack. All rights reserved.</Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
