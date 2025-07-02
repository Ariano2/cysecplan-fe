import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { base_url, dtFormat } from '../utils/constants';

const PendingRequest = () => {
  const { workshopId } = useParams();
  const [requests, setRequests] = useState([]);
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [adminNotes, setAdminNotes] = useState({});
  const [filters, setFilters] = useState({
    accommodation: 'all',
    modeOfTravel: 'all',
    participantId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workshopResponse, requestsResponse] = await Promise.all([
          axios.get(`${base_url}/api/workshop/details/${workshopId}`, {
            withCredentials: true,
          }),
          axios.get(`${base_url}/api/workshop/join/request/${workshopId}`, {
            withCredentials: true,
          }),
        ]);
        setWorkshop(workshopResponse.data.workshop);
        setRequests(requestsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [workshopId]);

  const handleStatusUpdate = async (requestId, status) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      const response = await axios.patch(
        `${base_url}/api/workshop/join/request/${requestId}/${status}`,
        { adminNotes: adminNotes[requestId] || '' },
        { withCredentials: true }
      );
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? response.data.request : req))
      );
      setAdminNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[requestId];
        return newNotes;
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesAccommodation =
      filters.accommodation === 'all' ||
      (filters.accommodation === 'required' && request.accommodationRequired) ||
      (filters.accommodation === 'not-required' &&
        !request.accommodationRequired);
    const matchesModeOfTravel =
      filters.modeOfTravel === 'all' ||
      request.modeOfTravel === filters.modeOfTravel;
    const matchesParticipantId =
      filters.participantId === '' ||
      request.participantId
        .toLowerCase()
        .includes(filters.participantId.toLowerCase());
    return matchesAccommodation && matchesModeOfTravel && matchesParticipantId;
  });

  if (loading) {
    return (
      <div className="text-center mt-8">
        <span className="loading loading-spinner text-primary"></span>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error mt-8">
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Workshop Details */}
      {workshop && (
        <div className="bg-base-200 p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold mb-2">{workshop.title}</h1>
          <p className="text-base-content">
            Date: {dtFormat.format(new Date(workshop.startDate))} -{' '}
            {dtFormat.format(new Date(workshop.endDate))}
          </p>
          <p className="text-base-content">
            Location:{' '}
            {workshop.location.isVirtual
              ? `Virtual (${workshop.location.link || 'Link TBD'})`
              : `${workshop.location.address}, ${workshop.location.city}`}
          </p>
          <p className="text-base-content">
            Description: {workshop.description || 'No description provided'}
          </p>
          <p className="text-base-content">
            Capacity: {workshop.participants.length} / {workshop.capacity}
          </p>
          <p className="text-base-content">
            Price: {workshop.price === 0 ? 'Free' : `$${workshop.price}`}
          </p>
          <p className="text-base-content">
            Registration Deadline:{' '}
            {dtFormat.format(new Date(workshop.registrationDeadline))}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-base-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filter Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label label-text mb-1">Accommodation</label>
            <select
              className="select select-bordered w-full"
              value={filters.accommodation}
              onChange={(e) =>
                setFilters({ ...filters, accommodation: e.target.value })
              }
            >
              <option value="all">All</option>
              <option value="required">Required</option>
              <option value="not-required">Not Required</option>
            </select>
          </div>
          <div>
            <label className="label label-text mb-1">Mode of Travel</label>
            <select
              className="select select-bordered w-full"
              value={filters.modeOfTravel}
              onChange={(e) =>
                setFilters({ ...filters, modeOfTravel: e.target.value })
              }
            >
              <option value="all">All</option>
              <option value="flight">Flight</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
              <option value="car">Car</option>
            </select>
          </div>
          <div>
            <label className="label label-text mb-1">Participant ID</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Search by Participant ID"
              value={filters.participantId}
              onChange={(e) =>
                setFilters({ ...filters, participantId: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Requests */}
      <h2 className="text-xl font-bold mb-4">Pending Workshop Join Requests</h2>
      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <p className="text-base-content opacity-70">No matching requests</p>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-base-300 p-4 rounded-lg shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="font-semibold text-primary-content">
                    Participant ID: {request.participantId}
                  </p>
                  <p className="text-base-content font-medium">
                    Status: {request.status}
                  </p>
                  <p className="text-base-content">
                    Origin City: {request.originCity}
                  </p>
                  <p className="text-base-content">
                    Mode of Travel: {request.modeOfTravel}
                  </p>
                  <p className="text-base-content">
                    Preferred Date:{' '}
                    {new Date(request.preferredDate).toLocaleDateString()}
                  </p>
                  <p className="text-base-content">
                    Accommodation:{' '}
                    {request.accommodationRequired
                      ? 'Required'
                      : 'Not Required'}
                  </p>
                  {request.remarks && (
                    <p className="text-base-content">
                      Remarks: {request.remarks}
                    </p>
                  )}
                  {request.adminNotes && (
                    <p className="text-base-content">
                      Admin Notes: {request.adminNotes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <textarea
                    className="textarea textarea-bordered w-full sm:w-48"
                    placeholder="Add admin notes"
                    value={adminNotes[request._id] || ''}
                    onChange={(e) =>
                      setAdminNotes({
                        ...adminNotes,
                        [request._id]: e.target.value,
                      })
                    }
                    disabled={
                      request.status !== 'pending' || actionLoading[request._id]
                    }
                  />
                  <button
                    className="btn btn-success w-full sm:w-auto"
                    onClick={() => handleStatusUpdate(request._id, 'accepted')}
                    disabled={
                      request.status !== 'pending' || actionLoading[request._id]
                    }
                  >
                    {actionLoading[request._id] &&
                    request.status === 'pending' ? (
                      <span className="loading loading-spinner text-white"></span>
                    ) : (
                      'Accept'
                    )}
                  </button>
                  <button
                    className="btn btn-error w-full sm:w-auto"
                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                    disabled={
                      request.status !== 'pending' || actionLoading[request._id]
                    }
                  >
                    {actionLoading[request._id] &&
                    request.status === 'pending' ? (
                      <span className="loading loading-spinner text-white"></span>
                    ) : (
                      'Reject'
                    )}
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
