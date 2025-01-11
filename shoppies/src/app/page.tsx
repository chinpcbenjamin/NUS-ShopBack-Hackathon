"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Box, Button, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, createUserData, getUserData, newUserSignUp, updateUserData } from './firebaseConfig';
import { Timestamp } from 'firebase/firestore';

const Home: React.FC = () => {
  const randomNumberInRange = (min: number, max: number) => {
    return Math.floor(Math.random()
        * (max - min + 1)) + min;
  };

  let points = 0;
  let successfulLogin = 0;
  let successfulPurchase = 0;
  let questLogin = randomNumberInRange(3, 5);
  let questPurchase = randomNumberInRange(3, 5);
  let questRewards = false
  let questExpiry = new Timestamp(Timestamp.now().seconds + 7 * 24 * 60 * 60, 0)

  const [popup, setPopup] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    updateUserData(successfulLogin, questLogin, successfulPurchase, questPurchase, questRewards, questExpiry, points)
  }, [successfulLogin, questLogin, successfulPurchase, questPurchase, questRewards, questExpiry, points])

  const handleRedeemRewards = () => {
    window.location.href = '/rewards';
  };

  const handleWeeklyQuest = () => {
    setPopup('weeklyQuest');
  };

  const handleLoginPress = () => {
    setPopup('login');
  };

  const handlePurchaseStreak = () => {
    window.location.href = '/streak';
  };

  const handLoginQuestCompletion = () => {
    if (successfulLogin == questLogin) {
        points+= 10;
        successfulLogin = 0
        questLogin = randomNumberInRange(3, 10);
    }
  }

  const loadUserData = async () => {
    const data = await getUserData()
    if (data) {
      points = data["points"]
      successfulLogin = data["successful_logins"]
      successfulPurchase = data["successful_purchases"]
      questLogin = data["quest_logins"]
      questPurchase = data["quest_purchases"]
      questRewards = data["quest_has_visited_rewards"]
      questExpiry = data["quest_expiry"]
    }
  }

  const handleSignUp = async () => {
    try {
      await newUserSignUp(email, password)
      await createUserData(1, randomNumberInRange(3, 5), 0, randomNumberInRange(3, 5), false, new Timestamp(Timestamp.now().seconds + 7 * 24 * 60 * 60, 0), 0)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loadUserData()
      successfulLogin++;
      setPopup(null); 
      handLoginQuestCompletion;
      console.log('Login successful');
    } catch (err: any) {
      console.error(err.message);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Box className="min-h-screen flex flex-col">
      <Box component="main" display="flex" justifyContent="center" gap={150} className="bg-gray-100 py-8">
        <Container className="text-center">
          <Typography variant="h4" className="mb-4">Welcome to Test</Typography>
          <Typography variant="body1" color="textSecondary">This is a test website</Typography>
        </Container>
        <Container className="text-center">
          <Typography variant="h4" className="mb-4">{auth.currentUser? auth.currentUser.email[0] : "User"}</Typography>
          <Typography variant="body1" color="textSecondary">{points} points</Typography>
        </Container>
      </Box>
      <Box component="header" className="bg-gray-800 text-left text-white py-4">
        <Container className="flex flex-wrap items-center justify-between">
          <Box className="flex space-x-4">
            {['Categories', 'Travel', 'Fashion', 'Electronics', 'Health', 'Marketplace', 'Beauty'].map((item) => (
              <Button key={item} className="text-sm font-medium hover:text-gray-300" color="inherit">
                {item}
              </Button>
            ))}
            <Button
              size="small" 
              color="inherit" 
              onClick={handleRedeemRewards} 
              className="text-sm font-medium"
            >
              Redeem Rewards
            </Button>
            <Button 
              size="small" 
              color="inherit" 
              onClick={handleWeeklyQuest} 
              className="text-sm font-medium"
            >
              Weekly Quest
            </Button>
            <Button 
              size="small" 
              color="inherit" 
              onClick={handlePurchaseStreak} 
              className="text-sm font-medium"
            >
              Streak Rewards
            </Button>
            <Button 
              size="small" 
              color="inherit" 
              onClick={handleLoginPress} 
              className="text-sm font-medium"
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>



      {popup === 'weeklyQuest' && (
        <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Box className="bg-white p-6 rounded shadow-md w-96">
            <Typography variant="h6" className="mb-4">Weekly Quest</Typography>
            <ul className="list-disc list-inside space-y-2">
              <li>10 points: Log in ({successfulLogin}/{questLogin})</li>
              <li>20 points: Purchase items (0/{questPurchase})</li>
              <li>30 points: Filler quest (0/{questRewards})</li>
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

           
      {popup === 'login' && (
        <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Box className="bg-white p-6 rounded shadow-md w-96">
            <IconButton
                className="absolute top-2 right-2"
                onClick={() => setPopup(null)}
            >
                <CloseIcon/>
            </IconButton>
            <Typography variant="h6" align= "center" className="mb-4">
                Login
            </Typography>
            <form onSubmit={handleLogin}>
                <Box display="flex" 
                     flexDirection="column"
                     justifyContent= "center"
                     gap={2} 
                    >
                    <TextField
                        label="Email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Login
                    </Button>
                    <Button onClick={handleSignUp}>Sign Up</Button>
                </Box>
            </form>
            {error && (
                <Typography variant="body2" color="error" align = "right" className="mb-4">
                {error}
                </Typography>
            )}
            </Box>
        </Box>
      )}
    </Box>
  );
};

export default Home;
