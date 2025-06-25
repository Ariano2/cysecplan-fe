import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { base_url } from './../utils/constants';
import JoinWorkshopForm from './JoinWorkshopForm';
import { useNavigate } from 'react-router';

const JoinWorkshop = () => {
  const { id: workshopId } = useParams();
  const [workshopDetails, setWorkshopDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchWorkshopDetails = async (workshopId) => {
    try {
      const response = await axios.get(
        base_url + '/api/workshop/details/' + workshopId
      );
      setWorkshopDetails(response.data.workshop);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workshopId) {
      fetchWorkshopDetails(workshopId);
    }
  }, [workshopId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!workshopDetails) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No workshop details found.
      </div>
    );
  }

  return (
    <div>
      <div className="card bg-base-200 w-96 shadow-sm mx-auto my-10">
        <button
          className="btn btn-outline m-4"
          onClick={() => navigate('/participant')}
        >
          Back to Dashboard
        </button>
        <div className="card-body">
          <h2 className="card-title text-lg font-bold mb-2">
            Workshop Details
          </h2>
          <p>
            <span className="font-semibold">Title:</span>{' '}
            {workshopDetails.title}
          </p>
          {workshopDetails.description && (
            <p>
              <span className="font-semibold">Description:</span>{' '}
              {workshopDetails.description}
            </p>
          )}
          <p>
            <span className="font-semibold">Date:</span>{' '}
            {new Date(workshopDetails.startDate).toLocaleDateString()} -{' '}
            {new Date(workshopDetails.endDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Location:</span>
            {workshopDetails.location.isVirtual
              ? ' Virtual'
              : ` ${workshopDetails.location.address}, ${workshopDetails.location.city}`}
          </p>
          <p>
            <span className="font-semibold">Capacity:</span>{' '}
            {workshopDetails.capacity} participants
          </p>
          <p>
            <span className="font-semibold">Registration Deadline:</span>{' '}
            {new Date(
              workshopDetails.registrationDeadline
            ).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Price:</span>{' '}
            {workshopDetails.price === 0 ? 'Free' : `${workshopDetails.price}`}
          </p>
          {workshopDetails.category && (
            <p>
              <span className="font-semibold">Category:</span>{' '}
              {workshopDetails.category}
            </p>
          )}
          {workshopDetails.materials &&
            workshopDetails.materials.length > 0 && (
              <div>
                <span className="font-semibold">Materials:</span>
                <ul className="list-disc list-inside">
                  {workshopDetails.materials.map((material, idx) => (
                    <li key={idx}>{material}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
      <JoinWorkshopForm workShopId={workshopId} />
    </div>
  );
};

export default JoinWorkshop;
