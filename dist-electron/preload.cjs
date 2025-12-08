"use strict";
const electron = require("electron");
electron.ipcRenderer.send("log", "Preload script running");
console.log("Preload script loaded");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
try {
  electron.contextBridge.exposeInMainWorld("db", {
    getProjects: () => electron.ipcRenderer.invoke("db:get-projects"),
    addProject: (project) => electron.ipcRenderer.invoke("db:add-project", project),
    updateProject: (project) => electron.ipcRenderer.invoke("db:update-project", project),
    deleteProject: (id) => electron.ipcRenderer.invoke("db:delete-project", id),
    getJobs: () => electron.ipcRenderer.invoke("db:get-jobs"),
    addJob: (job) => electron.ipcRenderer.invoke("db:add-job", job),
    updateJob: (job) => electron.ipcRenderer.invoke("db:update-job", job),
    deleteJob: (id) => electron.ipcRenderer.invoke("db:delete-job", id)
  });
  console.log("Database API exposed");
} catch (error) {
  console.error("Failed to expose Database API:", error);
}
