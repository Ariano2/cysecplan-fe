const JoinRequestsTab = ({ joinRequests }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">Workshop Join Requests</h2>
        {joinRequests.length === 0 ? (
          <p className="text-gray-500">No join requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Workshop ID</th>
                  <th>Status</th>
                  <th>Origin City</th>
                  <th>Travel Mode</th>
                  <th>Preferred Date</th>
                  <th>Accommodation</th>
                  <th>Remarks</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {joinRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.workshopId}</td>
                    <td>
                      <span
                        className={`badge ${
                          request.status === 'pending'
                            ? 'badge-warning'
                            : request.status === 'accepted'
                            ? 'badge-success'
                            : 'badge-error'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td>{request.originCity}</td>
                    <td>{request.modeOfTravel}</td>
                    <td>
                      {new Date(request.preferredDate).toLocaleDateString()}
                    </td>
                    <td>{request.accommodationRequired ? 'Yes' : 'No'}</td>
                    <td>{request.remarks || '-'}</td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRequestsTab;
