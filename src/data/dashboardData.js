export const tasks = [
  { 
    category: 'NRMS', 
    tasks: [
      { 
        id: 'nrms_1',
        name: 'NRMS Intra SH',
        scheduledTime: '05:00',
        actualTime: '04:45',
        status: 'Early Completed',
        dependencies: []  // No dependencies (first task)
      },
      { 
        id: 'nrms_2',
        name: 'Pre-Club',
        scheduledTime: '06:17',
        actualTime: '06:30',
        status: 'Delay Completed',
        dependencies: ['nrms_1']  // Depends on NRMS Intra SH
      },
      { 
        id: 'nrms_3',
        name: 'Intraday',
        scheduledTime: '07:30',
        actualTime: null,
        status: 'Failed',
        dependencies: ['nrms_1', 'mdm_1','ncfe_1','mof_1']  // Depends on both previous tasks
      },
      { 
        id: 'nrms_4',
        name: 'Price Update',
        scheduledTime: '08:00',
        actualTime: null,
        status: 'Pending',
        dependencies: ['nrms_3']  // Depends on Intraday (which failed)
      },
      { 
        id: 'nrms_5',
        name: 'Market Data Sync',
        scheduledTime: '07:45',
        actualTime: null,
        status: 'Inprogress',
        dependencies: ['nrms_1']  // Depends on NRMS Intra SH
      },
      { 
        id: 'nrms_6',
        name: 'EOD Preparation',
        scheduledTime: '08:30',
        actualTime: null,
        status: 'Pending',
        dependencies: ['nrms_5']  // Depends on Market Data Sync
      }
    ]
  },
  { 
    category: 'MDM', 
    tasks: [
      { 
        id: 'mdm_1',
        name: 'Intraday',
        scheduledTime: '05:00',
        actualTime: '04:50',
        status: 'Early Completed',
        dependencies: []
      },
      { 
        id: 'mdm_2',
        name: 'MTMS',
        scheduledTime: '06:20',
        actualTime: '06:45',
        status: 'Delay Completed',
        dependencies: ['mdm_1']
      },
      { 
        id: 'mdm_3',
        name: 'Price Band',
        scheduledTime: '07:10',
        actualTime: null,
        status: 'Pending',  // Changed to Pending because it depends on failed NRMS task
        dependencies: ['mdm_2', 'nrms_3']  // Added dependency on NRMS Intraday which failed
      },
      { 
        id: 'mdm_4',
        name: 'Data Validation',
        scheduledTime: '07:30',
        actualTime: null,
        status: 'Inprogress',
        dependencies: ['mdm_2']  // Depends on MTMS
      },
      { 
        id: 'mdm_5',
        name: 'Report Generation',
        scheduledTime: '08:15',
        actualTime: null,
        status: 'Pending',
        dependencies: ['mdm_4']  // Depends on Data Validation
      }
    ]
  },
  { 
    category: 'MOF', 
    tasks: [
      { 
        id: 'mof_1',
        name: 'MOF.sh Executed',
        scheduledTime: '05:12',
        actualTime: '05:12',
        status: 'Completed',
        dependencies: []
      },
      { 
        id: 'mof_2',
        name: 'Jar Up Running',
        scheduledTime: '06:18',
        actualTime: null,
        status: 'Failed',
        dependencies: ['mof_1','mdm_1']
      },
      { 
        id: 'mof_3',
        name: 'Middleware',
        scheduledTime: '07:10',
        actualTime: null,
        status: 'Pending',  // Changed to Pending because it depends on failed task
        dependencies: ['mof_2']  // Depends on failed Jar Up Running
      },
      { 
        id: 'mof_4',
        name: 'System Health Check',
        scheduledTime: '07:45',
        actualTime: null,
        status: 'Inprogress',
        dependencies: ['mof_1']  // Depends on MOF.sh Executed
      },
      { 
        id: 'mof_5',
        name: 'Backup Verification',
        scheduledTime: '08:30',
        actualTime: null,
        status: 'Pending',
        dependencies: ['mof_4']  // Depends on System Health Check
      }
    ]
  },
  { 
    category: 'NCFE', 
    tasks: [
      { 
        id: 'ncfe_1',
        name: 'EPIR Done',
        scheduledTime: '05:20',
        actualTime: '05:20',
        status: 'Completed',
        dependencies: []
      },
      { 
        id: 'ncfe_2',
        name: 'ALC Upload',
        scheduledTime: '06:50',
        actualTime: '06:50',
        status: 'Completed',
        dependencies: ['ncfe_1']
      },
      { 
        id: 'ncfe_3',
        name: 'Trade Listener',
        scheduledTime: '06:40',
        actualTime: null,
        status: 'Pending',
        dependencies: ['ncfe_2', 'nrms_3']  // Added dependency on failed NRMS Intraday
      },
      { 
        id: 'ncfe_4',
        name: 'Trade Count',
        scheduledTime: '10:00',
        actualTime: null,
        status: 'Pending',
        dependencies: ['ncfe_3']  // Depends on Trade Listener which is blocked by failed NRMS task
      },
      { 
        id: 'ncfe_5',
        name: 'Data Reconciliation',
        scheduledTime: '07:30',
        actualTime: null,
        status: 'Inprogress',
        dependencies: ['ncfe_2']  // Depends on ALC Upload
      },
      { 
        id: 'ncfe_6',
        name: 'Final Verification',
        scheduledTime: '08:45',
        actualTime: null,
        status: 'Pending',
        dependencies: ['ncfe_5']  // Depends on Data Reconciliation
      }
    ]
  }
]; 