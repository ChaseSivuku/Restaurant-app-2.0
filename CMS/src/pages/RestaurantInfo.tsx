import { useState } from 'react';

const RestaurantInfo = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Ntally Foods',
    description: 'Delicious food for everyone',
    address: '123 Restaurant Street, City',
    phone: '+27 12 345 6789',
    email: 'info@ntallyfoods.com',
    openingHours: {
      monday: '09:00 - 22:00',
      tuesday: '09:00 - 22:00',
      wednesday: '09:00 - 22:00',
      thursday: '09:00 - 22:00',
      friday: '09:00 - 23:00',
      saturday: '10:00 - 23:00',
      sunday: '10:00 - 22:00',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with actual API call
    console.log('Updating restaurant info:', restaurantInfo);
    alert('Restaurant information updated successfully!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Restaurant Information</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              value={restaurantInfo.name}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={restaurantInfo.description}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={restaurantInfo.address}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={restaurantInfo.phone}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={restaurantInfo.email}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Opening Hours
            </label>
            <div className="space-y-3">
              {Object.entries(restaurantInfo.openingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center">
                  <label className="w-32 text-sm text-gray-700 capitalize">
                    {day}:
                  </label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) =>
                      setRestaurantInfo({
                        ...restaurantInfo,
                        openingHours: {
                          ...restaurantInfo.openingHours,
                          [day]: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold transition-colors"
            >
              Update Restaurant Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantInfo;

