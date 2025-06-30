import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { redirect } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ChevronDown, X, Filter, Search } from 'lucide-react';
import { isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, startOfDay } from 'date-fns';

// Mock data (replace with API fetch)
interface Event {
  id: string;
  title: string;
  postedBy: string;
  dateTime: string;
  location: string;
  description: string;
  attendeeCount: number;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Meetup',
    postedBy: 'John Doe',
    dateTime: '2025-07-10T18:00:00',
    location: 'Tech Hub, NYC',
    description: 'A networking event for tech enthusiasts to collaborate and share innovative ideas and projects.',
    attendeeCount: 50,
  },
  {
    id: '2',
    title: 'Music Festival',
    postedBy: 'Jane Smith',
    dateTime: '2025-07-10T14:00:00',
    location: 'Central Park',
    description: 'Annual music festival with live bands performing a variety of genres for all attendees.',
    attendeeCount: 200,
  },
  {
    id: '3',
    title: 'AI Workshop',
    postedBy: 'Alice Johnson',
    dateTime: '2025-07-05T10:00:00',
    location: 'Online',
    description: 'Learn about AI advancements and applications in a hands-on workshop for beginners and experts.',
    attendeeCount: 75,
  },
];

interface JoinState {
  eventId: string;
  error: string | null;
  success: boolean;
}

const truncateDescription = (text: string, wordLimit: number = 10) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'currentWeek' | 'lastWeek' | 'currentMonth' | 'lastMonth'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events (mock for now)
  useEffect(() => {
    const sortedEvents = mockEvents.sort((a, b) => {
      const dateA = new Date(a.dateTime);
      const dateB = new Date(b.dateTime);
      return dateB.getTime() - dateA.getTime(); // Descending order
    });
    setEvents(sortedEvents);
    setJoinedEvents(JSON.parse(localStorage.getItem('joinedEvents') || '[]'));
  }, []);

  // Join event action
  const joinAction = async (_prevState: JoinState, formData: FormData): Promise<JoinState> => {
    const eventId = formData.get('eventId') as string;
    if (joinedEvents.includes(eventId)) {
      return { eventId, error: 'You have already joined this event.', success: false };
    }
    try {
      const response = await fetch(`http://localhost:3000/events/join/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId ? { ...event, attendeeCount: event.attendeeCount + 1 } : event
          )
        );
        setJoinedEvents((prev) => {
          const updated = [...prev, eventId];
          localStorage.setItem('joinedEvents', JSON.stringify(updated));
          return updated;
        });
        return { eventId, error: null, success: true };
      } else {
        const errorData = await response.json();
        return { eventId, error: errorData.message || 'Failed to join event.', success: false };
      }
    } catch (error) {
      return { eventId, error: 'An error occurred while joining the event.', success: false };
    }
  };

  const [joinState, joinActionFn] = useActionState(joinAction, { eventId: '', error: null, success: false });

  // Handle filter change
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilter('all');
    setSelectedDate('');
    setShowFilters(false);
  };

  // Filter events
  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((event) => {
      const eventDate = new Date(event.dateTime);
      const now = new Date('2025-06-30T20:25:00+06:00'); // June 30, 2025, 08:25 PM +06
      if (selectedDate) {
        const selectedDayStart = startOfDay(new Date(selectedDate));
        return isWithinInterval(eventDate, { start: selectedDayStart, end: now });
      }
      switch (filter) {
        case 'currentWeek':
          return isWithinInterval(eventDate, { start: startOfWeek(now), end: now });
        case 'lastWeek':
          return isWithinInterval(eventDate, { start: startOfWeek(subWeeks(now, 1)), end: endOfWeek(subWeeks(now, 1)) });
        case 'currentMonth':
          return isWithinInterval(eventDate, { start: startOfMonth(now), end: now });
        case 'lastMonth':
          return isWithinInterval(eventDate, { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) });
        default:
          return true;
      }
    });

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Search Events
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events by title..."
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleFilterChange(setSelectedDate)(e.target.value)}
                max={new Date('2025-06-30').toISOString().split('T')[0]} // Limit to current date
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date Range
              </label>
              <select
                value={filter}
                onChange={(e) => handleFilterChange(setFilter)(e.target.value as 'all' | 'currentWeek' | 'lastWeek' | 'currentMonth' | 'lastMonth')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="currentWeek">Current Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="currentMonth">Current Month</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Events Section */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Event Title</th>
                <th className="p-3 text-left">Posted By</th>
                <th className="p-3 text-left">Date and Time</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Attendee Count</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-600">
                    No events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{event.title}</td>
                    <td className="p-3">{event.postedBy}</td>
                    <td className="p-3">
                      {new Date(event.dateTime).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="p-3">{event.location}</td>
                    <td className="p-3 max-w-xs">
                      <span className="line-clamp-2" title={event.description}>
                        {truncateDescription(event.description)}
                      </span>
                    </td>
                    <td className="p-3">{event.attendeeCount}</td>
                    <td className="p-3">
                      <form action={joinActionFn}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <Button
                          type="submit"
                          size="sm"
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                          disabled={joinedEvents.includes(event.id) || joinState.eventId === event.id && joinState.error}
                        >
                          {joinedEvents.includes(event.id) ? 'Joined' : 'Join Event'}
                        </Button>
                      </form>
                      {joinState.eventId === event.id && joinState.error && (
                        <p className="text-red-500 text-sm mt-2">{joinState.error}</p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Events;

import { createFileRoute } from "@tanstack/react-router"
import { isLoggedIn } from '@/utils/isLoggedIn';

export const Route = createFileRoute("/dashboard/events")({
  component: Events,
  beforeLoad:async () => {
    const res = await isLoggedIn();
    if (!res) {
      throw redirect({
        to: "/login",
      });
    }
  }
});
