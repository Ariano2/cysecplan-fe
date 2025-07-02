import { useState, useEffect } from 'react';
import { base_url } from '../utils/constants';
import axios from 'axios';

const EditProfile = ({ user, setEditMode, refreshUser }) => {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
    };

    if (oldPassword && newPassword) {
      payload.oldPassword = oldPassword;
      payload.newPassword = newPassword;
    }

    try {
      const res = await axios.patch(`${base_url}/api/profile`, payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setMessage('Profile updated successfully!');
        refreshUser();
        setTimeout(() => {
          setEditMode(false);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        className="card bg-base-200 shadow-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-center">Edit Profile</h2>

        <div className="form-control">
          <label className="label">First Name</label>
          <input
            type="text"
            className="input input-bordered"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">Last Name</label>
          <input
            type="text"
            className="input input-bordered"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="divider">Optional: Change Password</div>

        <div className="form-control">
          <label className="label">Old Password</label>
          <input
            type="password"
            className="input input-bordered"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">New Password</label>
          <input
            type="password"
            className="input input-bordered"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {message && <div className="text-sm text-center">{message}</div>}

        <div className="card-actions justify-end">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Profile = () => {
  const [user, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${base_url}/api/profile`, {
        withCredentials: true,
      });
      setUserDetails(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!user) return <div className="text-center mt-10">Loading Profile...</div>;

  if (editMode)
    return (
      <EditProfile
        user={user}
        setEditMode={setEditMode}
        refreshUser={getUserDetails}
      />
    );

  return (
    <div className="card my-20 mx-auto w-96 bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Profile Info</h2>
        <p>
          <span className="font-bold">First Name:</span> {user.firstName}
        </p>
        <p>
          <span className="font-bold">Last Name:</span> {user.lastName}
        </p>
        <p>
          <span className="font-bold">Email:</span> {user.emailId}
        </p>
        <div className="card-actions justify-end mt-4">
          <button onClick={() => setEditMode(true)} className="btn btn-primary">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
