"use client"

import { MapPin, Phone, Mail, Clock, Globe, MessageCircle } from "lucide-react"

const contactDetails = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Business Street", "Suite 100", "City, State 12345"],
    color: "text-red-500",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    color: "text-green-500",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@company.com", "support@company.com"],
    color: "text-blue-500",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM", "Sun: Closed"],
    color: "text-purple-500",
  },
]

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {contactDetails.map((item, index) => {
        const Icon = item.icon
        return (
          <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-full bg-gray-100 ${item.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <div className="space-y-1">
                {item.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {/* Additional Contact Methods */}
      <div className="border-t pt-6 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="#"
            className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Live Chat</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <Globe className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Help Center</span>
          </a>
        </div>
      </div>
    </div>
  )
}
