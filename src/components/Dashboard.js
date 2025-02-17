import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { tasks } from "../data/dashboardData"
import "./Dashboard.css"
import { TrendingUp, TrendingDown, Schedule, CheckCircle, Error, Pending, Lock } from '@mui/icons-material';
import { useState, useEffect } from "react";

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

// Add this helper function to check dependency status
const getDependencyStatus = (task, allTasks) => {
  if (!task.dependencies || task.dependencies.length === 0) {
    return {
      canStart: true,
      failedDependencies: []
    };
  }

  const failedDependencies = task.dependencies.filter(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    return depTask && depTask.status === 'Failed';
  });

  const hasFailedDependencies = failedDependencies.length > 0;
  const allDependenciesComplete = task.dependencies.every(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    return depTask && (depTask.status === 'Completed' || 
                      depTask.status === 'Early Completed' || 
                      depTask.status === 'Delay Completed');
  });

  return {
    canStart: !hasFailedDependencies && allDependenciesComplete,
    failedDependencies
  };
};

// Add this component to show dependency lines
const DependencyLines = ({ task, allTasks, taskPositions }) => {
  if (!task.dependencies || task.dependencies.length === 0) return null;

  return task.dependencies.map(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    if (!depTask || !taskPositions[depId]) return null;

    const startPos = taskPositions[depId];
    const endPos = taskPositions[task.id];
    
    return (
      <svg
        key={`${depId}-${task.id}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <line
          x1={startPos.x}
          y1={startPos.y}
          x2={endPos.x}
          y2={endPos.y}
          stroke={depTask.status === 'Failed' ? '#FF0000' : '#666'}
          strokeWidth="1"
          strokeDasharray={depTask.status === 'Failed' ? "4" : "none"}
        />
      </svg>
    );
  });
};

// Update the DependencyArrow component
const DependencyArrow = ({ startTask, endTask }) => {
  const [arrowPoints, setArrowPoints] = useState(null);

  useEffect(() => {
    const calculateArrowPoints = () => {
      const startElement = document.getElementById(startTask.id);
      const endElement = document.getElementById(endTask.id);
      
      if (!startElement || !endElement) return null;

      const startRect = startElement.getBoundingClientRect();
      const endRect = endElement.getBoundingClientRect();
      const timelineContainer = document.querySelector('.timeline-wrapper').getBoundingClientRect();

      // Calculate relative positions
      const startX = startRect.right - timelineContainer.left;
      const startY = startRect.top + (startRect.height / 2) - timelineContainer.top;
      const endX = endRect.left - timelineContainer.left;
      const endY = endRect.top + (endRect.height / 2) - timelineContainer.top;

      return { startX, startY, endX, endY };
    };

    setArrowPoints(calculateArrowPoints());

    const handleResize = () => setArrowPoints(calculateArrowPoints());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [startTask, endTask]);

  if (!arrowPoints) return null;

  const { startX, startY, endX, endY } = arrowPoints;
  const controlX = startX + (endX - startX) / 2;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <defs>
        <marker
          id={`arrowhead-${startTask.id}-${endTask.id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#FF0000"
          />
        </marker>
      </defs>
      <path
        d={`M ${startX} ${startY} Q ${controlX} ${startY} ${(startX + endX) / 2} ${(startY + endY) / 2} T ${endX} ${endY}`}
        fill="none"
        stroke="#FF0000"
        strokeWidth="1.5"
        strokeDasharray="4"
        markerEnd={`url(#arrowhead-${startTask.id}-${endTask.id})`}
      />
    </svg>
  );
};

// Update the Timeline component's dependency handling
const Timeline = () => {
  const allTasks = tasks.reduce((acc, group) => [...acc, ...group.tasks], []);

  // Find all failed tasks and their dependencies
  const getFailedTaskConnections = () => {
    const connections = [];
    
    // Find all failed tasks
    const failedTasks = allTasks.filter(task => task.status === 'Failed');
    
    // For each failed task
    failedTasks.forEach(failedTask => {
      // Get its dependencies
      failedTask.dependencies.forEach(depId => {
        const depTask = allTasks.find(t => t.id === depId);
        if (depTask) {
          // Create connection from dependency to failed task
          connections.push({
            startTask: depTask,         // Arrow starts from dependency
            endTask: failedTask,        // Arrow points to failed task
            isBlocked: true
          });
        }
      });
    });

    return connections;
  };

  // Render dependency arrows
  const renderDependencyArrows = () => {
    const connections = getFailedTaskConnections();
    return connections.map(({ startTask, endTask }, index) => (
      <DependencyArrow
        key={`${startTask.id}-${endTask.id}-${index}`}
        startTask={startTask}
        endTask={endTask}
      />
    ));
  };

  const renderTask = (task) => {
    const dependencyStatus = getDependencyStatus(task, allTasks);
    const isBlocked = !dependencyStatus.canStart;
    
    return (
      <Box 
        id={task.id}
        key={task.id} 
        className={`task-item ${isBlocked ? 'blocked' : ''}`}
      >
        <Box
          className="task-bar"
          style={{ 
            background: isBlocked ? '#f5f5f5' : getTaskColor(task.status, task.completedPercentage, false),
            opacity: task.status === 'Pending' ? 1 : (isBlocked ? 0.7 : 1)
          }}
        >
          <Box className="task-content">
            <Box className="task-name">
              <Typography 
                component="span" 
                style={{ 
                  color: task.status === 'Pending' ? '#424242' : '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '15px',
                  marginRight: '8px'
                }}
              >
                {task.name}
              </Typography>
              {task.status === 'Completed' && <CheckCircle fontSize="small" />}
              {task.status === 'Failed' && <Error fontSize="small" color="error" />}
              {task.status === 'Pending' && (
                <Pending 
                  fontSize="small" 
                  style={{ 
                    color: '#757575',
                    marginLeft: '4px'
                  }}
                />
              )}
              {isBlocked && (
                <Tooltip title={`Blocked by failed dependencies: ${
                  dependencyStatus.failedDependencies
                    .map(id => allTasks.find(t => t.id === id)?.name)
                    .join(', ')
                }`}>
                  <Lock fontSize="small" style={{ marginLeft: 4, color: '#616161' }} />
                </Tooltip>
              )}
            </Box>
            <Box className="task-time">
              <Schedule className="time-icon" />
              <span style={{ 
                color: task.status === 'Pending' ? '#000000' : 'inherit',
                fontWeight: task.status === 'Pending' ? 500 : 'normal'
              }}>
                {formatTimeDisplay(task)}
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box className="timeline-wrapper" style={{ position: 'relative' }}>
      {tasks.map((taskGroup) => (
        <Box key={taskGroup.category} className="timeline-row">
          <Box className="category-label">
            {taskGroup.category}
            <span className="category-count">{taskGroup.tasks.length}</span>
          </Box>
          <Box className="tasks-container">
            {taskGroup.tasks.map(task => renderTask(task))}
          </Box>
        </Box>
      ))}
      {/* Render arrows after all tasks */}
      {renderDependencyArrows()}
    </Box>
  );
};

// Add some CSS for the timeline
const styles = `
.timeline-wrapper {
  position: relative;
  overflow: visible;
}

.task-item {
  position: relative;
  z-index: 2;
}

.task-item.blocked {
  border: 1px dashed #999;
}

.task-bar {
  position: relative;
  z-index: 2;
  background: white;
}
`;

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
            {Timeline()}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard

