"use client";

import React, { useState } from 'react';
import { Container, Typography, TextField, Box, Button, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, createUserData, getUserData, newUserSignUp, SignOut, updateUserData } from './firebaseConfig';
import { Timestamp } from 'firebase/firestore';
import { unsubscribe } from 'diagnostics_channel';

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


const Home: React.FC = () => {
  const [popup, setPopup] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRedeemRewards = async () => {
    if (!questRewards) {
      questRewards = true
      await handleViewRewardsPageCompletion()
    }
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

  const handleViewRewardsPageCompletion = async () => {
    if (questRewards) {
      try {
        await updateUserData(successfulLogin, questLogin, successfulPurchase, questPurchase, questRewards, questExpiry, points + 30)
        points += 30
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleLoginQuestCompletion = async () => {
    if (successfulLogin == questLogin) {
        try {
          await updateUserData(successfulLogin, questLogin, successfulPurchase, questPurchase, questRewards, questExpiry, points + 10)
          points += 10
        } catch (error) {
          console.error(error)
        }
    }
  }

  const loadUserData = async () => {
    if (!auth.currentUser) {
        console.error("No user signed in");
        return;
    }
    const data = await getUserData()
    if (data) {
      if (Timestamp.now().valueOf() < data["quest_expiry"].valueOf()) {
        points = data["points"]
        successfulLogin = data["successful_logins"]
        successfulPurchase = data["successful_purchases"]
        questLogin = data["quest_logins"]
        questPurchase = data["quest_purchases"]
        questRewards = data["quest_has_visited_rewards"]
        questExpiry = data["quest_expiry"]
      } else {
        points = data["points"]
        successfulLogin = 0
        successfulPurchase = 0
        questLogin = randomNumberInRange(3, 5);
        questPurchase = randomNumberInRange(3, 5);
        questRewards = false
        questExpiry = new Timestamp(Timestamp.now().seconds + 7 * 24 * 60 * 60, 0)
      }
    }
  }

  const storeToFirestore = async () => {
    updateUserData(successfulLogin, questLogin, successfulPurchase, questPurchase, questRewards, questExpiry, points)
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
      await loadUserData()
      successfulLogin++;
      await storeToFirestore()
      setPopup(null);
      await handleLoginQuestCompletion();
      await storeToFirestore()
      console.log("Successful login")
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
          <Typography variant="h4" className="mb-4">{auth.currentUser? auth.currentUser?.email[0].toUpperCase() : "User"}</Typography>
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
              Weekly Quests
            </Button>
            <Button 
              size="small" 
              color="inherit" 
              onClick={handlePurchaseStreak} 
              className="text-sm font-medium"
            >
              Login Streak Rewards
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
            <Typography variant="h6" className="mb-4">Weekly Quests</Typography>
            <ul className="list-disc list-inside space-y-2">
              <li>10 points: Log in ({successfulLogin}/{questLogin}){successfulLogin >= questLogin ? ". Quest completed! Points have been added." : ""}</li>
              <li>20 points: Purchase items ({successfulPurchase}/{questPurchase})</li>
              <li>30 points: Visited 'Rewards' Page? ({questRewards ? "1/1. Quest completed! Points have been added." : "0/1"})</li>
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
                    <Button onClick={SignOut}>Sign Out</Button>
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
