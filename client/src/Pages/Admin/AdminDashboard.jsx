import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server_url } from "../../config";
import axios from "axios";
import { io } from "socket.io-client";

import {
    LayoutDashboard, Users, Calendar, BookOpen,
    HelpCircle, Settings, FileText, Lock, MessageSquare, LogOut, Zap, Activity,
    Menu as MenuIcon, X as CloseIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useServerLoad } from "../../Custom Hooks/useServerLoad";
import "./AdminWorkspace.css";


export const AdminDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeExaminees, setActiveExaminees] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const serverLoad = useServerLoad();

    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${server_url}/api/admin/logout`, {}, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message || "Session Terminated");
                navigate("/adminlogin");
            }
        } catch {
            toast.error("Failed to logout");
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    // Formatted Data
    const formattedDate = currentTime.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    const formattedTime = currentTime.toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    const menu = [
        { name: "Dashboard", path: "/adminDashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Examinee", path: "/adminDashboard/examinee", icon: <Users size={18} /> },
        { name: "Session", path: "/adminDashboard/session", icon: <Calendar size={18} /> },
        { name: "Subject", path: "/adminDashboard/subject", icon: <BookOpen size={18} /> },
        { name: "Question Bank", path: "/adminDashboard/question", icon: <HelpCircle size={18} /> },
        { name: "Manage Exams", path: "/adminDashboard/examination", icon: <Settings size={18} /> },
        { name: "Reports", path: "/adminDashboard/reportgeneration", icon: <FileText size={18} /> },
        { name: "Messages", path: "/adminDashboard/messagereply", icon: <MessageSquare size={18} /> },
        { name: "Security", path: "/adminDashboard/adminChangePassword", icon: <Lock size={18} /> },
    ];
    const currentSection = menu.find((item) => item.path.toLowerCase() === location.pathname.toLowerCase())?.name || "Dashboard";

    useEffect(() => {
        // 1. Socket Connection banayein (Backend URL ke saath)
        const socket = io(server_url, {
            withCredentials: true
        });

        // 2. Server se aane wale count ko listen karein
        socket.on("updateActiveCount", (count) => {
            console.log("New Active Count:", count);
            setActiveExaminees(count);
        });

        // 3. Cleanup: Jab admin dashboard close kare toh socket disconnect ho jaye
        return () => {
            socket.off("updateActiveCount");
            socket.disconnect();
        };
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-[#edf3ff] font-sans selection:bg-cyan-100">

            {sidebarOpen && <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden" />}
            <aside className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-blue-900/10 bg-gradient-to-b from-[#17366f] via-[#102b5b] to-[#0b1b3c] text-blue-50 shadow-2xl transition-transform duration-300 lg:relative lg:z-20 lg:w-[270px] lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

                {/* SmartExam Logo Section */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950 shadow-lg shadow-blue-500/20 ring-1 ring-white/10 transition-transform group-hover:rotate-12">
                            <Zap size={22} className="text-white fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter leading-none text-white">
                                Smart<span className="text-cyan-300">Exam</span>
                            </span>
                            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-blue-100/65">Admin workspace</span>
                        </div>
                    </div>
                    <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"><CloseIcon size={18} /></button>
                </div>

                {/* Navigation Menu: Added 'no-scrollbar' to allow scrolling without bars */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4 no-scrollbar">
                    <p className="mb-3 ml-3 mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100/55">Workspace</p>
                    {menu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/adminDashboard"}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-950/20 ring-1 ring-inset ring-white/15"
                                    : "text-blue-100/75 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                            <span className="text-[13px] font-semibold">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Bottom: Logout */}
                <div className="border-t border-white/10 bg-[#081735]/25 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200/20 bg-rose-300/10 py-3 text-xs font-bold uppercase tracking-widest text-rose-100 transition-all duration-300 hover:border-rose-300 hover:bg-rose-500 hover:text-white"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="relative z-10 flex items-center justify-between border-b border-blue-100 bg-[#f8faff]/95 px-4 py-3 shadow-sm shadow-blue-950/[0.03] backdrop-blur-xl sm:px-6 lg:px-8">

                    {/* Left Side: Page Context & Welcome */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-6">
                        <button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600 lg:hidden"><MenuIcon size={19} /></button>
                        <div>
                            <h1 className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
                                {currentSection}
                            </h1>
                            <div className="mt-0.5 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="truncate text-[9px] font-bold uppercase tracking-widest text-slate-400 sm:text-[10px]">
                                    SmartExam admin workspace
                                </span>
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className="hidden h-8 w-px bg-slate-200 md:block"></div>

                        {/* Live System Stats */}
                        <div className="hidden items-center gap-6 lg:flex">
                            <div className="flex flex-col gap-1 w-28 px-4 border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Load</span>
                                    <span className={`text-[10px] font-bold ${serverLoad > 80 ? 'text-red-500' : 'text-slate-700'}`}>
                                        {serverLoad}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-in-out ${serverLoad > 80 ? 'bg-red-500' : serverLoad > 50 ? 'bg-amber-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${serverLoad}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex flex-col border-l border-slate-200 px-6">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                    Active Examinees
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Activity size={14} className="text-blue-500" />
                                    <span className="text-xs font-bold text-slate-700">
                                        {activeExaminees.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Admin Profile & Date */}
                    <div className="flex items-center gap-3 sm:gap-5">

                        <div className="hidden items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm transition-all hover:border-blue-200 hover:bg-white sm:flex">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors">
                                <Calendar size={16} />
                            </div>

                            <div className="flex flex-col border-r border-slate-200 pr-4">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">System Date</span>
                                <span className="text-xs font-bold text-slate-700 leading-none mt-1">
                                    {formattedDate}
                                </span>
                            </div>

                            <div className="flex flex-col pl-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Live Time</span>
                                <span className="text-xs font-mono font-bold text-blue-600 leading-none mt-1">
                                    {formattedTime}
                                </span>
                            </div>
                        </div>

                    </div>
                </header>

                {/* Main Viewport: Added 'no-scrollbar' so page content scrolls cleanly */}
                <main className="admin-content flex-1 overflow-y-auto bg-[#edf3ff] p-4 no-scrollbar sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
};