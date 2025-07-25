"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const PreviousEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch previous events data
  const fetchEvents = () => {
    if (typeof window !== "undefined") {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/previous/getall`)
        .then((result) => result.json())
        .then((data) => {
          setEvents(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load events");
          setLoading(false);
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading previous events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Previous Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Card key={event.id || event._id} className="flex flex-col h-full">
            <div className="w-full h-52 overflow-hidden rounded-t-xl">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${event.image}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="flex flex-col gap-2 py-4">
              <h2 className="font-semibold text-lg">{event.title}</h2>
              <p className="text-sm text-muted-foreground">Place: {event.place}</p>
              <p className="text-sm">Date: {new Date(event.date).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PreviousEventsPage;