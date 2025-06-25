import React, { useState } from 'react';
import { base_url } from '../utils/constants';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Register = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isParticipant, setIsParticipant] = useState(true);
  const HandleSignUp = async () => {
    // axios.post call to signup api
    try {
      const api = isParticipant
        ? '/api/participant/register'
        : '/api/admin/register';
      await axios.post(
        base_url + api,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      if (isParticipant) {
        localStorage.setItem('userRole', 'participant');
        navigate('/participant');
      } else {
        localStorage.setItem('userRole', 'admin');
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response.data);
    }
  };
  const ToLogin = () => {
    navigate('/login');
  };
  return (
    <div className="my-2 lg:my-10">
      <h1 className="text-center lg:text-lg font-bold my-2">REGISTER</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="mx-auto fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
      >
        <div className="my-2 lg:my-4 flex justify-between">
          <label className="label">Participant</label>
          <input
            type="radio"
            onClick={() => {
              setIsParticipant(true);
            }}
            name="radio-1"
            className="radio"
            defaultChecked
          />
          <label className="label">Admin</label>
          <input
            type="radio"
            onClick={() => {
              setIsParticipant(false);
            }}
            name="radio-1"
            className="radio"
          />
        </div>
        <label className="label">Firstname</label>
        <input
          type="text"
          value={firstName}
          className="input"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          placeholder="Enter your Firstname"
          required
        />

        <label className="label">Surname</label>
        <input
          type="text"
          value={lastName}
          className="input"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          placeholder="Enter your Surname"
          required
        />

        <label className="label">Email</label>
        <input
          type="email"
          value={emailId}
          className="input"
          onChange={(e) => {
            setEmailId(e.target.value);
          }}
          placeholder="sample@gmail.com"
          required
        />

        <label className="label">Password</label>
        <input
          type="password"
          value={password}
          className="input"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Set Password"
          required
        />
        {error && <p className="text-error">{error}</p>}
        <button
          onClick={() => {
            if (emailId.trim().length > 0 && password.trim().length > 0)
              HandleSignUp();
          }}
          className="btn btn-neutral mt-4"
        >
          Sign Up
        </button>
        <p
          onClick={ToLogin}
          className="text-center text-md my-4 text-primary-content hover:text-secondary-content"
        >
          Already a User ? Login
        </p>
      </form>
    </div>
  );
};

export default Register;
