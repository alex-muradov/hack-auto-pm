"use client"

import { useState, useEffect } from "react"
import socket from "@/hooks/use-socket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Circle, Clock, CheckCircle2, Phone, Calendar, User, Trash2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: number
  text: string
  status: "todo" | "progress" | "completed"
  priority?: "low" | "medium" | "high"
}

interface Call {
  id: number
  name: string
  time: string
  phone: string
  type: "client" | "team" | "meeting"
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Prepare presentation", status: "todo", priority: "high" },
    { id: 2, text: "Code review PR #123", status: "progress", priority: "medium" },
    { id: 3, text: "Update documentation", status: "completed", priority: "low" },
  ])

  const [calls, setCalls] = useState<Call[]>([
    { id: 1, name: "Alex Peterson", time: "2:00 PM", phone: "+1 999 123-45-67", type: "client" },
    { id: 2, name: "Development Team", time: "4:30 PM", phone: "Zoom meeting", type: "team" },
    { id: 3, name: "Maria Johnson", time: "6:00 PM", phone: "+1 999 987-65-43", type: "meeting" },
  ])

  const [newTask, setNewTask] = useState("")
  const [newCall, setNewCall] = useState({ name: "", time: "", phone: "" })

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask.trim(),
          status: "todo",
          priority: "medium",
        },
      ])
      setNewTask("")
    }
  }

  const moveTask = (id: number, newStatus: "todo" | "progress" | "completed") => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const addCall = () => {
    if (newCall.name.trim() && newCall.time.trim()) {
      setCalls([
        ...calls,
        {
          id: Date.now(),
          name: newCall.name.trim(),
          time: newCall.time.trim(),
          phone: newCall.phone.trim(),
          type: "client",
        },
      ])
      setNewCall({ name: "", time: "", phone: "" })
    }
  }

  const deleteCall = (id: number) => {
    setCalls(calls.filter((call) => call.id !== id))
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case "client":
        return <User className="h-3 w-3" />
      case "team":
        return <Calendar className="h-3 w-3" />
      case "meeting":
        return <Phone className="h-3 w-3" />
      default:
        return <Phone className="h-3 w-3" />
    }
  }

  useEffect(() => {
      (window as any).socket = socket;
      function handleNewTask(task) {
          setTasks((prev) => [...prev, task]);
      }

      function handleNewCall(call) {
          setCalls((prev) => [...prev, call]);
      }

      socket.on("new-task", handleNewTask);
      socket.on("new-call", handleNewCall);

      return () => {
        socket.off("new-task", handleNewTask);
        socket.off("new-call", handleNewCall);
      };
  }, []);

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const progressTasks = tasks.filter((task) => task.status === "progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Workspace
          </h1>
          <p className="text-slate-400">Manage tasks and calls in one place</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Calls Column */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Phone className="h-5 w-5 text-blue-400" />
                  Calls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Add Call Form */}
                <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <Input
                    placeholder="Name"
                    value={newCall.name}
                    onChange={(e) => setNewCall({ ...newCall, name: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-slate-200 text-sm h-8"
                  />
                  <Input
                    placeholder="Time"
                    value={newCall.time}
                    onChange={(e) => setNewCall({ ...newCall, time: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-slate-200 text-sm h-8"
                  />
                  <Input
                    placeholder="Phone"
                    value={newCall.phone}
                    onChange={(e) => setNewCall({ ...newCall, phone: e.target.value })}
                    className="bg-slate-800/50 border-slate-600 text-slate-200 text-sm h-8"
                  />
                  <Button onClick={addCall} size="sm" className="w-full bg-blue-600 hover:bg-blue-700 h-8">
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Calls List */}
                {calls.map((call) => (
                  <div
                    key={call.id}
                    className="p-3 bg-slate-700/40 rounded-lg border border-slate-600/40 group hover:bg-slate-700/60 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCallTypeIcon(call.type)}
                        <span className="text-slate-200 text-sm font-medium">{call.name}</span>
                      </div>
                      <Button
                        onClick={() => deleteCall(call.id)}
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {call.time}
                    </div>
                    {call.phone && <div className="text-xs text-slate-500 mt-1">{call.phone}</div>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Task Columns */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Todo Column */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-slate-200">
                  <div className="flex items-center gap-2">
                    <Circle className="h-5 w-5 text-slate-400" />
                    To Do
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {todoTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Add Task Form */}
                <div className="flex gap-2">
                  <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    placeholder="New task..."
                    className="bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-400"
                  />
                  <Button onClick={addTask} size="icon" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>


                <AnimatePresence>
                  {todoTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 bg-slate-700/40 rounded-lg border border-slate-600/40 group hover:bg-slate-700/60 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-slate-200 text-sm">{task.text}</span>
                          <Button
                            onClick={() => deleteTask(task.id)}
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                          <Button
                            onClick={() => moveTask(task.id, "progress")}
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-slate-400 hover:text-blue-400"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* In Progress Column */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    In Progress
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {progressTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {progressTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 group hover:bg-blue-500/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-slate-200 text-sm">{task.text}</span>
                      <Button
                        onClick={() => deleteTask(task.id)}
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => moveTask(task.id, "todo")}
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs text-slate-400 hover:text-slate-300"
                        >
                          ←
                        </Button>
                        <Button
                          onClick={() => moveTask(task.id, "completed")}
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs text-slate-400 hover:text-green-400"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Completed Column */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    Completed
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {completedTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 group hover:bg-green-500/20 transition-all opacity-75"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-slate-300 text-sm line-through">{task.text}</span>
                      <Button
                        onClick={() => deleteTask(task.id)}
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">done</Badge>
                      <Button
                        onClick={() => moveTask(task.id, "progress")}
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs text-slate-400 hover:text-blue-400"
                      >
                        ←
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
