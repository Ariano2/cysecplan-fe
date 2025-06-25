import { useState } from 'react';
import axios from 'axios';
import { base_url } from '../utils/constants';
import { useNavigate } from 'react-router';
import ToAdmin from './navigators/ToAdmin';
const CreateWorkshop = function () {
  const navigate = useNavigate();
  const [state, setState] = useState({
    title: '',
    description: '',
    startDate: undefined,
    endDate: undefined,
    registrationDeadline: undefined,
    capacity: 100,
    location: {
      isVirtual: false,
      link: '',
      city: '',
      address: '',
    },
    materials: [],
  });
  const handleChange = (name, value) => {
    setState({ ...state, [name]: value });
  };
  const handleSubmit = async () => {
    try {
      await axios.post(base_url + '/api/workshop/create', state, {
        withCredentials: true,
      });
      alert('Workshop Created Successfully');
      navigate('/admin');
    } catch (err) {
      alert('Encountered Error Workshop not created');
      console.log(err.message);
    }
  };
  return (
    <div className="m-10">
      <ToAdmin />
      <h1 className="font-bold text-center text-lg">Create Workshop</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <fieldset className="fieldset">
          <legend className="fieldset-legend md:text-lg">
            Workshop Title<span className="text-red-500">*</span>
          </legend>
          <input
            type="text"
            value={state.title}
            onChange={(e) => {
              handleChange('title', e.target.value);
            }}
            className="input-md border-2 p-2 border-primary lg:input-lg"
            required
            placeholder="Workshop Title"
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend md:text-lg">Description</legend>
          <input
            type="text"
            value={state.description}
            onChange={(e) => {
              handleChange('description', e.target.value);
            }}
            className="input-md border-2 p-2 border-primary lg:input-lg"
            placeholder="Optional Description"
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend md:text-lg">
            Start Date<span className="text-red-500">*</span>
          </legend>
          <input
            type="datetime-local"
            onChange={(e) => {
              handleChange('startDate', e.target.value);
            }}
            className="input-md border-2 p-2 border-primary lg:input-lg"
            required
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend md:text-lg">
            End Date<span className="text-red-500">*</span>
          </legend>
          <input
            type="datetime-local"
            onChange={(e) => {
              handleChange('endDate', e.target.value);
            }}
            className="input-md border-2 p-2 border-primary lg:input-lg"
            required
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend md:text-lg">
            Registration Deadline
          </legend>
          <input
            type="datetime-local"
            onChange={(e) => {
              handleChange('registrationDeadline', e.target.value);
            }}
            className="input-md border-2 p-2 border-primary lg:input-lg"
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend md:text-lg">
            Is Virtual<span className="text-red-500">*</span>
          </legend>
          <input
            type="checkbox"
            value={state.location.isVirtual}
            onChange={() => {
              const toggleValue = !state.location.isVirtual;
              setState({
                ...state,
                location: {
                  link: '',
                  city: '',
                  address: '',
                  isVirtual: toggleValue,
                },
              });
            }}
            className="checkbox"
            required
          />
        </fieldset>
        {state.location.isVirtual && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend md:text-lg">
              Virtual Workshop URL<span className="text-red-500">*</span>
            </legend>
            <input
              type="url"
              className="input-md border-2 p-2 border-primary lg:input-lg"
              required
              placeholder="https://example.com"
              value={state.location.link}
              onChange={(e) => {
                setState({
                  ...state,
                  location: {
                    ...state.location,
                    link: e.target.value,
                  },
                });
              }}
            />
          </fieldset>
        )}
        {!state.location.isVirtual && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend md:text-lg">
              Physical Workshop City<span className="text-red-500">*</span>
            </legend>
            <input
              type="text"
              className="input-md border-2 p-2 border-primary lg:input-lg"
              required
              placeholder="Delhi, Mumbai, Chennai"
              value={state.location.city}
              onChange={(e) => {
                setState({
                  ...state,
                  location: {
                    ...state.location,
                    city: e.target.value,
                  },
                });
              }}
            />
            <legend className="fieldset-legend md:text-lg">
              Physical Workshop Address<span className="text-red-500">*</span>
            </legend>
            <input
              type="text"
              className="input-md border-2 p-2 border-primary lg:input-lg"
              required
              placeholder="Provide a Valid Address"
              value={state.location.address}
              onChange={(e) => {
                setState({
                  ...state,
                  location: {
                    ...state.location,
                    address: e.target.value,
                  },
                });
              }}
            />
          </fieldset>
        )}
        <fieldset className="fieldset">
          <legend className="fieldset-legend md:text-lg">Capacity</legend>
          <input
            type="number"
            className="input-md border-2 p-2 border-primary lg:input-lg"
            max={1000}
            min={1}
            value={state.capacity}
            onChange={(e) =>
              handleChange('capacity', parseInt(e.target.value, 10))
            }
          />
        </fieldset>
        <fieldset className="fieldset bg-base-200 p-2 rounded-lg">
          <legend className="fieldset-legend md:text-lg">
            Workshop Material Resource Name
          </legend>
          <input
            type="text"
            className="input-md border-2 p-2 border-primary lg:input-lg"
            placeholder="optional material name"
            id="materialName"
          />
          <input
            type="url"
            className="input-md border-2 p-2 border-primary lg:input-lg"
            placeholder="https://samplepdf.com"
            id="materialUrl"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              // create a new field below
              const materialName = document
                .getElementById('materialName')
                .value.trim();
              const materialUrl = document
                .getElementById('materialUrl')
                .value.trim();
              if (materialName.length > 0 && materialUrl.length > 0) {
                const material = [materialName, materialUrl];
                setState({
                  ...state,
                  materials: [...state.materials, material],
                });
              }
            }}
            className="btn"
          >
            + Add Material
          </button>
          <ul>
            {state.materials.map((item, index) => {
              return (
                <li key={index} className="bg-primary mt-1 text-md">
                  <p>{item[0]}</p>
                  <p>{item[1]}</p>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <button
          className="btn my-4 btn-accent btn-wide min-w-full"
          type="submit"
          onClick={handleSubmit}
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default CreateWorkshop;
