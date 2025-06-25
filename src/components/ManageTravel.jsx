import { useEffect, useState } from 'react';
import axios from 'axios';
import { dtFormat } from '../utils/constants';
import { useNavigate } from 'react-router';
import ToAdmin from './navigators/ToAdmin';

const ManageTravel = () => {
  const navigate = useNavigate();
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

  const [upcomingWorkshops, setUpcomingWorkshops] = useState([]);
  const [pendingCount, setPendingCount] = useState([]);

  if (upcomingWorkshops.length === 0) {
    return <div className="m-10 text-center">No Upcoming Workshops</div>;
  }
  return (
    <div className="m-10">
      <ToAdmin />
      <h1 className="text-lg text-center my-4 font-bold">
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
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm"
                    >
                      <li>
                        <a onClick={() => handleEditWorkshop(workshop._id)}>
                          Edit Workshop
                        </a>
                      </li>
                      <li>
                        <a onClick={() => handlePendingRequests(workshop._id)}>
                          Handle Pending Requests
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

  function handleEditWorkshop(workshopId) {
    navigate('/workshop/edit/' + workshopId);
  }

  function handlePendingRequests(workshopId) {
    navigate('/workshop/pending/' + workshopId);
  }
};

export default ManageTravel;
