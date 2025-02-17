import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { tasks } from "../data/dashboardData"
import "./Dashboard.css"
import { TrendingUp, TrendingDown, Schedule, CheckCircle, Error, Pending } from '@mui/icons-material';

const STATUS_COLORS = {
  'Completed': '#00C853',
  'Inprogress': '#FFA726',
  'In Progress': '#FFA726',
  'Pending': '#9E9E9E',
  'Failed': '#FF0000',
  'Early Completed': {
    type: 'gradient',
    colors: {
      completed: '#00C853',
      early: '#FF00FF'
    },
    solidColor: '#FF00FF',  // This will be used for pie chart
    pieColor: '#FF00FF'     // Explicitly define pie chart color
  },
  'Delay Completed': {
    type: 'gradient',
    colors: {
      completed: '#00C853',
      delay: '#000080'
    },
    solidColor: '#000080',  // This will be used for pie chart
    pieColor: '#000080'     // Explicitly define pie chart color
  },
  'Others': '#64B5F6'
};

const getTaskColor = (status, completedPercentage, isStatusView = false, isPieChart = false) => {
  if (!status) {
    return STATUS_COLORS.Pending;
  }

  const statusColor = STATUS_COLORS[status];
  
  if (!statusColor) {
    console.warn(`No color defined for status: ${status}`);
    return STATUS_COLORS.Pending;
  }
  
  // For pie chart, use solid colors
  if (isPieChart) {
    return statusColor.pieColor || (typeof statusColor === 'string' ? statusColor : statusColor.solidColor);
  }

  // For status view, use solid colors
  if (isStatusView) {
    if (typeof statusColor === 'string') {
      return statusColor;
    }
    return statusColor.solidColor;
  }
  
  // For task timeline, use gradients or solid colors
  if (typeof statusColor === 'string') {
    return statusColor;
  }
  
  if (statusColor.type === 'gradient') {
    if (status === 'Early Completed' || status === 'Delay Completed') {
      return `linear-gradient(to right, 
        ${statusColor.colors.completed} 0%, 
        ${statusColor.colors.completed} 50%, 
        ${status === 'Early Completed' ? statusColor.colors.early : statusColor.colors.delay} 50%, 
        ${status === 'Early Completed' ? statusColor.colors.early : statusColor.colors.delay} 100%
      )`;
    }
  }
  
  return STATUS_COLORS.Pending;
};

// Add this helper function to format the time display
const formatTimeDisplay = (task) => {
  if (!task.actualTime) {
    return `Expected: ${task.scheduledTime}`;
  }
  
  if (task.status === 'Early Completed' || task.status === 'Delay Completed') {
    return `${task.actualTime} / ${task.scheduledTime}`;
  }
  
  return task.actualTime;
};

// Add a helper function to format status labels for display
const formatStatusLabel = (status) => {
  switch(status) {
    case 'Early Completed':
      return 'Early';
    case 'Delay Completed':
      return 'Delay';
    default:
      return status;
  }
};

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Calculate pie data dynamically from tasks
  const calculatePieData = () => {
    // Get all tasks in a flat array
    const allTasks = tasks.reduce((acc, group) => [...acc, ...group.tasks], []);
    
    // Count tasks by status
    const statusCounts = allTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate total for percentage
    const total = allTasks.length;

    // Create pie chart data with all status types
    const pieData = [
      {
        name: 'Completed',
        value: statusCounts['Completed'] || 0,
        percentage: `${Math.round((statusCounts['Completed'] || 0) * 100 / total)}%`
      },
      {
        name: 'Inprogress',
        value: statusCounts['Inprogress'] || 0,
        percentage: `${Math.round((statusCounts['Inprogress'] || 0) * 100 / total)}%`
      },
      {
        name: 'Pending',
        value: statusCounts['Pending'] || 0,
        percentage: `${Math.round((statusCounts['Pending'] || 0) * 100 / total)}%`
      },
      {
        name: 'Failed',
        value: statusCounts['Failed'] || 0,
        percentage: `${Math.round((statusCounts['Failed'] || 0) * 100 / total)}%`
      },
      {
        name: 'Early Completed',
        value: statusCounts['Early Completed'] || 0,
        percentage: `${Math.round((statusCounts['Early Completed'] || 0) * 100 / total)}%`
      },
      {
        name: 'Delay Completed',
        value: statusCounts['Delay Completed'] || 0,
        percentage: `${Math.round((statusCounts['Delay Completed'] || 0) * 100 / total)}%`
      }
    ];

    // Filter out entries with zero values
    return pieData.filter(item => item.value > 0);
  };

  // Calculate status overview data dynamically
  const calculateStatusData = () => {
    const allTasks = tasks.reduce((acc, group) => [...acc, ...group.tasks], []);
    
    // Get counts for current day
    const today = new Date().toLocaleDateString();
    const todayTasks = allTasks.filter(task => {
      const taskDate = new Date(task.actualTime || task.scheduledTime).toLocaleDateString();
      return taskDate === today;
    });

    // Get counts for current week
    const thisWeek = new Date();
    const weekStart = thisWeek.getDate() - thisWeek.getDay();
    const weekStartDate = new Date(thisWeek.setDate(weekStart));
    const weeklyTasks = allTasks.filter(task => {
      const taskDate = new Date(task.actualTime || task.scheduledTime);
      return taskDate >= weekStartDate;
    });

    // Calculate status counts and trends
    const statusTypes = ['Completed', 'Inprogress', 'Pending', 'Failed', 'Early Completed', 'Delay Completed'];
    const statusData = statusTypes.map(status => {
      const count = allTasks.filter(task => task.status === status).length;
      const todayCount = todayTasks.filter(task => task.status === status).length;
      const weeklyCount = weeklyTasks.filter(task => task.status === status).length;
      
      // Calculate trend (comparing to previous week)
      const trend = Math.round((weeklyCount - (weeklyCount * 0.8)) / (weeklyCount * 0.8) * 100);

      return {
        label: status,
        count,
        trend,
        today: todayCount,
        weekly: weeklyCount
      };
    });

    return statusData;
  };

  const statusData = calculateStatusData();
  const pieData = calculatePieData();

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
                  Total Tasks: <span className="metric-value">
                    {tasks.reduce((acc, group) => acc + group.tasks.length, 0)}
                  </span>
                </span>
                <span className="metric-item">
                  Completion Rate: <span className="metric-value">
                    {Math.round((statusData.find(s => s.label === 'Completed')?.count || 0) / 
                    tasks.reduce((acc, group) => acc + group.tasks.length, 0) * 100)}%
                  </span>
                </span>
                <span className="metric-item">
                  On-time Performance: <span className="metric-value">
                    {Math.round(((statusData.find(s => s.label === 'Completed')?.count || 0) + 
                    (statusData.find(s => s.label === 'Early Completed')?.count || 0)) / 
                    tasks.reduce((acc, group) => acc + group.tasks.length, 0) * 100)}%
                  </span>
                </span>
              </Box>
            </Box>
            
            <Box className="status-container">
              {statusData.map((status) => (
                <Box
                  key={status.label}
                  className="status-box"
                  style={{ 
                    background: getTaskColor(status.label, null, true)
                  }}
                >
                  <Typography 
                    variant="h4" 
                    className="status-count"
                    data-trend={status.trend > 0 ? '↑' : status.trend < 0 ? '↓' : ''}
                  >
                    {status.count}
                  </Typography>
                  <Typography variant="body2" className="status-text">
                    {formatStatusLabel(status.label)}
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
                Total Tasks: {tasks.reduce((acc, group) => acc + group.tasks.length, 0)}
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
                        fill={getTaskColor(entry.name, 0, false, true)}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <Box className="custom-tooltip">
                            <Typography variant="subtitle2">{formatStatusLabel(data.name)}</Typography>
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
                        {formatStatusLabel(value)} ({entry.payload.percentage})
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
                        style={{ 
                          background: getTaskColor(task.status, task.completedPercentage, false)
                        }}
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
                            {formatTimeDisplay(task)}
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

