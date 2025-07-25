"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import EventCard from "@/components/event-card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Music } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

const heroImages = [
	{
		src: "/placeholder.svg?height=600&width=1200",
		alt: "Live Concert",
	},
	{
		src: "/placeholder.svg?height=600&width=1200",
		alt: "Music Festival",
	},
	{
		src: "/placeholder.svg?height=600&width=1200",
		alt: "Live Performance",
	},
]

export default function Home() {
	const [eventList, setEventList] = useState([])
	const [loading, setLoading] = useState(true)

	const [trendingEvents, setTrendingEvents] = useState([])
	const [loadingTrending, setLoadingTrending] = useState(true)

	const fetchEvents = async () => {
		try {
			setLoading(true)
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/product/getupcoming`
			)
			const data = await response.json()
			setEventList(data)
		} catch (error) {
			console.error("Error fetching events:", error)
		} finally {
			setLoading(false)
		}
	}

	const fetchTrendingEvents = async () => {
		try {
			setLoadingTrending(true)
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/product/trending-today`
			)
			const data = await response.json()
			setTrendingEvents(data)
		} catch (error) {
			console.error("Error fetching trending events:", error)
		} finally {
			setLoadingTrending(false)
		}
	}

	useEffect(() => {
		fetchEvents()
		fetchTrendingEvents()
	}, [])

	return (
		<div className="min-h-screen  bg-background">
			<Navbar />

			{/* Hero Video Section */}
			<motion.section
				className="relative h-screen overflow-hidden"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<video
					autoPlay
					muted
					loop
					playsInline
					className="absolute inset-0 w-full h-full object-cover"
				>
					<source
						src="https://www.teaminnovation.co.in/Images/teaminnovation.mp4"
						type="video/mp4"
					/>
				</video>
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
					<div className="text-center text-white space-y-6">
						<h1 className="text-4xl md:text-6xl font-bold">
							Move With The Buzztown Live
						</h1>
						<p className="text-lg md:text-xl max-w-2xl mx-auto px-4">
							Experience unforgettable live events, concerts, and
							entertainment
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								className="bg-primary hover:bg-primary/90"
							>
								<Calendar className="mr-2 h-5 w-5" />
								Browse Events
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="bg-white/10 border-white text-white hover:bg-white/20"
							>
								<Music className="mr-2 h-5 w-5" />
								Watch Highlights
							</Button>
						</div>
					</div>
				</div>
			</motion.section>
			<div className="container mx-auto">

			{/* Featured Events Carousel */}
			<motion.section
				className="py-8"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8 }}
			>
				<div className="container">
					<div className="text-center mb-6">
						<h2 className="text-2xl font-bold mb-2">Featured Events</h2>
						<p className="text-muted-foreground">
							Don't miss these amazing upcoming events
						</p>
					</div>
					<Carousel
						plugins={[
							Autoplay({
								delay: 4000,
							}),
						]}
						className="w-full"
					>
						<CarouselContent>
							{heroImages.map((image, index) => (
								<CarouselItem
									key={index}
									className="md:basis-1/2 lg:basis-1/3"
								>
									<div className="relative aspect-video overflow-hidden rounded-lg">
										<Image
											src={image.src || "/placeholder.svg"}
											alt={image.alt}
											fill
											className="object-cover"
										/>
										<div className="absolute inset-0 bg-black/30 flex items-end">
											<div className="p-4 text-white">
												<h3 className="font-semibold">{image.alt}</h3>
												<p className="text-sm opacity-90">
													Coming Soon
												</p>
											</div>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>
			</motion.section>

			{/* Upcoming Events Section */}
			<motion.section
				className="py-12"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8 }}
			>
				<div className="container ">
					<div className="text-center mb-8">
						<Badge variant="secondary" className="mb-4">
							<Calendar className="mr-1 h-3 w-3" />
							Upcoming
						</Badge>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Don't Miss Out
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Get your tickets now for the hottest events in town
						</p>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-10 space-evenly">
							{Array.from({ length: 4 }).map((_, i) => (
								<motion.div key={i} className="animate-pulse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
									<div className="bg-muted aspect-video rounded-lg mb-4"></div>
									<div className="h-4 bg-muted rounded mb-2"></div>
									<div className="h-4 bg-muted rounded w-2/3"></div>
								</motion.div>
							))}
						</div>
					) : (
						<motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-10 space-evenly" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
							{eventList.slice(0, 4).map((event, i) => (
								<motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
									<EventCard eventData={event} />
								</motion.div>
							))}
						</motion.div>
					)}
				</div>
			</motion.section>

			{/* Popular Events Section */}
			<motion.section
				className="py-12 bg-muted/50"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8 }}
			>
				<div className="container">
					<div className="text-center mb-8">
						<Badge variant="destructive" className="mb-4">
							<Music className="mr-1 h-3 w-3" />
							Popular
						</Badge>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Trending Events
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Join thousands of others at these popular events
						</p>
					</div>

					{loadingTrending ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
							{Array.from({ length: 4 }).map((_, i) => (
								<motion.div key={i} className="animate-pulse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
									<div className="bg-muted aspect-video rounded-lg mb-4"></div>
									<div className="h-4 bg-muted rounded mb-2"></div>
									<div className="h-4 bg-muted rounded w-2/3"></div>
								</motion.div>
							))}
						</div>
					) : (
						<motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
							{trendingEvents.map((event, i) => (
								<motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
									<EventCard eventData={event} />
								</motion.div>
							))}
						</motion.div>
					)}
				</div>
			</motion.section>
			</div>


			{/* Stats Section */}
			<motion.section
				className="py-16 bg-primary text-primary-foreground container mx-auto  rounded-4xl"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8 }}
			>
				<div className="container">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
						<div>
							<h3 className="text-4xl font-bold mb-2">500+</h3>
							<p className="text-lg opacity-90">Events Hosted</p>
						</div>
						<div>
							<h3 className="text-4xl font-bold mb-2">50K+</h3>
							<p className="text-lg opacity-90">Happy Attendees</p>
						</div>
						<div>
							<h3 className="text-4xl font-bold mb-2">100+</h3>
							<p className="text-lg opacity-90">Artists Featured</p>
						</div>
					</div>
				</div>
			</motion.section>

			{/* Newsletter Section */}
			<motion.section
				className="py-16 bg-muted container mx-auto"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8 }}
			>
				<div className="container text-center">
					<h2 className="text-3xl font-bold mb-4">Never Miss an Event</h2>
					<p className="text-lg mb-8 text-muted-foreground">
						Subscribe to get notified about upcoming events and exclusive offers
					</p>
					<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 px-4 py-2 rounded-md border"
						/>
						<Button>Subscribe</Button>
					</div>
				</div>
			</motion.section>

			{/* Footer */}
			<Footer />
		</div>
	)
}
