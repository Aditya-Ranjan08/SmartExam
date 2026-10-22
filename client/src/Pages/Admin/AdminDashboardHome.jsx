import axios from "axios";
import { createElement, useCallback, useEffect, useState } from "react";
import { server_url } from "../../config";
import {
    BookOpen,
    Users,
    HelpCircle,
    Layers,
    RefreshCw,
    Sparkles
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Cell,
    PieChart, Pie
} from "recharts";

const metricCards = [
    { title: "Total exams", key: "totalExams", icon: BookOpen, accent: "blue" },
    { title: "Total students", key: "totalExaminees", icon: Users, accent: "violet" },
    { title: "Question bank", key: "totalQuestions", icon: HelpCircle, accent: "amber" },
    { title: "Subjects", key: "totalSubjects", icon: Layers, accent: "emerald" },
];

const accentStyles = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
};

export const AdminDashboardHome = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleFetch = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`${server_url}/api/admindashboard/`, {
                withCredentials: true
            });

            if (!res.data.success) {
                throw new Error("Dashboard data could not be loaded.");
            }
            setData(res.data.data);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError(err.response?.data?.message || err.message || "Dashboard data could not be loaded.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    const chartData = [
        { name: "Exams", value: data?.totalExams || 0, color: "#3b82f6" },
        { name: "Students", value: data?.totalExaminees || 0, color: "#8b5cf6" },
        { name: "Questions", value: data?.totalQuestions || 0, color: "#f59e0b" },
        { name: "Subjects", value: data?.totalSubjects || 0, color: "#10b981" },
    ];
    const pieData = [
        { name: "Passed", value: data?.totalPassesd || 0, color: "#10b981" },
        { name: "Failed", value: data?.totalFailed || 0, color: "#f43f5e" }
    ];

    const numberFormat = new Intl.NumberFormat();

    return (
        <div className="space-y-6 pb-6">
            <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#101b36] via-[#14264b] to-[#243e72] p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-28 h-72 w-72 rounded-full border-[40px] border-white/[0.04]" />
                <div className="pointer-events-none absolute -bottom-36 right-1/4 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
                <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100">
                            <Sparkles size={14} className="text-cyan-200" /> Admin overview
                        </span>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Your exam hub, at a glance.</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/75">
                            Monitor your examination system and keep the essentials moving.
                        </p>
                    </div>
                </div>
                <div className="relative mt-6 flex justify-end border-t border-white/10 pt-3">
                    <button
                        type="button"
                        onClick={handleFetch}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>
            </section>

            {error && (
                <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
                    <span>{error}</span>
                    <button type="button" onClick={handleFetch} className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-2 font-semibold text-rose-700 shadow-sm hover:bg-rose-100">
                        <RefreshCw size={14} /> Try again
                    </button>
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metricCards.map(({ title, key, icon: Icon, accent }) => (
                    <article
                        key={key}
                        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 transition duration-200 hover:shadow-lg hover:shadow-slate-200/60"
                    >
                        <div className="flex items-start">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${accentStyles[accent]}`}>
                                {createElement(Icon, { size: 20 })}
                            </div>
                        </div>
                        <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>
                        <div className="mt-1">
                            <p className="text-3xl font-semibold tracking-tight text-slate-900">
                                {loading ? <span className="inline-block h-9 w-20 animate-pulse rounded-lg bg-slate-100" /> : numberFormat.format(data?.[key] || 0)}
                            </p>
                        </div>
                    </article>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">
                <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-slate-900">System overview</h3>
                            <p className="mt-1 text-xs text-slate-500">A comparison of the main platform resources</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="resourceGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.65} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                                <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 8px 24px rgba(15,23,42,.08)" }} />
                                <Bar dataKey="value" name="Total" fill="url(#resourceGradient)" radius={[8, 8, 2, 2]} maxBarSize={54}>
                                    {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} fillOpacity={0.88} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
                    <div className="mb-2">
                        <h3 className="font-semibold text-slate-900">Exam outcomes</h3>
                        <p className="mt-1 text-xs text-slate-500">Pass and fail totals across completed exams</p>
                    </div>
                    <div className="relative h-[255px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={66} outerRadius={94} paddingAngle={4} stroke="none">
                                    {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 8px 24px rgba(15,23,42,.08)" }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 mb-5 flex flex-col items-center justify-center">
                            <span className="text-2xl font-semibold text-slate-900">
                                {loading ? "—" : numberFormat.format((data?.totalPassesd || 0) + (data?.totalFailed || 0))}
                            </span>
                            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Results</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-slate-500">{item.name}</span>
                                <span className="ml-auto text-sm font-semibold text-slate-800">{loading ? "—" : numberFormat.format(item.value)}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-center text-xs text-slate-400">
                        Exam attempts: <span className="font-semibold text-slate-600">{loading ? "—" : numberFormat.format(data?.totalExamAttempted || 0)}</span>
                    </p>
                </article>
            </section>
        </div>
    );
};
