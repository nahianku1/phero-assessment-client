import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Trash2,
  Calendar,
  User,
  MapPin,
  Users,
  FileText,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

// Interface for Event
interface Event {
  _id: string;
  eventTitle: string;
  name: string;
  dateAndTime: string;
  location: string;
  description: string;
  attendeeCount: number;
}

const MyEvent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    eventTitle: "",
    name: "",
    dateTime: "",
    location: "",
    description: "",
    attendeeCount: 0,
  });

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://event-manager-dun.vercel.app/events/my-events",
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch events");
        const { data } = await response.json();
        const sortedEvents = data.sort((a: Event, b: Event) => {
          const dateA = new Date(a.dateAndTime);
          const dateB = new Date(b.dateAndTime);
          return dateB.getTime() - dateA.getTime(); // Descending order
        });
        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Update form data when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        eventTitle: selectedEvent.eventTitle,
        name: selectedEvent.name,
        dateTime: new Date(selectedEvent.dateAndTime)
          .toISOString()
          .slice(0, 16), // Format for datetime-local
        location: selectedEvent.location,
        description: selectedEvent.description,
        attendeeCount: selectedEvent.attendeeCount,
      });
    } else {
      setFormData({
        eventTitle: "",
        name: "",
        dateTime: "",
        location: "",
        description: "",
        attendeeCount: 0,
      });
    }
  }, [selectedEvent]);

  // Update event
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const updatedEvent = {
      _id: selectedEvent._id,
      eventTitle: formData.eventTitle,
      name: formData.name,
      dateAndTime: formData.dateTime,
      location: formData.location,
      description: formData.description,
      attendeeCount: formData.attendeeCount,
    };

    try {
      const response = await fetch(
        `https://event-manager-dun.vercel.app/events/update-event/${selectedEvent._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to update event");
      setEvents((prev) =>
        prev.map((event) =>
          event._id === selectedEvent._id ? updatedEvent : event
        )
      );
      setSelectedEvent(null); // Clear selected event to close modal
    } catch (error) {
      console.error("Update failed:", error);
      setError("Failed to update event. Please try again.");
    }
  };

  // Delete event
  const handleDelete = async (eventId: string) => {
    try {
      const response = await fetch(
        `https://event-manager-dun.vercel.app/events/delete-event/${eventId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete event");
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
      setIsDeleteConfirmOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete event. Please try again.");
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "attendeeCount" ? parseInt(value) || 0 : value,
    }));
  };

  // Truncate description function
  const truncateDescription = (text: string, wordLimit: number = 10) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto min-h-screen flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Events</h2>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-600">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-600">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl border border-gray-200 flex flex-col"
            >
              <div className="flex-1 overflow-y-auto pr-2 max-h-64">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {event.eventTitle}
                </h3>
                <div className="text-sm text-gray-600 mb-1">
                  Posted by: {event.name}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {new Date(event.dateAndTime).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
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
                  {selectedEvent && selectedEvent._id === event._id && (
                    <DialogContent className="bg-white/80 backdrop-blur-sm rounded-lg p-6 max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Update Event</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Pencil className="w-4 h-4 text-gray-500" />
                          <label
                            htmlFor="eventTitle"
                            className="text-sm font-medium text-gray-700"
                          >
                            Event Title
                          </label>
                        </div>
                        <Input
                          id="eventTitle"
                          name="eventTitle"
                          value={formData.eventTitle}
                          onChange={handleInputChange}
                          placeholder="Event Title"
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                        </div>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Name"
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <label
                            htmlFor="dateTime"
                            className="text-sm font-medium text-gray-700"
                          >
                            Date and Time
                          </label>
                        </div>
                        <Input
                          id="dateTime"
                          name="dateTime"
                          type="datetime-local"
                          value={formData.dateTime}
                          onChange={handleInputChange}
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <label
                            htmlFor="location"
                            className="text-sm font-medium text-gray-700"
                          >
                            Location
                          </label>
                        </div>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Location"
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label
                            htmlFor="description"
                            className="text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                        </div>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Description"
                          className="w-full h-24 mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <label
                            htmlFor="attendeeCount"
                            className="text-sm font-medium text-gray-700"
                          >
                            Attendee Count
                          </label>
                        </div>
                        <Input
                          id="attendeeCount"
                          name="attendeeCount"
                          type="number"
                          value={formData.attendeeCount}
                          onChange={handleInputChange}
                          placeholder="Attendee Count"
                          className="w-full mb-4 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <DialogFooter>
                          <Button
                            type="submit"
                            className="bg-green-400 hover:bg-green-500 text-white"
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  )}
                </Dialog>
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-700"
                  onClick={() => {
                    setEventToDelete(event._id);
                    setIsDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isDeleteConfirmOpen && eventToDelete && (
        <Dialog
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
        >
          <DialogContent className="bg-white/80 backdrop-blur-sm rounded-xl">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-gray-700">
              Are you sure you want to delete this event?
            </p>
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

export const Route = createFileRoute("/_dashboard/my-events")({
  component: MyEvent,

});
