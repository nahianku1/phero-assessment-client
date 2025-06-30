import { createFileRoute } from "@tanstack/react-router"
import React from "react";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Calendar, Users, Clock } from "lucide-react"; // Icons for cards

// Mock data for Your Events
interface Event {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  attendeeCount: number;
}

const yourEvents: Event[] = [
  {
    id: "1",
    title: "Tech Meetup",
    dateTime: "2025-07-10 18:00",
    location: "Tech Hub, NYC",
    attendeeCount: 50,
  },
  {
    id: "2",
    title: "Music Festival",
    dateTime: "2025-07-15 14:00",
    location: "Central Park",
    attendeeCount: 200,
  },
  {
    id: "3",
    title: "AI Workshop",
    dateTime: "2025-07-20 10:00",
    location: "Online",
    attendeeCount: 75,
  },
];

// Mock data for Upcoming Events
const upcomingEvents: Event[] = [
  {
    id: "4",
    title: "Startup Pitch Night",
    dateTime: "2025-07-05 19:00",
    location: "Innovation Center, SF",
    attendeeCount: 30,
  },
  {
    id: "5",
    title: "Charity Run",
    dateTime: "2025-07-08 08:00",
    location: "Golden Gate Park",
    attendeeCount: 150,
  },
];

const Home: React.FC = () => {
  // Mock data for metric cards
  const eventsCount = 120;
  const eventsJoined = 45;
  const upcomingEventsCount = 8;

  // Handlers for Update and Delete (placeholder)
  const handleUpdate = (id: string) => {
    console.log(`Update event with ID: ${id}`);
    // Add update logic here (e.g., navigate to update page)
  };

  const handleDelete = (id: string) => {
    console.log(`Delete event with ID: ${id}`);
    // Add delete logic here (e.g., API call)
  };

  return (
    <div className="space-y-8 px-3">
      {/* Metric Cards Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Events Count Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition-transform duration-300">
            <Calendar className="w-10 h-10" />
            <div>
              <h3 className="text-lg font-semibold">Total Events</h3>
              <p className="text-3xl font-bold">{eventsCount}</p>
            </div>
          </div>
          {/* Total Events Joined Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition-transform duration-300">
            <Users className="w-10 h-10" />
            <div>
              <h3 className="text-lg font-semibold">Events Joined</h3>
              <p className="text-3xl font-bold">{eventsJoined}</p>
            </div>
          </div>
          {/* Upcoming Events Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition-transform duration-300">
            <Clock className="w-10 h-10" />
            <div>
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <p className="text-3xl font-bold">{upcomingEventsCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Events Section */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Top Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yourEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-4 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {event.title}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.dateTime}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendeeCount} Attendees
                </p>
                <p className="text-gray-600">{event.location}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdate(event.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Update
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-4 hover:shadow-xl transition-shadow duration-300 border border-purple-300"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {event.title}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.dateTime}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendeeCount} Attendees
                </p>
                <p className="text-gray-600">{event.location}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdate(event.id)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  Update
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;


export const Route = createFileRoute("/dashboard/")({
  component: Home,
});
