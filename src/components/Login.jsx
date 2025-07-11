import { useState } from 'react';
import axios from 'axios';
import { base_url } from '../utils/constants';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isParticipant, setIsParticipant] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const HandleLogin = async () => {
    try {
      const api = isParticipant ? '/api/participant/login' : '/api/admin/login';
      await axios.post(
        base_url + api,
        {
          emailId,
          password,
        },
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
      setError(err.response.data.message);
    }
  };

  const ToSignUp = () => {
    navigate('/signup');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <h1 className="text-center lg:text-lg font-bold my-2">LOGIN</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="mx-auto fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
        >
          <div className="my-2 lg:my-4 flex justify-between">
            <label className="label">User</label>
            <input
              type="radio"
              onClick={() => {
                setIsParticipant(true);
              }}
              name="radio-1"
              className="radio"
              defaultChecked
            />
            <label className="label">Controller</label>
            <input
              type="radio"
              onClick={() => {
                setIsParticipant(false);
              }}
              name="radio-1"
              className="radio"
            />
          </div>
          <label className="label">Email</label>
          <input
            type="email"
            value={emailId}
            className="input"
            onChange={(e) => {
              setEmailId(e.target.value);
            }}
            placeholder="Email"
            required
          />

          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              className="input w-full pr-16"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute z-10 right-2 top-1/2 transform -translate-y-1/2 text-sm text-base-content opacity-70 hover:opacity-100"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p className="text-error">{error}</p>}
          <button
            onClick={() => {
              if (emailId.trim().length > 0 && password.trim().length > 0)
                HandleLogin();
            }}
            className="btn btn-neutral mt-4"
          >
            Login
          </button>
          <p
            onClick={ToSignUp}
            className="text-center text-md my-4 text-primary-content hover:text-secondary-content"
          >
            New User ? Register Here
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
