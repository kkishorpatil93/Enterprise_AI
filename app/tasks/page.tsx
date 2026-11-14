'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { RemediationTask } from '@/lib/types';
import {
  KanbanSquare,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Building2,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function TasksPage() {
  const { tasks, approveTask, moveTaskStatus, createTaskFromFinding } = useNexoraStore();
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // New task modal / state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDept, setNewDept] = useState<'Data' | 'IT' | 'Security' | 'Infrastructure' | 'Executive'>('Security');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [newDueDate, setNewDueDate] = useState('2026-12-15');

  const departments = ['All', 'Data', 'IT', 'Security', 'Infrastructure', 'Executive'];

  const filteredTasks =
    departmentFilter === 'All'
      ? tasks
      : tasks.filter((t) => t.department === departmentFilter);

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createTaskFromFinding({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Manual remediation initiative',
      problemId: 14,
      department: newDept,
      priority: newPriority,
      status: 'todo',
      dueDate: newDueDate,
      approved: false, // Requires human approval!
      assignedTo: `${newDept} Lead`,
      sourceFinding: 'Executive Workflow Hub',
    });

    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  const renderTaskCard = (task: RemediationTask) => {
    const isCritical = task.priority === 'critical';
    const isHigh = task.priority === 'high';

    return (
      <div
        key={task.id}
        className="p-4 rounded-xl bg-navy-900 border border-navy-750 hover:border-navy-700 shadow-md transition-all space-y-3"
      >
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              isCritical
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : isHigh
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
            }`}
          >
            {task.priority}
          </span>
          <span className="text-[10px] font-mono text-cyan-400">{task.department}</span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{task.description}</p>
        </div>

        {/* Human Approval Gate */}
        {!task.approved ? (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <span className="text-[10px] text-amber-300 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Human Approval Pending
            </span>
            <button
              onClick={() => approveTask(task.id)}
              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-[10px] rounded transition-colors"
            >
              Approve
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-navy-800">
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3" />
              Due: {task.dueDate}
            </span>
            <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
              <ShieldCheck className="w-3 h-3" />
              Approved
            </span>
          </div>
        )}

        {/* Status Move Buttons */}
        <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-navy-800/60">
          {task.status !== 'todo' && (
            <button
              onClick={() => moveTaskStatus(task.id, 'todo')}
              className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-navy-950 border border-navy-800"
            >
              &larr; Todo
            </button>
          )}
          {task.status !== 'in_progress' && (
            <button
              onClick={() => moveTaskStatus(task.id, 'in_progress')}
              className="text-[10px] font-mono text-electric-blue hover:text-sky-300 px-2 py-0.5 rounded bg-navy-950 border border-navy-800"
            >
              In Progress &rarr;
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => moveTaskStatus(task.id, 'done')}
              className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded bg-navy-950 border border-navy-800"
            >
              Done &check;
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30">
                <KanbanSquare className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Remediation Workflow &amp; Tasks Board
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Module 08
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Turns diagnostic findings into trackable, human-approved remediation tasks across engineering, IT, data, and security teams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-electric-blue hover:bg-sky-500 text-white shadow-glow transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Remediation Task</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-navy-900 border border-navy-800">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              Department:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  departmentFilter === dept
                    ? 'bg-electric-blue text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-navy-850'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-cyan-400">
            {filteredTasks.length} Active Tasks
          </span>
        </div>

        {/* Kanban Board Columns: Todo / In Progress / Done */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Column 1: Todo */}
          <div className="rounded-2xl bg-navy-950 border border-navy-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-navy-800">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                To Do / Pending Approval
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-navy-900 border border-navy-750 text-slate-300">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task) => renderTaskCard(task))}
              {todoTasks.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No pending tasks in this department.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="rounded-2xl bg-navy-950 border border-navy-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-navy-800">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-electric-blue" />
                In Progress
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-navy-900 border border-navy-750 text-electric-blue">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => renderTaskCard(task))}
              {inProgressTasks.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No tasks currently in progress.
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Done */}
          <div className="rounded-2xl bg-navy-950 border border-navy-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-navy-800">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Completed Remediation
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-navy-900 border border-navy-750 text-emerald-400">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {doneTasks.map((task) => renderTaskCard(task))}
              {doneTasks.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No completed tasks yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Create Task */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl p-6 text-white space-y-4">
              <h3 className="text-base font-bold">Create New Remediation Task</h3>
              <form onSubmit={handleCreateTask} className="space-y-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400">Task Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g., Unify maintenance DB schema"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Description</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    placeholder="Describe specific engineering or governance actions..."
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">Owning Department</label>
                    <select
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
                    >
                      <option>Security</option>
                      <option>Infrastructure</option>
                      <option>Data</option>
                      <option>IT</option>
                      <option>Executive</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Priority Level</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-navy-800 text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-electric-blue text-white font-bold rounded-xl shadow-glow"
                  >
                    Draft Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

