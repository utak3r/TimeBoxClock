import { ipcRenderer, contextBridge } from 'electron'

ipcRenderer.send('log', 'Preload script running')
console.log('Preload script loaded')

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

try {
  contextBridge.exposeInMainWorld('db', {
    getProjects: () => ipcRenderer.invoke('db:get-projects'),
    addProject: (project: any) => ipcRenderer.invoke('db:add-project', project),
    updateProject: (project: any) => ipcRenderer.invoke('db:update-project', project),
    deleteProject: (id: string) => ipcRenderer.invoke('db:delete-project', id),
    getJobs: () => ipcRenderer.invoke('db:get-jobs'),
    addJob: (job: any) => ipcRenderer.invoke('db:add-job', job),
    updateJob: (job: any) => ipcRenderer.invoke('db:update-job', job),
    deleteJob: (id: string) => ipcRenderer.invoke('db:delete-job', id),
  })
  console.log('Database API exposed')
} catch (error) {
  console.error('Failed to expose Database API:', error)
}
