import { createFileRoute,  useRouteContext } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Calendar, Users, Clock } from "lucide-react"; // Icons for cards

// Interface for Event
interface Event {
  _id: string;
  eventTitle: string;
  name: string;
  dateAndTime: string;
  location: string;
  description: string;
  attendeeCount: number;
  userEmail: string;
  joins: string[];
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user }: { user: Record<string, unknown> } = useRouteContext({
    from: "/_dashboard",
  });

  // Mock data for non-logged-in users
  const mockEvents: Event[] = [
    {
      _id: "1",
      eventTitle: "Mock Tech Conference",
      name: "John Doe",
      dateAndTime: "2025-07-02T10:00:00+06:00",
      location: "Online",
      description: "A great tech event with workshops.",
      attendeeCount: 150,
      userEmail: "john@example.com",
      joins: [],
    },
    {
      _id: "2",
      eventTitle: "Mock Music Festival",
      name: "Jane Smith",
      dateAndTime: "2025-07-03T14:00:00+06:00",
      location: "City Park",
      description: "Enjoy live music and food stalls.",
      attendeeCount: 200,
      userEmail: "jane@example.com",
      joins: [],
    },
    {
      _id: "3",
      eventTitle: "Mock Coding Bootcamp",
      name: "Alex Brown",
      dateAndTime: "2025-07-04T09:00:00+06:00",
      location: "Tech Hub",
      description: "Learn coding skills in a day.",
      attendeeCount: 100,
      userEmail: "alex@example.com",
      joins: [],
    },
  ];

  // Fetch events from API or use mock data
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        if (user?.email) {
          // Logged-in user, fetch from API
          const response = await fetch(
            "https://event-manager-dun.vercel.app/events/all-events",
            {
              credentials: "include",
            }
          );
          if (!response.ok) throw new Error("Failed to fetch events");
          const { data } = await response.json();
          setEvents(data);
        } else {
          // Not logged in, use mock data
          setEvents(mockEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setEvents(user?.email ? [] : mockEvents); // Use mock data on error if not logged in
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user?.email]);

  // Calculate Top Events (top 3 by attendeeCount)
  const topEvents = [...events]
    .sort((a, b) => b.attendeeCount - a.attendeeCount)
    .slice(0, 3);

  // Calculate Upcoming Events (future dateTime)
  const now = new Date("2025-07-01T14:47:00+06:00"); // Current date and time
  const upcomingEvents = [...events]
    .filter((event) => new Date(event.dateAndTime) > now)
    .sort(
      (a, b) =>
        new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime()
    )
    .slice(0, 3);

  // Calculate metrics
  const eventsCount = events.length;
  const currentUserEmail = user?.email as string | undefined; // Get current user's email
  const eventsJoined = events.filter(
    (event) => currentUserEmail && event.joins.includes(currentUserEmail)
  ).length; // Count events where user's email is in joins array
  const upcomingEventsCount = [...events]
    .filter((event) => new Date(event.dateAndTime) > now)
    .sort(
      (a, b) =>
        new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime()
    ).length;

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

      {/* Top Events Section */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Top Events
        </h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : topEvents.length === 0 ? (
          <div className="text-center text-gray-600">No top events found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-6 space-y-4 hover:bg-gradient-to-br from-white/95 to-gray-100"
              >
                <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Top Event
                </span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {event.eventTitle}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.dateAndTime}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendeeCount} Attendees
                  </p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Upcoming Events
        </h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center text-gray-600">
            No upcoming events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-purple-300 p-6 space-y-4 hover:bg-gradient-to-br from-white/95 to-gray-100"
              >
                <span className="inline-block bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Upcoming
                </span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {event.eventTitle}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.dateAndTime}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendeeCount} Attendees
                  </p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

export const Route = createFileRoute("/_dashboard/")({
  component: Home,
 
});
