export const tasks = [
  { 
    category: 'NRMS', 
    tasks: [
      { 
        name: 'NRMS Intra SH',
        scheduledTime: '05:00',
        actualTime: '04:45',
        status: 'Early Completed'
      },
      { 
        name: 'Pre-Club',
        scheduledTime: '06:17',
        actualTime: '06:30',
        status: 'Delay Completed'
      },
      { 
        name: 'NRMS Intra SH',
        scheduledTime: '05:00',
        actualTime: '05:00',
        status: 'Completed'
      },
      { 
        name: 'Intraday',
        scheduledTime: '07:30',
        actualTime: null,
        status: 'Failed'
      },
      { 
        name: 'Intraday',
        scheduledTime: '07:30',
        actualTime: null,
        status: 'Delay Completed'
      }
    ]
  },
  { 
    category: 'MDM', 
    tasks: [
      { 
        name: 'Intraday',
        scheduledTime: '05:00',
        actualTime: '04:50',
        status: 'Early Completed'
      },
      { 
        name: 'MTMS',
        scheduledTime: '06:20',
        actualTime: '06:45',
        status: 'Delay Completed'
      },
      { 
        name: 'Price Band',
        scheduledTime: '07:10',
        actualTime: null,
        status: 'Inprogress'
      }
    ]
  },
  { 
    category: 'MOF', 
    tasks: [
      { 
        name: 'MOF.sh Executed',
        scheduledTime: '05:12',
        actualTime: '05:12',
        status: 'Completed'
      },
      { 
        name: 'Jar Up Running',
        scheduledTime: '06:18',
        actualTime: null,
        status: 'Failed'
      },
      { 
        name: 'Middleware',
        scheduledTime: '07:10',
        actualTime: null,
        status: 'Inprogress'
      }
    ]
  },
  { 
    category: 'NCFE', 
    tasks: [
      { 
        name: 'EPIR Done',
        scheduledTime: '05:20',
        actualTime: '05:20',
        status: 'Completed'
      },
      { 
        name: 'ALC Upload',
        scheduledTime: '06:50',
        actualTime: '06:50',
        status: 'Completed'
      },
      { 
        name: 'Trade Listener',
        scheduledTime: '06:40',
        actualTime: null,
        status: 'Pending'
      },
      { 
        name: 'Trade Count',
        scheduledTime: '10:00',
        actualTime: null,
        status: 'Pending'
      }
    ]
  }
]; 