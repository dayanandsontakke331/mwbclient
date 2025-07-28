import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardHeader,
  Typography,
  CardContent,
  Avatar,
  IconButton
} from '@mui/material'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import GroupIcon from '@mui/icons-material/Group'
import SendIcon from '@mui/icons-material/Send'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

const Dashboard = () => {
  const { user } = useAuth()

  const [stats, setStats] = useState({
    jobPosts: 0,
    users: 0,
    applications: 0,
    savedJobs: 0,
    applicationsLast7Days: {
      count: 0,
      growth: 0
    }
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getPlatformStats`)
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      stats: stats.jobPosts,
      title: 'Job Posts',
      color: 'primary.main',
      icon: <WorkOutlineIcon />
    },
    {
      stats: stats.users >= 1000 ? `${(stats.users / 1000).toFixed(1)}k` : stats.users,
      title: 'Users Registered',
      color: 'success.main',
      icon: <GroupIcon />
    },
    {
      stats: stats.applications,
      title: 'Applications Submitted',
      color: 'warning.main',
      icon: <SendIcon />
    },
    {
      stats: stats.savedJobs,
      title: 'Saved Jobs',
      color: 'info.main',
      icon: <FavoriteIcon />
    }
  ]

  const percentage = 28
  const total = stats.applicationsLast7Days.count.toLocaleString()
  const growth = stats.applicationsLast7Days.growth

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {user?.role !== 'jobseeker' ? (
        <>
          {/* Card 1: Platform Stats */}
          <Card>
            <CardHeader
              title="Platform Stats"
              action={<IconButton size="small"><MoreVertIcon /></IconButton>}
              titleTypographyProps={{
                sx: {
                  lineHeight: '2rem !important',
                  letterSpacing: '0.15px !important'
                }
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {statsData.map((item, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: item.color,
                          color: '#fff',
                          mr: 3,
                          width: 40,
                          height: 40,
                          boxShadow: 3
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="caption">{item.title}</Typography>
                        <Typography variant="h6">
                          {loading ? '...' : item.stats}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Card 2: Applications Last 7 Days */}
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1">Total Applications</Typography>
                <Typography variant="caption" color="text.secondary">
                  Calculated in last 7 days
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {loading ? '...' : total}
                  <Typography
                    component="span"
                    variant="subtitle2"
                    color="success.main"
                    sx={{ ml: 1, display: 'inline-flex', alignItems: 'center' }}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: '1rem', mr: 0.3 }} />
                    {growth}%
                  </Typography>
                </Typography>
              </Box>

              <Box sx={{ width: 80, height: 80 }}>
                <CircularProgressbarWithChildren
                  value={percentage}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: '#7C3AED',
                    trailColor: '#E0E0E0'
                  })}
                >
                  <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>{percentage}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    1 Quarter
                  </Typography>
                </CircularProgressbarWithChildren>
              </Box>
            </CardContent>
          </Card>
        </>
      ) : (
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
          Welcome to your dashboard.
        </Typography>
      )}
    </Box>
  )
}

export default Dashboard
