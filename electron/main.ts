import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Store from 'electron-store'
import { consolidateJobs, Job, Project } from './consolidation'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Data Store Setup
interface StoreSchema {
  projects: Project[];
  jobs: Job[];
}

const store = new Store<StoreSchema>({
  defaults: {
    projects: [],
    jobs: []
  }
})

// ... ipc handlers ...

// Log handler
ipcMain.on('log', (_, msg) => console.log('Renderer/Preload:', msg))

// IPC Handlers
ipcMain.handle('db:get-projects', () => {
  console.log('IPC: db:get-projects')
  return store.get('projects')
})
ipcMain.handle('db:add-project', (_, project: Project) => {
  console.log('IPC: db:add-project', project)
  const projects = store.get('projects')
  store.set('projects', [...projects, project])
  return project
})
ipcMain.handle('db:delete-project', (_, id: string) => {
  console.log('IPC: db:delete-project', id)
  const projects = store.get('projects')
  store.set('projects', projects.filter(p => p.id !== id))
})
ipcMain.handle('db:update-project', (_, updatedProject: Project) => {
  console.log('IPC: db:update-project', updatedProject)
  const projects = store.get('projects')
  store.set('projects', projects.map(p => p.id === updatedProject.id ? updatedProject : p))
  return updatedProject
})

ipcMain.handle('db:get-jobs', () => {
  console.log('IPC: db:get-jobs')
  return store.get('jobs')
})
ipcMain.handle('db:add-job', (_, job: Job) => {
  console.log('IPC: db:add-job', job)
  const jobs = store.get('jobs')
  store.set('jobs', [...jobs, job])
  return job
})
ipcMain.handle('db:update-job', (_, updatedJob: Job) => {
  console.log('IPC: db:update-job', updatedJob)
  const jobs = store.get('jobs')
  store.set('jobs', jobs.map(j => j.id === updatedJob.id ? updatedJob : j))
  return updatedJob
})
ipcMain.handle('db:delete-job', (_, id: string) => {
  console.log('IPC: db:delete-job', id)
  const jobs = store.get('jobs')
  store.set('jobs', jobs.filter(j => j.id !== id))
})


// The built directory structure
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null = null
let isQuitting = false

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 670,
    show: false, // Don't show until ready
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, 'TimeBoxClock.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: false,
      contextIsolation: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      win?.hide()
      return false
    }
    return true
  })

  win.once('ready-to-show', () => {
    win?.show()
  })
}

function createTray() {
  const iconPath = path.join(process.env.VITE_PUBLIC, 'TimeBoxClock.ico')
  console.log('Tray Icon Path:', iconPath)

  const icon = nativeImage.createFromPath(iconPath)
  console.log('Tray Icon Empty:', icon.isEmpty())

  tray = new Tray(icon)
  tray.setToolTip('TimeBoxClock')

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => showWindow() },
    { type: 'separator' },
    {
      label: 'Quit', click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    toggleWindow()
  })
}

function toggleWindow() {
  if (win?.isVisible()) {
    win.hide()
  } else {
    showWindow()
  }
}

function showWindow() {
  win?.show()
  win?.focus()
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      if (!win.isVisible()) win.show()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    consolidateOldJobs()
    createWindow()
    createTray()
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // We don't quit here anymore, we wait for explicit Quit from tray
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

function consolidateOldJobs() {
  console.log('Running job consolidation...')
  const jobs = store.get('jobs') || []
  const projects = store.get('projects') || []

  const newJobList = consolidateJobs(jobs, projects)

  // Only update if length changed or if we want to enforce sort order (but let's just check length for simple opt)
  // Actually, wait, consolidateJobs always returns a sorted list. If the store list was not sorted, this might update it.
  // But purely for consolidation, if lengths differ, we definitely update. 
  // If lengths are same, it means no consolidation happened (assuming no zero-length consolidation which is true).

  if (newJobList.length !== jobs.length) {
    store.set('jobs', newJobList)
    console.log(`Consolidated jobs. Old count: ${jobs.length}, New count: ${newJobList.length}`)
  } else {
    console.log('No jobs to consolidate.')
  }
}
