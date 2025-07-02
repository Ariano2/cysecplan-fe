import { useState } from 'react';
import { INDIAN_CITIES } from '../utils/constants';
import { dtFormat } from '../utils/constants';

const WorkshopsTab = ({ workshops, joinWorkshop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterType, setFilterType] = useState('');

  const isRegistrationOpen = (registrationDeadline) => {
    return new Date(registrationDeadline) >= new Date();
  };

  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workshop.description?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      );

    const matchesCity = filterCity
      ? workshop.location.city.toLowerCase() === filterCity.toLowerCase()
      : true;

    const matchesType =
      filterType === 'virtual'
        ? workshop.location.isVirtual
        : filterType === 'in-person'
        ? !workshop.location.isVirtual
        : true;

    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upcoming Workshops</h2>

      {/* Search + Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or description..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="input-md border-2 p-2 border-primary lg:input-lg"
          required
          value={filterCity}
          onChange={(e) => {
            setFilterCity(e.target.value);
          }}
        >
          <option value="" disabled>
            Select a city
          </option>
          {INDIAN_CITIES.map((city) => (
            <option className="bg-primary" key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="virtual">Virtual</option>
          <option value="in-person">In-Person</option>
        </select>
        <button
          onClick={() => {
            setFilterCity('');
            setSearchTerm('');
            setFilterType('');
          }}
          className="bg-primary rounded-2xl mx-auto px-4"
        >
          RESET FILTERS
        </button>
      </div>

      {/* Workshop Cards */}
      {filteredWorkshops.length === 0 ? (
        <p className="text-gray-500">No workshops match your criteria.</p>
      ) : (
        <div className="grid gap-4">
          {filteredWorkshops.map((workshop) => (
            <div
              key={workshop._id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-base-200"
            >
              <h3 className="text-lg font-semibold">{workshop.title}</h3>
              <p className="text-gray-600">
                <span className="font-medium">Date:</span>{' '}
                {dtFormat.format(new Date(workshop.startDate))} -{' '}
                {dtFormat.format(new Date(workshop.endDate))}
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
