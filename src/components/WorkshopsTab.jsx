const WorkshopsTab = ({ workshops, joinWorkshop }) => {
  const isRegistrationOpen = (registrationDeadline) => {
    return new Date(registrationDeadline) >= new Date();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upcoming Workshops</h2>
      {workshops.length === 0 ? (
        <p className="text-gray-500">No upcoming workshops available.</p>
      ) : (
        <div className="grid gap-4">
          {workshops.map((workshop) => (
            <div
              key={workshop._id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-base-200"
            >
              <h3 className="text-lg font-semibold">{workshop.title}</h3>
              <p className="text-gray-600">
                <span className="font-medium">Date:</span>{' '}
                {new Date(workshop.startDate).toLocaleDateString()} -{' '}
                {new Date(workshop.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Location:</span>{' '}
                {workshop.location.isVirtual
                  ? 'Virtual'
                  : `${workshop.location.address}, ${workshop.location.city}`}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Capacity:</span>{' '}
                {workshop.capacity} participants
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Registration Deadline:</span>{' '}
                {new Date(workshop.registrationDeadline).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Price:</span>{' '}
                {workshop.price === 0 ? 'Free' : `${workshop.price}`}
              </p>
              <button
                className={`mt-2 btn btn-primary w-full ${
                  !isRegistrationOpen(workshop.registrationDeadline)
                    ? 'btn-disabled'
                    : ''
                }`}
                disabled={!isRegistrationOpen(workshop.registrationDeadline)}
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to join this workshop?'
                    )
                  ) {
                    joinWorkshop(workshop._id);
                  }
                }}
              >
                {isRegistrationOpen(workshop.registrationDeadline)
                  ? 'Join Workshop'
                  : 'Registration Closed'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkshopsTab;
