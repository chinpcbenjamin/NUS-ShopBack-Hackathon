"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from 'next/navigation';  
import { getUserData } from '../../firebaseConfig'; 

const RewardsPage: React.FC = () => {
  const [popup, setPopup] = useState<string | null>(null);
  const [rewardPoints, setRewardPoints] = useState(150); 
  const [userPreferences, setUserPreferences] = useState<any>(null); 
  const [personalizedRewards, setPersonalizedRewards] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();  
      if (userData) {
        setRewardPoints(userData.points);
        setUserPreferences(userData.preferences);  
        generatePersonalizedRewards(userData.points, userData.preferences);
      }
    };
    loadUserData();
  },[]);

  const generatePersonalizedRewards = (points: number, preferences: any) => {
    let availableRewards = [
      { id: 1, name: '10% Off Fashion Coupon', pointsRequired: 50, category: 'Fashion' },
      { id: 2, name: 'Free Shipping on Electronics', pointsRequired: 100, category: 'Electronics' },
      { id: 3, name: 'Gift Card for $25 Health Items', pointsRequired: 150, category: 'Health' },
      { id: 4, name: 'Exclusive Access to Beauty Products', pointsRequired: 200, category: 'Beauty' },
      { id: 5, name: 'VIP Support on Marketplace', pointsRequired: 250, category: 'Marketplace' }
    ];

    const filteredRewards = availableRewards.filter((reward) => {
      const hasSufficientPoints = points >= reward.pointsRequired;
      const matchesPreference = preferences.includes(reward.category);  

      return hasSufficientPoints && matchesPreference;
    });

    setPersonalizedRewards(filteredRewards);
  };

  const handleRewardRedemption = (reward: any) => {
    if (rewardPoints >= reward.pointsRequired) {
      setRewardPoints(rewardPoints - reward.pointsRequired);
      alert(`You have redeemed: ${reward.name}`);
    } else {
      alert('You do not have enough points to redeem this reward');
    }
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  return (
    <Box className="min-h-screen flex flex-col">
      <Box component="main" display="flex" justifyContent="center" gap={150} className="bg-gray-100 py-8">
        <Container className="text-center items-center justify-center">
          <Typography variant="h4" className="mb-4">Redeem Rewards</Typography>
          <Typography variant="body1" color="textSecondary">Use points to claim rewards</Typography>
          <Typography variant="body1" color="textSecondary" className="mt-4">Current Points: {rewardPoints}</Typography>
        </Container>
      </Box>

      <Box className="flex items-center justify-center gap-4 mt-6">
        {personalizedRewards.length === 0 ? (
          <Typography variant="h6">No rewards available at the moment. Keep earning points to enjoy rewards!</Typography>
        ) : (
          personalizedRewards.map((reward) => (
            <Box key={reward.id} className="bg-white p-6 rounded shadow-md w-80">
              <Typography variant="h6" className="mb-4">{reward.name}</Typography>
              <Typography variant="body1" color="textSecondary" className="mb-4">
                {reward.pointsRequired} Points Required | Category: {reward.category}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRewardRedemption(reward)}
              >
                Redeem
              </Button>
            </Box>
          ))
        )}
      </Box>

      {popup && (
        <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Box className="bg-white p-6 rounded shadow-md w-96">
            <IconButton
              className="absolute top-2 right-2"
              onClick={handleClosePopup}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className="mb-4">{popup}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClosePopup}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RewardsPage;





