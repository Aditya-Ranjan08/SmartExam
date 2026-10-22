import axios from 'axios';
import { createElement, useState, useEffect } from 'react';
import { server_url } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, ShieldCheck, Loader2, Users, ArrowRightToLine, GraduationCap, FileText, ChartNoAxesColumnIncreasing, UserRound, CircleHelp } from 'lucide-react';

export const AdminLogin = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Browser tab title update
    useEffect(() => {
        document.title = "SmartExam | Secure Admin Access";
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${server_url}/api/admin/login`, form, { withCredentials: true });
            if (res.data.success) {
                toast.success("Authentication Successful");
                navigate("/admindashboard");
            } else {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            toast.error('Login failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#f2f5ff] font-sans text-slate-900 selection:bg-blue-100 lg:h-dvh lg:min-h-0 lg:flex-row lg:overflow-hidden">
            <section className="relative flex min-h-[560px] flex-col overflow-hidden bg-[#061334] px-7 py-8 text-white sm:px-12 lg:h-full lg:min-h-0 lg:w-1/2 lg:px-8 lg:py-5 xl:px-12">
                <div className="pointer-events-none absolute -right-28 -top-32 h-[360px] w-[360px] rounded-full bg-blue-600/20 blur-[1px]" />
                <div className="pointer-events-none absolute -bottom-48 -left-32 h-[360px] w-[360px] rounded-full bg-indigo-700/30" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

                <header className="relative z-10 flex items-center justify-between gap-4">
                    <Link to="/adminlogin" className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-lg shadow-blue-900/40">
                            <GraduationCap size={29} />
                        </span>
                        <span>
                            <span className="block text-xl font-extrabold tracking-tight sm:text-2xl">Smart<span className="text-blue-400">Exam</span></span>
                            <span className="block text-[10px] text-blue-100/70 sm:text-xs">Online Examination Management System</span>
                        </span>
                    </Link>
                    <span className="hidden text-[10px] font-medium tracking-wide text-blue-100/75 sm:block">Secure&nbsp; • &nbsp;Smart&nbsp; • &nbsp;Simple</span>
                </header>

                <div className="relative z-10 mt-12 flex flex-1 flex-col justify-center lg:mt-0 lg:min-h-0 lg:py-3">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-4xl">
                            Smarter Exam<br />Management for a<br />
                            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Brighter Future</span>
                        </h1>
                        <p className="mt-3 max-w-md text-sm leading-6 text-blue-100/75 lg:mt-2 lg:text-xs lg:leading-5">
                            SmartExam helps educational institutions conduct online exams, manage students, questions and results — all in one place.
                        </p>

                        <div className="mt-6 grid max-w-md grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-4 lg:grid-cols-2 lg:gap-y-2">
                            {[
                                { icon: Users, title: "Manage Users", description: "Control admin, faculty & students", color: "from-blue-500 to-blue-700" },
                                { icon: FileText, title: "Create Exams", description: "Set up and schedule exams easily", color: "from-sky-500 to-blue-700" },
                                { icon: CircleHelp, title: "Question Bank", description: "Build and organize questions", color: "from-indigo-500 to-violet-700" },
                                { icon: ChartNoAxesColumnIncreasing, title: "Track Results", description: "View performance and reports", color: "from-blue-500 to-indigo-700" },
                            ].map(({ icon: Icon, title, description, color }) => (
                                <div key={title} className="flex items-center gap-3">
                                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg shadow-blue-950/30`}>
                                        {createElement(Icon, { size: 20 })}
                                    </span>
                                    <span>
                                        <span className="block text-xs font-semibold text-white">{title}</span>
                                        <span className="mt-0.5 block text-[10px] leading-4 text-blue-100/65">{description}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative mt-6 hidden h-48 max-w-xl overflow-hidden rounded-2xl border border-blue-200/20 bg-slate-950 shadow-2xl shadow-blue-950/40 sm:block lg:mt-4 lg:h-[clamp(130px,22vh,210px)]">
                        <img
                            src="/smart-exam-laptop.jpg"
                            alt="Laptop at a desk, ready for online exam management"
                            className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#061334]/85 via-[#061334]/25 to-transparent" />
                        <div className="absolute inset-y-0 left-0 flex max-w-[70%] flex-col justify-center p-5 sm:p-7">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">SmartExam workspace</span>
                            <span className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">Learn.<br />Practice.<br /><span className="text-blue-300">Grow.</span></span>
                        </div>
                    </div>
                </div>

                <footer className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-blue-100/60 lg:mt-3">
                    <span>© {new Date().getFullYear()} SmartExam</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-blue-300" /> Secure administrator access</span>
                </footer>
            </section>

            <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f7ff] via-white to-[#edf1ff] px-5 py-10 sm:px-10 lg:h-full lg:min-h-0 lg:w-1/2 lg:px-6 lg:py-4 xl:px-10">
                <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-blue-100/80" />
                <div className="pointer-events-none absolute -bottom-36 -left-24 h-72 w-72 rounded-full bg-indigo-100/60" />
                <div className="relative z-10 w-full max-w-[460px] rounded-2xl border border-white/90 bg-white/90 p-6 shadow-[0_24px_80px_rgba(54,91,175,.14)] backdrop-blur sm:p-8 lg:p-6 xl:p-8">
                    <div className="mb-5 text-center lg:mb-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 lg:h-10 lg:w-10">
                            <UserRound size={29} />
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#101b3c] lg:mt-2 lg:text-2xl">Admin <span className="text-blue-600">Login</span></h2>
                        <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-slate-500 lg:mt-1 lg:text-xs">Welcome back! Please login to your admin account to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-2.5">
                        <div className="space-y-1.5">
                            <label htmlFor="admin-email" className="text-xs font-semibold text-[#26385f]">Username / Email</label>
                            <div className="relative">
                                <UserRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="admin-email"
                                    type="email"
                                    name="email"
                                    autoComplete="username"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-[#d7e0f5] bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-xs placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="admin-password" className="text-xs font-semibold text-[#26385f]">Password</label>
                            <div className="relative">
                                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="admin-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-lg border border-[#d7e0f5] bg-white py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-xs placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? <><Loader2 className="animate-spin" size={18} /> Signing in…</> : <><ArrowRightToLine size={18} /> Login</>}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-3 text-[10px] font-medium text-slate-500">
                        <span className="h-px flex-1 bg-slate-200" />
                        <span className="flex items-center gap-1.5 whitespace-nowrap"><ShieldCheck size={13} className="text-blue-600" /> Only Authorized Personnel</span>
                        <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-[#f3f6fc] px-3.5 py-3 text-[11px] leading-4 text-slate-500">
                        <ShieldCheck size={17} className="shrink-0 text-slate-400" />
                        <span>This is a secure area. Unauthorized access is prohibited.</span>
                    </div>

                    <p className="mt-5 text-center text-xs text-slate-500">
                        Need administrator access?{" "}
                        <Link to="/adminregister" className="font-semibold text-blue-600 transition hover:text-indigo-700">Request access</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};