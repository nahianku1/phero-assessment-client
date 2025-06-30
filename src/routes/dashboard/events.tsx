import React, { useState, useEffect } from "react";
import { useActionState } from "react";
import { redirect, useRouteContext } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronDown, X, Filter, Search } from "lucide-react";

// Mock data (replace with API fetch)
interface Event {
  _id: string;
  eventTitle: string;
  name: string;
  dateAndTime: string;
  location: string;
  description: string;
  attendeeCount: number;
  joins: string[]; // Array of user emails who joined
}

interface JoinState {
  eventId: string;
  error: string | null;
  success: boolean;
}

const truncateDescription = (text: string, wordLimit: number = 10) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<
    "all" | "today" | "currentWeek" | "lastWeek" | "currentMonth" | "lastMonth"
  >("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useRouteContext({ from: "/dashboard/events" });

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedDate) params.append("specificDate", selectedDate);
      if (filter !== "all" && !selectedDate) {
        const dateFilterMap = {
          today: "today",
          currentWeek: "currentweek",
          lastWeek: "lastweek",
          currentMonth: "currentmonth",
          lastMonth: "lastmonth",
        };
        params.append("dateFilter", dateFilterMap[filter]);
      }

      try {
        const response = await fetch(
          `http://localhost:3000/events/all-events?${params.toString()}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Failed to fetch events");
        const { data } = await response.json();

        const sortedEvents = data.sort((a: Event, b: Event) => {
          const dateA = new Date(a.dateAndTime);
          const dateB = new Date(b.dateAndTime);
          return dateB.getTime() - dateA.getTime();
        });
        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchQuery, selectedDate, filter]);

  // Join event action
  const joinAction = async (
    _prevState: JoinState,
    formData: FormData
  ): Promise<JoinState> => {
    const eventId = formData.get("eventId") as string;
    const userEmail = user?.email || ""; // Get current user's email

    try {
      const response = await fetch(
        `http://localhost:3000/events/join/${eventId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userEmail }),
        }
      );

      if (response.ok) {
        // Refetch events to get updated data
        const updatedResponse = await fetch(
          `http://localhost:3000/events/all-events`,
          { credentials: "include" }
        );
        if (updatedResponse.ok) {
          const { data } = await updatedResponse.json();
          const sortedEvents = data.sort((a: Event, b: Event) => {
            const dateA = new Date(a.dateAndTime);
            const dateB = new Date(b.dateAndTime);
            return dateB.getTime() - dateA.getTime();
          });
          setEvents(sortedEvents);
        }
        return { eventId, error: null, success: true };
      } else {
        const errorData = await response.json();
        return {
          eventId,
          error: errorData.message || "Failed to join event.",
          success: false,
        };
      }
    } catch (error) {
      return {
        eventId,
        error: "An error occurred while joining the event.",
        success: false,
      };
    }
  };

  const [joinState, joinActionFn] = useActionState(joinAction, {
    eventId: "",
    error: null,
    success: false,
  });

  // Handle filter change
  const handleFilterChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (value: string) => {
      setter(value);
    };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilter("all");
    setSelectedDate("");
    setShowFilters(false);
  };

  const currentUserEmail = user?.email || ""; // Get current user's email

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
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
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
                  onChange={(e) =>
                    handleFilterChange(setSearchQuery)(e.target.value)
                  }
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
                onChange={(e) =>
                  handleFilterChange(setSelectedDate)(e.target.value)
                }
                max={new Date("2025-07-01").toISOString().split("T")[0]} // Current date
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date Range
              </label>
              <select
                value={filter}
                onChange={(e) =>
                  handleFilterChange(setFilter)(
                    e.target.value as
                      | "all"
                      | "today"
                      | "currentWeek"
                      | "lastWeek"
                      | "currentMonth"
                      | "lastMonth"
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="today">Today</option>
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          All Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-center text-gray-600">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-600">No events found.</div>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl border border-gray-200 flex flex-col h-64" // Fixed height
              >
                <div className="flex-1 overflow-y-auto pr-2">
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
                    Attendees: {event.attendeeCount}
                  </div>
                </div>
                <div className="mt-4">
                  <form action={joinActionFn}>
                    <input type="hidden" name="eventId" value={event._id} />
                    <Button
                      type="submit"
                      size="sm"
                      className="w-full bg-green-500 hover:bg-green-700 text-white"
                      disabled={
                        event.joins.includes(currentUserEmail) ||
                        (joinState.eventId === event._id && joinState.error)
                      }
                    >
                      {event.joins.includes(currentUserEmail) ? "Joined" : "Join"}
                    </Button>
                  </form>
                  {joinState.eventId === event._id && joinState.error && (
                    <p className="text-red-500 text-sm mt-2">{joinState.error}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;

import { createFileRoute } from "@tanstack/react-router";
import { isLoggedIn } from "@/utils/isLoggedIn";
import { provideRouteContext } from "@/utils/provideRouteContext";

export const Route = createFileRoute("/dashboard/events")({
  component: Events,
  beforeLoad: async () => {
    const res = await isLoggedIn();
    if (!res) {
      throw redirect({
        to: "/login",
      });
    }
  },
  context: provideRouteContext
});
