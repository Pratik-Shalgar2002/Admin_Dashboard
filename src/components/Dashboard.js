import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { statuses, pieData, tasks } from "../data/dashboardData"
import "./Dashboard.css"
import { TrendingUp, TrendingDown, Schedule, CheckCircle, Error, Pending } from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box className="main-container">
      <Box className="dashboard-wrapper">
        <Box className="top-section">
          <Box className="status-section">
            <Box className="status-header">
              <Typography variant="h6" className="section-title">
                Status Overview
              </Typography>
              <Box className="status-metrics">
                <span className="metric-item">
                  Total Tasks: <span className="metric-value">27</span>
                </span>
                <span className="metric-item">
                  Completion Rate: <span className="metric-value">76%</span>
                </span>
                <span className="metric-item">
                  On-time Performance: <span className="metric-value">92%</span>
                </span>
              </Box>
            </Box>
            
            <Box className="status-container">
              {statuses.map((status) => (
                <Box
                  key={status.label}
                  className="status-box"
                  style={{ backgroundColor: status.color }}
                >
                  <Typography 
                    variant="h4" 
                    className="status-count"
                    data-trend={status.trend > 0 ? '↑' : status.trend < 0 ? '↓' : ''}
                  >
                    {status.count}
                  </Typography>
                  <Typography variant="body2" className="status-text">
                    {status.label}
                  </Typography>
                  <Box className="status-details">
                    <span>Today: {status.today}</span>
                    <span>Week: {status.weekly}</span>
                  </Box>
                  {true && (
                    <Box className={`status-trend ${status.trend > 0 ? 'trend-up' : 'trend-down'}`}>
                      {status.trend > 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                      {Math.abs(status.trend)}% vs last week
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          <Box className="chart-section">
            <Box className="chart-header">
              <Typography variant="h6" className="section-title">
                Task Distribution
              </Typography>
              <Typography variant="body2" className="chart-subtitle">
                Total Tasks: {pieData.reduce((acc, item) => acc + item.value, 0)}
              </Typography>
            </Box>
            <Box className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={isMobile ? "35%" : "40%"}
                    outerRadius={isMobile ? "50%" : "55%"}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <Box className="custom-tooltip">
                            <Typography variant="subtitle2">{data.name}</Typography>
                            <Typography variant="body2">
                              Count: {data.value} ({data.percentage})
                            </Typography>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value, entry) => (
                      <span style={{ color: '#64748b', fontSize: isMobile ? '10px' : '12px' }}>
                        {value} ({entry.payload.percentage})
                      </span>
                    )}
                    wrapperStyle={{
                      paddingTop: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>

        <Box className="timeline-section">
          <Box className="timeline-header">
            <Typography variant="h6" className="section-title">
              Task Timeline
            </Typography>
            <Box className="timeline-metrics">
              <span>Total Tasks: {tasks.reduce((acc, group) => acc + group.tasks.length, 0)}</span>
              <span>Active Groups: {tasks.length}</span>
              <span>Latest Update: {new Date().toLocaleTimeString()}</span>
            </Box>
          </Box>
          <Box className="timeline-wrapper">
            {tasks.map((taskGroup) => (
              <Box key={taskGroup.category} className="timeline-row">
                <Box className="category-label">
                  {taskGroup.category}
                  <span className="category-count">{taskGroup.tasks.length}</span>
                </Box>
                <Box className="tasks-container">
                  {taskGroup.tasks.map((task) => (
                    <Box key={task.name} className="task-item">
                      <Box
                        className="task-bar"
                        style={{ backgroundColor: statuses.find((s) => s.label === task.status).color }}
                      >
                        <Box className="task-content">
                          <Box className="task-name">
                            {task.name}
                            {task.status === 'Completed' && <CheckCircle fontSize="small" />}
                            {task.status === 'Failed' && <Error fontSize="small" />}
                            {task.status === 'Pending' && <Pending fontSize="small" />}
                          </Box>
                          <Box className="task-time">
                            <Schedule className="time-icon" />
                            {task.time}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard

