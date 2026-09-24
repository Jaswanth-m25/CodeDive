"use client";
import { useTheme } from 'next-themes';
import React from 'react'
import { getContributionStats } from '../actions/actions';
import { useQuery } from '@tanstack/react-query';
import { ActivityCalendar } from 'react-activity-calendar';

const ContributionGraph = () => {
        const { theme }=useTheme();
        const { data, isLoading }=useQuery({
            queryKey:["contribution-graph"],
            queryFn:async()=>await getContributionStats(),
            staleTime:1000*60*5,
        })
    
    if(isLoading){
        return (
            <div className="w-full h-64">
                <p className="text-center text-gray-500">No contribution data available</p>
            </div>
        )
    }
    if(!data ||!data.contributions.length){
        return (
            <div className="w-full h-64">
                <p className="text-center text-gray-500">No contribution data available</p>
            </div>
        )
    }

return (
  <div className="w-full flex flex-col items-center gap-4 p-4">
    <div className="text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">{data.totalContributions}</span>
      contributions in the last year
    </div>

    <div className="w-full overflow-x-auto">
      <div className="flex justify-center min-w-max px-4">
        <ActivityCalendar
          data={data.contributions} 
          colorScheme={theme === "dark" ? "dark" : "light"}
          blockSize={11}
          blockMargin={4}
          fontSize={14}
          showWeekdayLabels
          showMonthLabels
          theme={{
            light: ["hsl(0, 0%, 92%)", "hsl(142, 71%, 45%)"],
            dark: ["#161b22", "hsl(142, 71%, 45%)"],
          }}
        />
      </div>
    </div>
  </div>
)
}


export default ContributionGraph
