import { useState, useEffect } from 'react';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Form from './components/Common/Form';
import Home from './components/Home';
import ResetPasswordForm from './components/ResetPasswordForm';
import EmailVerificationForm from './components/EmailVerificationForm';

import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import './firebase-config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth'

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')
    if (authToken) navigate('/home')
  }, [navigate])

  const handleAction = (id) => {
    const authentication = getAuth();
    if (id === 1) {
      signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          sendEmailVerification(authentication, email)
            .then((res)=>{
              console.log('verify'+res)
            })
          console.log('sign'+response.user)
          // navigate('/home')
          // sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
        }).catch((error) => {
          console.log(error)
          if(error.code === 'auth/wrong-password'){
            toast.error('Please check the Password');
          }
          if(error.code === 'auth/user-not-found'){
            toast.error('Please check the Email');
          }
        })
    }

    if (id === 2) {
      createUserWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          navigate('/home')
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
        }).catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            toast.error('Email Already in Use');
          }
        })
    }
  }

  const resetAction = () => {
    const authentication = getAuth();
    console.log(email)
    sendPasswordResetEmail(authentication, email)
      .then((response)=>{
        console.log(response)
      }).catch((error)=>{
        console.log(error)
      })
  }

  const emailVerificationAction = () => {
    console.log('email verification')
  }

  return (
    <div className="App">
      <>
        <Routes>
          <Route
            path='/login'
            element={
              <Form
                title="Login"
                setEmail={setEmail}
                setPassword={setPassword}
                handleAction={() => handleAction(1)}
              />}
          />
          <Route
            path='/register'
            element={
              <Form
                title="Register"
                setEmail={setEmail}
                setPassword={setPassword}
                handleAction={() => handleAction(2)}
              />}
          />
          <Route
            path='/home'
            element={
              <Home />}
          />
          <Route
            path='/resetpassword'
            element={
              <ResetPasswordForm 
                title="Reset Password"
                setEmail={setEmail}
                resetAction={() => resetAction()}/>
              }
          />
          <Route
            path='/emailverification'
            element={
              <EmailVerificationForm 
                title="Email Verification"
                setEmail={setEmail}
                EmailVerificationAction={() => emailVerificationAction()}/>
              }
          />
        </Routes>
        <ToastContainer/>
      </>
    </div>
  );
}

export default App;