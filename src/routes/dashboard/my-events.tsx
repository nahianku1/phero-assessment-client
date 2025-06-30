import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Calendar, User, MapPin, Users } from 'lucide-react';
import { redirect, createFileRoute } from '@tanstack/react-router';
import { isWithinInterval, startOfDay } from 'date-fns';
import { isLoggedIn } from '@/utils/isLoggedIn';

// Mock data (replace with API fetch from Add Event page)
interface Event {
  id: string;
  title: string;
  postedBy: string;
  dateTime: string;
  location: string;
  description: string;
  attendeeCount: number;
}

const initialEvents: Event[] = [
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
];

const truncateDescription = (text: string, wordLimit: number = 10) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const MyEvent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [now] = useState(new Date('2025-06-30T20:34:00+06:00')); // June 30, 2025, 08:34 PM +06

  // Fetch events (mock for now)
  useEffect(() => {
    const sortedEvents = initialEvents.sort((a, b) => {
      const dateA = new Date(a.dateTime);
      const dateB = new Date(b.dateTime);
      return dateB.getTime() - dateA.getTime(); // Descending order
    });
    setEvents(sortedEvents);
  }, []);

  // Update event
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const formData = new FormData(e.currentTarget);
    const updatedEvent = {
      ...selectedEvent,
      title: formData.get('title') as string,
      dateTime: formData.get('dateTime') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
    };

    try {
      // Mock API call to update event
      // await fetch(`http://localhost:3000/events/${selectedEvent.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedEvent),
      //   credentials: 'include',
      // });

      setEvents((prev) =>
        prev.map((event) => (event.id === selectedEvent.id ? updatedEvent : event))
      );
      setSelectedEvent(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // Delete event
  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // Mock API call to delete event
        // await fetch(`http://localhost:3000/events/${eventId}`, {
        //   method: 'DELETE',
        //   credentials: 'include',
        // });

        setEvents((prev) => prev.filter((event) => event.id !== eventId));
        setIsDeleteConfirmOpen(false);
        setEventToDelete(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p className="text-gray-600 col-span-full">No events found.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-4 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {event.postedBy}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.dateTime).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </p>
                <p
                  className="text-gray-600 line-clamp-2"
                  title={event.description} // Tooltip for full description
                >
                  {truncateDescription(event.description)}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendeeCount} Attendees
                </p>
              </div>
              <div className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Pencil className="w-4 h-4" />
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/80 backdrop-blur-sm rounded-xl">
                    <DialogHeader>
                      <DialogTitle>Update Event</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <Input
                          name="title"
                          defaultValue={selectedEvent.title}
                          placeholder="Event Title"
                          className="w-full"
                        />
                        <Input
                          name="dateTime"
                          type="datetime-local"
                          defaultValue={selectedEvent.dateTime.replace(' ', 'T')}
                          className="w-full"
                        />
                        <Input
                          name="location"
                          defaultValue={selectedEvent.location}
                          placeholder="Location"
                          className="w-full"
                        />
                        <Input
                          name="description"
                          defaultValue={selectedEvent.description}
                          placeholder="Description"
                          className="w-full"
                        />
                        <DialogFooter>
                          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setEventToDelete(event.id);
                    setIsDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
              {isDeleteConfirmOpen && eventToDelete === event.id && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 space-y-4 w-full max-w-md">
                    <p className="text-gray-700">Are you sure you want to delete this event?</p>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="text-gray-600"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                        className="text-white"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyEvent;

export const Route = createFileRoute('/dashboard/my-events')({
  component: MyEvent,
    beforeLoad:async () => {
    const res = await isLoggedIn();
    if (!res) {
      throw redirect({
        to: "/login",
      });
    }
  }
})