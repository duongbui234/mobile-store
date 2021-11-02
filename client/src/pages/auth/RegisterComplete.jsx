import React, { useEffect, useState } from 'react';
import { MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { notification } from 'antd';
import { auth } from '../../firebase/firebase.utils';

const RegisterComplete = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !email) {
      notification.error({
        message: 'Email and password is required',
        duration: 3,
      });
      return;
    }
    if (password.length < 6) {
      notification.error({
        message: 'Password must be at least 6 characters',
        duration: 3,
      });
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        window.localStorage.removeItem('emailForRegistration');
        const user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        console.log(user, idTokenResult);
      }
    } catch (error) {
      notification.error({
        message: error.message,
        duration: 3,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForRegistration'));
  }, []);

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Continue Register</h4>
          <form onSubmit={handleSubmit}>
            <MDBCol md='12' size='12' className='mt-4'>
              <MDBInput type='email' value={email} disabled className='mb-4' />
              <MDBInput
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
              />
            </MDBCol>
            <MDBCol size='auto' className='mt-3 mb-md-0'>
              <MDBBtn type='submit'>Complete Registration</MDBBtn>
            </MDBCol>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;