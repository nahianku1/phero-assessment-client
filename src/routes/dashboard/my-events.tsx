import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Calendar, User, MapPin, Users, FileText } from 'lucide-react';
import { redirect, createFileRoute } from '@tanstack/react-router';
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

const MyEvent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

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
      postedBy: formData.get('postedBy') as string,
      dateTime: formData.get('dateTime') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      attendeeCount: parseInt(formData.get('attendeeCount') as string) || selectedEvent.attendeeCount,
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

  // Truncate description function
  const truncateDescription = (text: string, wordLimit: number = 10) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="text-center text-gray-600">No events found.</div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl border border-gray-200 flex flex-col"
            >
              <div className="flex-1 overflow-y-auto pr-2 max-h-64">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <div className="text-sm text-gray-600 mb-1">
                  Posted by: {event.postedBy}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {new Date(event.dateTime).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Location: {event.location}
                </div>
                <div className="text-sm text-gray-600 mb-2 max-w-xs">
                  <span className="line-clamp-2" title={event.description}>
                    {truncateDescription(event.description)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Attendee Count: {event.attendeeCount}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="flex items-center gap-2 bg-green-400 hover:bg-green-500 text-white"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Pencil className="w-4 h-4" />
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/80 backdrop-blur-sm rounded-lg p-6 max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Update Event</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && selectedEvent.id === event.id && (
                      <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Pencil className="w-4 h-4 text-gray-500" />
                          <label htmlFor="title" className="text-sm font-medium text-gray-700">
                            Event Title
                          </label>
                        </div>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={selectedEvent.title}
                          placeholder="Event Title"
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <label htmlFor="postedBy" className="text-sm font-medium text-gray-700">
                            Name
                          </label>
                        </div>
                        <Input
                          id="postedBy"
                          name="postedBy"
                          defaultValue={selectedEvent.postedBy}
                          placeholder="Name"
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <label htmlFor="dateTime" className="text-sm font-medium text-gray-700">
                            Date and Time
                          </label>
                        </div>
                        <Input
                          id="dateTime"
                          name="dateTime"
                          type="datetime-local"
                          defaultValue={selectedEvent.dateTime.replace(' ', 'T')}
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <label htmlFor="location" className="text-sm font-medium text-gray-700">
                            Location
                          </label>
                        </div>
                        <Input
                          id="location"
                          name="location"
                          defaultValue={selectedEvent.location}
                          placeholder="Location"
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description
                          </label>
                        </div>
                        <Textarea
                          id="description"
                          name="description"
                          defaultValue={selectedEvent.description}
                          placeholder="Description"
                          className="w-full h-24 mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <label htmlFor="attendeeCount" className="text-sm font-medium text-gray-700">
                            Attendee Count
                          </label>
                        </div>
                        <Input
                          id="attendeeCount"
                          name="attendeeCount"
                          type="number"
                          defaultValue={selectedEvent.attendeeCount}
                          placeholder="Attendee Count"
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <DialogFooter>
                          <Button type="submit" className="bg-green-400 hover:bg-green-500 text-white">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-700"
                  onClick={() => {
                    setEventToDelete(event.id);
                    setIsDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      {isDeleteConfirmOpen && eventToDelete && (
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="bg-white/80 backdrop-blur-sm rounded-xl">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-gray-700">Are you sure you want to delete this event?</p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(eventToDelete)}
                className="text-white bg-red-500 hover:bg-red-700"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyEvent;

export const Route = createFileRoute('/dashboard/my-events')({
  component: MyEvent,
  beforeLoad: async () => {
    const res = await isLoggedIn();
    if (!res) {
      throw redirect({
        to: "/login",
      });
    }
  }
});