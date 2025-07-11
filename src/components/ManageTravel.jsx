import { useEffect, useState } from 'react';
import axios from 'axios';
import { dtFormat } from '../utils/constants';
import { useNavigate } from 'react-router';
import ToAdmin from './navigators/ToAdmin';

const ManageTravel = () => {
  const navigate = useNavigate();
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([]);
  const [pendingCount, setPendingCount] = useState([]);

  const getDate = (date) => {
    return dtFormat.format(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(
          'http://localhost:3000/api/workshop/upcoming',
          {
            withCredentials: true,
          }
        );
        setUpcomingWorkshops(data.data.upcomingWorkshops);
        setPendingCount(data.data.pendingCount);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      }
    };
    fetchData();
  }, []);

  const handlePendingRequests = (workshopId) => {
    navigate('/workshop/pending/' + workshopId);
  };

  const handleDeleteWorkshop = async (workshopId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this workshop? This action cannot be undone and will remove all associated join requests.'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/workshop/delete/${workshopId}`,
        {
          withCredentials: true,
        }
      );

      const newWorkshops = upcomingWorkshops.filter(
        (workshop) => workshop._id !== workshopId
      );
      const newCounts = pendingCount.filter(
        (_, index) => upcomingWorkshops[index]._id !== workshopId
      );

      setUpcomingWorkshops(newWorkshops);
      setPendingCount(newCounts);

      alert('Workshop deleted successfully!');
    } catch (err) {
      console.error('Error deleting workshop:', err);
      alert('Failed to delete workshop.');
    }
  };

  if (upcomingWorkshops.length === 0) {
    return <div className="m-10 text-center">No Upcoming Workshops</div>;
  }

  return (
    <div className="m-10">
      <ToAdmin />
      <h1 className="text-lg text-center my-4 mb-10 font-bold">
        Manage Upcoming Workshops
      </h1>
      <div className="overflow-x-auto">
        <table className="table table-xs md:table-md">
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Workshop Name</th>
              <th>Start Date</th>
              <th>Pending Requests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {upcomingWorkshops.map((workshop, index) => (
              <tr key={workshop._id}>
                <th>{index + 1}</th>
                <td>{workshop.title || 'Unnamed Workshop'}</td>
                <td>{getDate(new Date(workshop.startDate))}</td>
                <td>{pendingCount[index] || 0}</td>
                <td>
                  <div className="dropdown dropdown-left dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-sm m-1">
                      Actions ⬅️
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content dropdown-left dropdown-end menu bg-base-100 rounded-box z-[10] w-52 p-2 shadow-sm"
                    >
                      <li>
                        <a onClick={() => handlePendingRequests(workshop._id)}>
                          📥 Handle Requests
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-red-500"
                          onClick={() => handleDeleteWorkshop(workshop._id)}
                        >
                          ❌ Delete Workshop
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTravel;
