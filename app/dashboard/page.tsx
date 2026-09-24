"use client";
import React from 'react'
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card"
import {BarChart,Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer} from "recharts"
import {GitCommit,GitPullRequest,MessageSquare,GitBranch} from "lucide-react"
import {useQuery} from "@tanstack/react-query"
import {getDashboardStats,getMonthlyActivity} from "@/module/daashbard/actions/actions" 
import ContributionGraph from '@/module/daashbard/components/contribution-graph';
import { Spinner } from '@/components/ui/spinner';
const Mainpage = () => {
  const {data:stats,isLoading}=useQuery({
    queryKey:["dashboardStats"],
    queryFn:async()=>await getDashboardStats(),
    refetchOnWindowFocus:false,
  })
  const {data:monthlyActivity,isLoading:activityLoading}=useQuery({
    queryKey:["monthlyActivity"],
    queryFn:async()=>await getMonthlyActivity(),
    refetchOnWindowFocus:false,
  })
return (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Overview of your coding activity and AI reviews
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Repositories
          </CardTitle>
          <GitBranch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats?.totalRepos || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Connected repositories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Commits
          </CardTitle>
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : (stats?.totalCommits || 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            In the last year
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pull Requests
          </CardTitle>
          <GitPullRequest className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats?.totalPRs || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            All time
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Code Reviews
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats?.totalReviews || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            All time
          </p>
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Contribution Activity</CardTitle>
        <CardDescription>
          Visualizing your coding frequency over last year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContributionGraph />
      </CardContent>
    </Card>
<div className="grid gap-4 md:grid-cols-2">
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle> Activity Overview</CardTitle>
      <CardDescription>
        Monthly breakdown of your coding activity
      </CardDescription>
    </CardHeader>
    <CardContent>
      {
        activityLoading ? (
          <div className="h-80 w-full flex items-center justify-center">
            <Spinner/>
          </div>
        ) : (
<div className="h-80 w-full">
  <ResponsiveContainer width="100%" height="100%"> 
              <BarChart data={monthlyActivity || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Bar dataKey="commits" fill="#8884d8" name="Commits" />
                <Bar dataKey="prs" fill="#82ca9d" name="Pull Requests" />
                <Bar dataKey="reviews" fill="#ffc658" name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
    }
    </CardContent>
  </Card>
</div>
  </div>
)
}

export default Mainpage
