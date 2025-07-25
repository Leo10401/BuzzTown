"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Calendar, MapPin, SlidersHorizontal, Grid3X3, List, TrendingUp } from "lucide-react"
import EventCard from "@/components/event-card"
import { useRouter } from "next/navigation"

const BrowseEvents = () => {
  const [eventList, setEventList] = useState([])
  const [masterList, setMasterList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("date")
  const router = useRouter()

  // Mock categories - you can fetch these from your API
  const categories = [
    { id: "all", name: "All Events", count: 0 },
    { id: "music", name: "Music", count: 0 },
    { id: "sports", name: "Sports", count: 0 },
    { id: "technology", name: "Technology", count: 0 },
    { id: "business", name: "Business", count: 0 },
    { id: "arts", name: "Arts & Culture", count: 0 },
    { id: "food", name: "Food & Drink", count: 0 },
  ]

  useEffect(() => {
    fetchAllEvents()
  }, [])

  const fetchAllEvents = () => {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/getall`)
      .then((result) => result.json())
      .then((data) => {
        setEventList(data)
        setMasterList(data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  const showEvents = () => {
    if (loading) {
      return (
        <motion.div
          className="col-span-full flex items-center justify-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center space-y-4">
            <motion.div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <p className="text-gray-600 text-lg">Loading amazing events...</p>
          </div>
        </motion.div>
      )
    }

    if (eventList.length === 0) {
      return (
        <motion.div
          className="col-span-full flex items-center justify-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-600 text-xl font-medium">No events found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setEventList(masterList)
              }}
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>
      )
    }

    return (
      <AnimatePresence mode="wait">
        {eventList.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className="w-full"
          >
            <EventCard eventData={event} />
          </motion.div>
        ))}
      </AnimatePresence>
    )
  }

  const searchEvent = (query) => {
    setSearchQuery(query)
    filterEvents(query, selectedCategory)
  }

  const filterByCategory = (category) => {
    setSelectedCategory(category)
    filterEvents(searchQuery, category)
  }

  const filterEvents = (query, category) => {
    let filtered = masterList

    // Filter by search query
    if (query.trim() !== "") {
      filtered = filtered.filter(
        (event) =>
          (event.title && event.title.toLowerCase().includes(query.toLowerCase())) ||
          (event.description && event.description.toLowerCase().includes(query.toLowerCase())) ||
          (event.location && event.location.toLowerCase().includes(query.toLowerCase())),
      )
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((event) => event.category && event.category.toLowerCase() === category.toLowerCase())
    }

    setEventList(filtered)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header Section */}


      {/* Main Content Section with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Search and Filters */}
          <motion.div
            className="w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="sticky top-8 space-y-6">
              {/* Search Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Search Events</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => searchEvent(e.target.value)}
                    className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </Card>

              {/* Categories Filter */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => filterByCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </Card>

              {/* Additional Filters */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Calendar className="w-4 h-4 mr-2" />
                      Select dates
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MapPin className="w-4 h-4 mr-2" />
                      Any location
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="flex gap-2">
                      <Input placeholder="Min" className="text-sm" />
                      <Input placeholder="Max" className="text-sm" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setEventList(masterList)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* Trending Section - Above browsed events */}
            {!loading && eventList.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Trending Events</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventList.slice(0, 3).map((event, index) => (
                    <motion.div
                      key={`trending-${event._id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : selectedCategory === "all"
                      ? "All Events"
                      : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                  <Badge variant="secondary" className="text-sm">
                    {eventList.length} {eventList.length === 1 ? "event" : "events"}
                  </Badge>
                </motion.div>
              </div>

              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </div>
            </div>

            {/* Events Grid */}
            <motion.div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              }`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {showEvents()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrowseEvents
