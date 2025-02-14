export const statuses = [
  { 
    label: 'Completed', 
    color: '#00C853', 
    count: 8,
    trend: 12,
    today: 3,
    weekly: 15
  },
  { 
    label: 'Inprogress', 
    color: '#FF8A65', 
    count: 2,
    trend: -5,
    today: 2,
    weekly: 8
  },
  { 
    label: 'Pending', 
    color: '#9E9E9E', 
    count: 2,
    trend: 3,
    today: 1,
    weekly: 6
  },
  { 
    label: 'Failed', 
    color: '#FF0000', 
    count: 2,
    trend: -8,
    today: 2,
    weekly: 4
  },
  { 
    label: 'Early', 
    color: '#FF00FF', 
    count: 1,
    trend: 15,
    today: 1,
    weekly: 3
  },
  { 
    label: 'Delay', 
    color: '#000080', 
    count: 0,
    trend: -2,
    today: 0,
    weekly: 2
  }
];

export const pieData = [
  { 
    name: 'Completed Tasks', 
    value: 8, 
    color: '#00C853',
    percentage: '45%'
  },
  { 
    name: 'In Progress', 
    value: 4, 
    color: '#FF8A65',
    percentage: '22%'
  },
  { 
    name: 'Pending', 
    value: 3, 
    color: '#9E9E9E',
    percentage: '17%'
  },
  { 
    name: 'Failed', 
    value: 2, 
    color: '#FF0000',
    percentage: '11%'
  },
  { 
    name: 'Others', 
    value: 1, 
    color: '#64B5F6',
    percentage: '5%'
  }
];

export const tasks = [
  { 
    category: 'NRMS', 
    tasks: [
      { name: 'NRMS Intra SH', time: '05:00', status: 'Completed' },
      { name: 'Pre-Club', time: '06:17', status: 'Completed' },
      { name: 'NRMS Intra SH', time: '05:00', status: 'Completed' },
      { name: 'Intraday', time: '07:30', status: 'Failed' }
    ]
  },
  { 
    category: 'MDM', 
    tasks: [
      { name: 'Intraday', time: '05:00', status: 'Early' },
      { name: 'MTMS', time: '06:20', status: 'Completed' },
      { name: 'Price Band', time: '07:10', status: 'Inprogress' }
    ]
  },
  { 
    category: 'MOF', 
    tasks: [
      { name: 'MOF.sh Executed', time: '05:12', status: 'Completed' },
      { name: 'Jar Up Running', time: '06:18', status: 'Failed' },
      { name: 'Middleware', time: '07:10', status: 'Inprogress' }
    ]
  },
  { 
    category: 'NCFE', 
    tasks: [
      { name: 'EPIR Done', time: '05:20', status: 'Completed' },
      { name: 'ALC Upload', time: '06:50', status: 'Completed' },
      { name: 'Trade Listener', time: '06:40', status: 'Pending' },
      { name: 'Trade Count', time: '10:00', status: 'Pending' }
    ]
  }
]; 