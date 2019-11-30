import React from 'react';
import logo from './logo.svg';
import './App.css';

async function signup(username, password) {
  console.log('About to sign up');
  const response = await fetch('http://localhost:5000/auth/sign-up', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  .then(data => data.json());
  console.log(response);
}

async function signin(username, password) {
  console.log('About to sign in');
  const response = await fetch('http://localhost:5000/auth/sign-in', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  .then(data => data.json());
  console.log(response);
}

async function signout() {
  console.log('About to sign out');
  const response = await fetch('http://localhost:5000/auth/sign-out', { credentials: 'include' })
  .then(data => data.json());
  console.log(response);
}

async function getProfile() {
  console.log('About to get profile');
  const response = await fetch('http://localhost:5000/me', { credentials: 'include' })
  .then(data => data.json());
  console.log(response);
}

async function getConversations() {
  console.log('About to get conversations');
  const response = await fetch('http://localhost:5000/me/conversations', { credentials: 'include' })
  .then(data => data.json());
  console.log(response);
}

async function getAllUsers() {
  console.log('About to get all users');
  const response = await fetch('http://localhost:5000/users')
  .then(data => data.json());
  console.log(response);
}

async function createConversation(userId, messageText) {
  console.log('About to create conversation');
  const response = await fetch('http://localhost:5000/conversations', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      messageText
    })
  })
  .then(data => data.json());
  console.log(response);
}

async function getConversationById(id) {
  console.log('About to get conversation');
  const response = await fetch(`http://localhost:5000/conversations/${id}`, { credentials: 'include' })
  .then(data => data.json());
  console.log(response);
}

async function sendMessage(id, text) {
  console.log('About to send message');
  const response = await fetch(`http://localhost:5000/conversations/${id}`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  })
  .then(data => data.json());
  console.log(response);
}


// "5de1783053855c1c687e4474"  joebloggs id
// "5de17b9c53855c1c687e4475"  conversation id

function App() {
  return (
    <div>
      <button onClick={() => signup('adamcampbell', '1234')}>Sign Up One</button>
      <button onClick={() => signin('adamcampbell', '1234')}>Sign In One</button>
      <button onClick={signout}>Sign Out</button>
      <button onClick={() => signup('joebloggs', '1234')}>Sign Up Two></button>
      <button onClick={() => signin('joebloggs', '1234')}>Sign In Two</button>
      <button onClick={getProfile}>Get Profile</button>
      <button onClick={getConversations}>Get Conversations</button>
      <button onClick={getAllUsers}>Get All Users</button>
      <button onClick={() => {
        createConversation(
          "5de1783053855c1c687e4474",
          "Hello there friend"
        );
      }}>Create conversation</button>
      <button onClick={() => getConversationById("5de17b9c53855c1c687e4475")}>Get Conversation</button>
      <button onClick={() => sendMessage("5de17b9c53855c1c687e4475", "R u there?")}>Send Message</button>
    </div>
  );
}

export default App;
