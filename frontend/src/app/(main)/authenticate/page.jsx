"use client"

import { useState } from "react"
import { Login } from "./Login"
import { Signup } from "./Signup"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BUZZTOWN!</h1>
          <p className="text-gray-600">Your journey starts here.</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to BUZZTOWN</CardTitle>
            <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6">
                <Login onSwitchToSignup={() => setActiveTab("signup")} />
              </TabsContent>
              <TabsContent value="signup" className="mt-6">
                <Signup onSwitchToLogin={() => setActiveTab("login")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
