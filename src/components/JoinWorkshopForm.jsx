import axios from 'axios';
import { base_url } from '../utils/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const JoinWorkshopForm = ({ workShopId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    originCity: '',
    modeOfTravel: 'train',
    preferredDate: '',
    accommodationRequired: false,
    remarks: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // make api call here
    try {
      const data = await axios.post(
        base_url + '/api/workshop/join/request/' + workShopId,
        formData,
        {
          withCredentials: true,
        }
      );
      if (!data) throw new Error('Failed');
      alert('Join Request Created');
      navigate('/participant');
    } catch (err) {
      alert(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mb-10 mx-auto bg-base-200 p-4 rounded shadow"
    >
      <div className="mb-3">
        <label className="block font-medium">Origin City</label>
        <input
          type="text"
          name="originCity"
          value={formData.originCity}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Mode of Travel</label>
        <select
          name="modeOfTravel"
          value={formData.modeOfTravel}
          onChange={handleChange}
          required
          className="select select-bordered w-full"
        >
          <option value="train">Train</option>
          <option value="flight">Flight</option>
          <option value="bus">Bus</option>
          <option value="car">Car</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block font-medium">Preferred Travel Date</label>
        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-3 flex items-center">
        <input
          type="checkbox"
          name="accommodationRequired"
          checked={formData.accommodationRequired}
          onChange={handleChange}
          className="mr-2 checkbox"
        />
        <label className="font-medium">Accommodation Required</label>
      </div>

      <div className="mb-3">
        <label className="block font-medium">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
          placeholder="Optional remarks"
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Submit Join Request
      </button>
    </form>
  );
};

export default JoinWorkshopForm;
