import watch from "watch"
import {fork, spawn} from  "child_process"

watch.createMonitor('./server/src', function (monitor) {
  let mainProcess

  function start() {
    spawn("yr", ["compile:api"], {stdio: "inherit"})
      .on("exit", function () {
        mainProcess = fork("./server/dist", {stdio: "inherit", env: process.env})
        mainProcess.on("exit", start)
      })
  }

  function restart(reason) {
    if (reason) {
      console.log(`\n\nRestarting by ${reason} files`)
    }
    mainProcess.kill()
  }

  monitor.on("created", () => restart("created new"))
  monitor.on("changed", () => restart("changed"))
  monitor.on("removed", () => restart("removed"))

  start()
})
