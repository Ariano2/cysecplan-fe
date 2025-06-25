import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { base_url } from '../utils/constants';

const PendingRequest = () => {
  const { workshopId } = useParams();
  const [requests, setRequests] = useState([]);
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminNotes, setAdminNotes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workshopResponse = await axios.get(
          base_url + '/api/workshop/details/' + workshopId,
          { withCredentials: true }
        );
        setWorkshop(workshopResponse.data.workshop);

        const requestsResponse = await axios.get(
          base_url + '/api/workshop/join/request/' + workshopId,
          { withCredentials: true }
        );
        console.log(workshopResponse);
        setRequests(requestsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [workshopId]);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/workshop/join/request/${requestId}/${status}`,
        { adminNotes: adminNotes[requestId] || '' },
        { withCredentials: true }
      );
      setRequests(
        requests.map((req) =>
          req._id === requestId ? response.data.request : req
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Workshop Details */}
      {workshop && (
        <div className="bg-gray-200 p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl text-accent-content font-bold mb-2">
            {workshop.title}
          </h1>
          <p className="text-gray-600">
            Date: {new Date(workshop.startDate).toLocaleDateString()} -{' '}
            {new Date(workshop.endDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Location:{' '}
            {workshop.location.isVirtual
              ? `Virtual (${workshop.location.link || 'Link TBD'})`
              : `${workshop.location.address}, ${workshop.location.city}`}
          </p>
          <p className="text-gray-600">
            Description: {workshop.description || 'No description provided'}
          </p>
          <p className="text-gray-600">
            Capacity: {workshop.participants.length} / {workshop.capacity}
          </p>
          <p className="text-gray-600">
            Price: {workshop.price === 0 ? 'Free' : `$${workshop.price}`}
          </p>
          <p className="text-gray-600">
            Registration Deadline:{' '}
            {new Date(workshop.registrationDeadline).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Pending Requests */}
      <h2 className="text-xl font-bold mb-4">Pending Workshop Join Requests</h2>
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <p className="text-gray-500">No pending requests</p>
        ) : (
          requests.map((request) => (
            <div
              key={request._id}
              className="bg-neutral-400 p-4 rounded-lg shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="font-semibold text-secondary-content">
                    Participant ID: {request.participantId}
                  </p>
                  <p className="text-gray-600 font-bold">
                    Status: {request.status}
                  </p>
                  <p className="text-gray-600">
                    Origin City: {request.originCity}
                  </p>
                  <p className="text-gray-600">
                    Mode of Travel: {request.modeOfTravel}
                  </p>
                  <p className="text-gray-600">
                    Preferred Date:{' '}
                    {new Date(request.preferredDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Accommodation:{' '}
                    {request.accommodationRequired
                      ? 'Required'
                      : 'Not Required'}
                  </p>
                  {request.remarks && (
                    <p className="text-gray-600">Remarks: {request.remarks}</p>
                  )}
                  {request.adminNotes && (
                    <p className="text-gray-600">
                      Admin Notes: {request.adminNotes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    className="border rounded p-2 w-full sm:w-48"
                    placeholder="Add admin notes"
                    value={adminNotes[request._id] || ''}
                    onChange={(e) =>
                      setAdminNotes({
                        ...adminNotes,
                        [request._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
                    onClick={() => handleStatusUpdate(request._id, 'accepted')}
                    disabled={request.status !== 'pending'}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                    disabled={request.status !== 'pending'}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingRequest;
