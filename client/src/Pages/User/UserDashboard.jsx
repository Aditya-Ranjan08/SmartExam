import axios from "axios";
import { server_url } from "../../App";
import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LogOut, BookOpen, Trophy, Key, MessageSquare, UserCircle, GraduationCap,
    ChevronRight, Clock
} from "lucide-react";
import { toast } from "react-toastify";
import { socket } from "../../socket";
import "./UserWorkspace.css";

export const UserDashboard = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            const response = await axios.get(`${server_url}/api/examinee/currentuser`, { withCredentials: true });
            if (response.data.success) {
                setCurrentUser(response.data.user);
            }
        } catch (error) {
            console.error("User fetch error");
        }
    };

    const menuItems = [
        { name: "My Profile", path: "/userdashboard/profile", icon: <UserCircle size={20} /> },
        { name: "My Exams", path: "/userdashboard/myexams", icon: <BookOpen size={20} /> },
        { name: "My Result", path: "/userdashboard/result", icon: <Trophy size={20} /> },
        { name: "Security", path: `/userdashboard/changepassword/${currentUser?._id}`, icon: <Key size={20} /> },
        { name: "Messages", path: "/userdashboard/message", icon: <MessageSquare size={20} /> },
    ];

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${server_url}/api/examinee/logout`, {}, { withCredentials: true });
            if (response.data.success) {
                const user = JSON.parse(localStorage.getItem("user"));

                if (user) {
                    socket.emit("student_logout", user._id);
                }
                socket.disconnect();
                localStorage.removeItem("user");
                toast.success(response.data.message || "Logged out successfully");
                navigate("/");
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?._id) {
            console.log("📡 Dashboard mounted → checking socket");

            if (!socket.connected) {
                socket.connect(); // reconnect
            } else {
                // 🔥 VERY IMPORTANT (force emit)
                socket.emit("student_online", user._id);
            }
        }
    }, []);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                const user = JSON.parse(localStorage.getItem("user"));

                if (user?._id) {
                    console.log("Tab active in Dashboard");

                    if (!socket.connected) {
                        socket.connect();
                    } else {
                        socket.emit("student_online", user._id);
                    }
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    const activeLink = "student-nav-link student-nav-link-active flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-bold";
    const normalLink = "student-nav-link flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group";
    const currentSection = menuItems.find((item) => (
        location.pathname === item.path ||
        (item.name === "Security" && location.pathname.includes("/changepassword/"))
    ))?.name || "Overview";

    return (
        <div className="student-workspace flex h-screen font-sans overflow-hidden">

            <aside className="student-sidebar w-72 flex flex-col h-screen sticky top-0 shrink-0 z-20">

                <div className="student-sidebar-brand p-6 flex items-center gap-3">
                    <div className="student-brand-mark p-2 rounded-xl">
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight">
                        Smart<span className="text-blue-600">Exam</span>
                    </span>
                </div>

                <div className="student-sidebar-profile p-5 text-center">
                    <div className="relative inline-block group">
                        <div className="student-sidebar-avatar w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden transition-transform group-hover:scale-105 hover:cursor-pointer"
                            onClick={() => navigate("/userdashboard")}>
                            {currentUser?.profileImage ? (
                                <img src={currentUser.profileImage} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-2xl font-bold uppercase">
                                    {currentUser?.name?.charAt(0) || "S"}
                                </div>
                            )}
                        </div>
                        <div className="student-online-indicator absolute bottom-3 right-0 w-4 h-4 rounded-full"></div>
                    </div>
                    <h2 className="font-bold text-lg truncate px-2 leading-tight">{currentUser?.name || "Candidate"}</h2>
                    <p className="student-sidebar-email text-[10px] truncate tracking-wide mt-1">{currentUser?.email || "abc@example.com"}</p>
                </div>

                <nav className="student-sidebar-nav flex-grow px-5 py-4 space-y-2 overflow-y-auto no-scrollbar">
                    <p className="student-menu-label text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2">Workspace</p>
                    {menuItems.map((item, index) => (
                        <NavLink key={index} to={item.path} className={({ isActive }) => isActive ? activeLink : normalLink}>
                            <span className="student-nav-icon transition-transform">{item.icon}</span>
                            <span className="text-sm tracking-wide">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="student-sidebar-footer p-5 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="student-logout flex items-center justify-center space-x-2 w-full p-3 rounded-xl transition-all duration-300 font-bold text-sm"
                    >
                        <LogOut size={16} />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>

            <div className="student-workspace-main flex-1 flex flex-col h-screen overflow-hidden">

                <header className="student-workspace-header px-8 py-4 flex justify-between items-center shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="student-date hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-r pr-4">
                            <Clock size={14} />
                            {new Date().toLocaleDateString('en-GB')}
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">
                            Welcome back, <span className="student-accent">{currentUser?.name?.split(' ')[0] || "Student"}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/userdashboard/profile")}>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold leading-none capitalize">{currentUser?.name || "Student"}</p>
                                <p className="student-role-label text-[9px] font-bold uppercase tracking-wider mt-1">Student account</p>
                            </div>
                            <div className="student-header-avatar w-10 h-10 rounded-xl flex items-center justify-center font-bold overflow-hidden">
                                {currentUser?.profileImage ? <img src={currentUser.profileImage} alt="" className="h-full w-full object-cover" /> : currentUser?.name?.charAt(0) || "S"}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="student-workspace-content flex-1 overflow-y-auto no-scrollbar px-8 py-7">
                    <div className="student-workspace-page max-w-6xl mx-auto">
                        <div className="student-breadcrumb flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-6">
                            <span>User Dashboard</span>
                            <ChevronRight size={10} />
                            <span className="student-accent">{currentSection}</span>
                        </div>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};