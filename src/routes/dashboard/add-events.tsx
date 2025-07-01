import React from "react";
import { useActionState } from "react";
import { redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Textarea } from "@/components/ui/textarea"; // shadcn/ui Textarea
import { Label } from "@/components/ui/label"; // shadcn/ui Label
import { Calendar, User, MapPin, FileText, Users } from "lucide-react"; // Icons for form fields

interface FormState {
  error: string | null;
  success: boolean;
}

const AddEvent: React.FC = () => {
  // Form submission action
  const formAction = async (
    _prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const eventData = {
        eventTitle: formData.get("title") as string,
        name: formData.get("postedBy") as string,
        dateAndTime: formData.get("dateTime") as string,
        location: formData.get("location") as string,
        description: formData.get("description") as string,
        attendeeCount: parseInt(formData.get("attendeeCount") as string, 0),
      };

      // Basic client-side validation
      if (
        !eventData.eventTitle ||
        !eventData.name ||
        !eventData.dateAndTime ||
        !eventData.location ||
        isNaN(eventData.attendeeCount) ||
        eventData.attendeeCount < 0
      ) {
        return {
          error: "Please fill in all fields correctly.",
          success: false,
        };
      }

      const response = await fetch(
        "http://localhost:3000/events/create-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
          credentials: "include", // Include cookies for authentication
        }
      );

      if (!response.ok) {
        const res = await response.json();
        const message = res.errorSources[0].message;
        throw new Error(JSON.stringify(message));
      }
      return { error: null, success: true };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
        success: false,
      };
    }
  };

  const [state, submitAction, isPending] = useActionState(formAction, {
    error: null,
    success: false,
  });

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg my-4 sm:my-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Add New Event
      </h2>
      <form action={submitAction} className="space-y-3 sm:space-y-6">
        {/* Event Title */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="title" className="flex items-center text-gray-700 text-sm sm:text-base">
            <Calendar className="w-4 h-4 mr-2" />
            Event Title
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Enter event title"
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Posted By */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="postedBy" className="flex items-center text-gray-700 text-sm sm:text-base">
            <User className="w-4 h-4 mr-2" />
            Posted By
          </Label>
          <Input
            id="postedBy"
            name="postedBy"
            type="text"
            required
            placeholder="Enter your name"
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Date and Time */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="dateTime" className="flex items-center text-gray-700 text-sm sm:text-base">
            <Calendar className="w-4 h-4 mr-2" />
            Date and Time
          </Label>
          <Input
            id="dateTime"
            name="dateTime"
            type="datetime-local"
            required
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Location */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="location" className="flex items-center text-gray-700 text-sm sm:text-base">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </Label>
          <Input
            id="location"
            name="location"
            type="text"
            required
            placeholder="Enter event location"
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Description */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="description" className="flex items-center text-gray-700 text-sm sm:text-base">
            <FileText className="w-4 h-4 mr-2" />
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter event description"
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Attendee Count */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="attendeeCount" className="flex items-center text-gray-700 text-sm sm:text-base">
            <Users className="w-4 h-4 mr-2" />
            Attendee Count
          </Label>
          <Input
            id="attendeeCount"
            name="attendeeCount"
            type="number"
            min="0"
            required
            placeholder="Enter attendee count"
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Error Message */}
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <Button
            type="reset"
            variant="outline"
            size="sm"
            className="flex-1 text-gray-600 hover:text-gray-800 border-gray-300"
            disabled={isPending}
          >
            Reset
          </Button>
          <Button
            type="submit"
            size="sm"
            className="flex-1 bg-green-400 hover:bg-green-500 text-white"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Event"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;

import { createFileRoute } from "@tanstack/react-router";
import { isLoggedIn } from "@/utils/isLoggedIn";

export const Route = createFileRoute("/dashboard/add-events")({
  component: AddEvent,
  beforeLoad: async () => {
    const res = await isLoggedIn();
    if (!res) {
      throw redirect({
        to: "/login",
      });
    }
  },
});