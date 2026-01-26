'use client'

import { useAuth } from '@/context/AuthContext'
import { Calendar, Users, FolderKanban, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

interface ActivityItem {
  id: string
  type: 'registration' | 'event' | 'member'
  title: string
  description: string
  timestamp: any
}

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    weekRegistrations: 0
  })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch total members
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const totalMembers = usersSnapshot.size

      // Fetch events
      const eventsSnapshot = await getDocs(collection(db, 'events'))
      const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      const now = new Date()
      const activeEvents = events.filter((e: any) => e.registrationOpen).length
      const upcomingEvents = events.filter((e: any) => {
        const eventDate = e.date?.toDate ? e.date.toDate() : new Date(e.date)
        return eventDate > now
      }).length

      // Fetch registrations
      const registrationsSnapshot = await getDocs(collection(db, 'registrations'))
      const totalRegistrations = registrationsSnapshot.size
      
      // Count registrations from this week
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const weekRegistrations = registrationsSnapshot.docs.filter(doc => {
        const data = doc.data()
        const regDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        return regDate >= weekAgo
      }).length

      // Build recent activity
      const activities: ActivityItem[] = []
      
      // Recent registrations (last 5)
      const recentRegs = registrationsSnapshot.docs
        .sort((a, b) => {
          const aDate = a.data().createdAt?.toDate?.() || new Date(0)
          const bDate = b.data().createdAt?.toDate?.() || new Date(0)
          return bDate.getTime() - aDate.getTime()
        })
        .slice(0, 5)
      
      for (const doc of recentRegs) {
        const data = doc.data()
        activities.push({
          id: doc.id,
          type: 'registration',
          title: `New registration for ${data.eventName || 'event'}`,
          description: `${data.studentName || 'Someone'} registered`,
          timestamp: data.createdAt
        })
      }

      setStats({
        totalMembers,
        activeEvents,
        upcomingEvents,
        totalRegistrations,
        weekRegistrations
      })
      setRecentActivity(activities.slice(0, 3))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Recently'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  const statsDisplay = [
    { label: 'Total Members', value: loading ? '...' : stats.totalMembers.toString(), change: '', icon: Users, color: 'text-blue-400' },
    { label: 'Active Events', value: loading ? '...' : stats.activeEvents.toString(), change: `${stats.upcomingEvents} upcoming`, icon: Calendar, color: 'text-green-400' },
    { label: 'Projects', value: '0', change: 'Coming soon', icon: FolderKanban, color: 'text-purple-400' },
    { label: 'Registrations', value: loading ? '...' : stats.totalRegistrations.toString(), change: `${stats.weekRegistrations} this week`, icon: TrendingUp, color: 'text-tech-accent' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.displayName || 'Admin'}!
        </h2>
        <p className="text-gray-400">
          Manage your club events, participants, and more from this dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-tech-light rounded-lg border border-tech-accent/20 p-6 hover:border-tech-accent/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">{stat.label}</h3>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-tech-accent text-sm">{stat.change}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-tech-light rounded-lg border border-tech-accent/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
                </div>
                <span className="text-tech-accent text-sm">{getTimeAgo(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/events" className="bg-tech-light border border-tech-accent/20 rounded-lg p-6 hover:border-tech-accent transition-all text-left group">
          <Calendar className="w-8 h-8 text-tech-accent mb-3" />
          <h3 className="text-white font-semibold mb-2 group-hover:text-tech-accent transition-colors">
            Create Event
          </h3>
          <p className="text-gray-400 text-sm">Add a new event to the calendar</p>
        </Link>

        <Link href="/admin/participants" className="bg-tech-light border border-tech-accent/20 rounded-lg p-6 hover:border-tech-accent transition-all text-left group">
          <Users className="w-8 h-8 text-tech-accent mb-3" />
          <h3 className="text-white font-semibold mb-2 group-hover:text-tech-accent transition-colors">
            Manage Members
          </h3>
          <p className="text-gray-400 text-sm">View and manage club members</p>
        </Link>

        <div className="bg-tech-light border border-tech-accent/20 rounded-lg p-6 opacity-50 cursor-not-allowed text-left group">
          <FolderKanban className="w-8 h-8 text-gray-500 mb-3" />
          <h3 className="text-gray-400 font-semibold mb-2">
            Add Project
          </h3>
          <p className="text-gray-500 text-sm">Coming soon</p>
        </div>
      </div>
    </div>
  )
}
