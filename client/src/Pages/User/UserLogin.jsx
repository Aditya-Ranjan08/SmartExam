import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { server_url } from '../../App';
import { toast } from 'react-toastify';
import { Lock, Mail, ShieldCheck, X, ArrowLeft, Loader2, EyeOff, Eye, GraduationCap, ArrowRightToLine } from 'lucide-react';
import { socket } from '../../socket';
import { StudentAuthShowcase } from './StudentAuthShowcase';
import './UserAuth.css';

export const UserLogin = () => {
    // --- States ---
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Forgot Password States
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);

    const navigate = useNavigate();

    // --- Handlers ---
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const closeModal = () => {
        setShowModal(false);
        setStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
    };

    // Step 1: Send OTP
    const handleSendOtp = async () => {
        if (!forgotEmail) return toast.error("Please enter your email");
        setOtpLoading(true);
        try {
            const res = await axios.post(`${server_url}/api/examinee/forgot-password`, { email: forgotEmail });
            toast.success(res.data.message || "OTP sent successfully");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp) return toast.error("Please enter OTP");
        setOtpLoading(true);
        try {
            const res = await axios.post(`${server_url}/api/examinee/verify-otp`, { email: forgotEmail, otp });
            toast.success(res.data.message || "OTP Verified");
            setStep(3);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
        setOtpLoading(true);
        try {
            const res = await axios.post(`${server_url}/api/examinee/reset-password`, {
                email: forgotEmail,
                password: newPassword,
                confirmPassword
            });
            toast.success(res.data.message || "Password updated successfully");
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${server_url}/api/examinee/login`, form, { withCredentials: true });
            if (res.data.success) {
                const user = res.data.user;
                console.log("User ", user)
                localStorage.setItem("user", JSON.stringify(user));
                // connect once
                if (!socket.connected) {
                    socket.connect();
                }
                toast.success(res.data.message || "Login successful");
                navigate("/userdashboard");

            }
        } catch (er) {
            toast.error(er.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="student-auth-page min-h-screen">
            <div className="student-auth-layout grid min-h-screen grid-cols-1 lg:grid-cols-12">

                <StudentAuthShowcase />

                {/* Right Side: Login Form */}
                <div className="student-auth-form-side flex items-center justify-center px-5 py-10 sm:px-10 lg:col-span-6 lg:px-8">
                    <div className="student-auth-card w-full max-w-[440px] rounded-3xl border border-white bg-white/90 p-7 shadow-[0_24px_80px_rgba(54,91,175,.14)] backdrop-blur sm:p-10">
                        <header className="mb-8 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-blue-600">
                                <GraduationCap size={34} />
                            </div>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#101b3c]">Student <span className="text-blue-600">Login</span></h2>
                            <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-slate-500">Enter your credentials to continue with your exam journey.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#26385f] ml-1">Username / Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email" name="email" value={form.email} onChange={handleChange} required
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#d7e0f5] rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-semibold text-[#26385f]">Password</label>
                                    <button type="button" onClick={() => setShowModal(true)} className="text-xs font-semibold text-blue-600 hover:underline">Forgot Password?</button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-12 py-3 bg-white border border-[#d7e0f5] rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:brightness-105 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRightToLine size={18} /> Login</>}
                            </button>
                        </form>

                        <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                            <p className="text-sm text-slate-500">
                                Don&apos;t have an account? <Link to="/userregister" className="font-semibold text-blue-600 hover:underline">Create an account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Re-styled Forgot Password Modal --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal} />

                    <div className="relative w-full max-w-sm rounded-3xl border border-blue-100 bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <button onClick={closeModal} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>

                        <div className="text-center mb-6">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                {step === 1 && <Mail size={24} />}
                                {step === 2 && <ShieldCheck size={24} />}
                                {step === 3 && <Lock size={24} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {step === 1 ? "Reset Password" : step === 2 ? "Verify identity" : "New Password"}
                            </h3>
                            <p className="text-xs text-gray-500 mt-2 px-4">
                                {step === 1 ? "Enter your email and we'll send an OTP." : step === 2 ? `Enter the code sent to ${forgotEmail}` : "Almost done! Set your new password."}
                            </p>
                        </div>

                        {/* Modal Step Content (Keeping your logic same but with new styling) */}
                        <div className="space-y-4">
                            {step === 1 && (
                                <>
                                    <input type="email" placeholder="Email Address" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none" />
                                    <button onClick={handleSendOtp} disabled={otpLoading} className="w-full rounded-xl bg-blue-600 py-3 text-white font-bold hover:bg-blue-700 flex justify-center items-center shadow-lg shadow-blue-100">
                                        {otpLoading ? <Loader2 className="animate-spin" size={18} /> : "Get Reset Code"}
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <input type="text" maxLength="6" placeholder="0 0 0 0 0 0" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full text-center text-xl tracking-[0.3em] font-black rounded-xl border border-gray-200 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none" />
                                    <button onClick={handleVerifyOtp} disabled={otpLoading} className="w-full rounded-xl bg-blue-600 py-3 text-white font-bold hover:bg-blue-700 flex justify-center items-center shadow-lg shadow-blue-100">
                                        {otpLoading ? <Loader2 className="animate-spin" size={18} /> : "Verify Code"}
                                    </button>
                                    <button onClick={() => setStep(1)} className="w-full text-xs text-gray-400 font-medium hover:text-blue-600 flex items-center justify-center gap-1"><ArrowLeft size={14} /> Use different email</button>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none" />
                                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none" />
                                    <button onClick={handleResetPassword} disabled={otpLoading} className="w-full rounded-xl bg-blue-600 py-3 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">
                                        {otpLoading ? <Loader2 className="animate-spin" size={18} /> : "Reset Password"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};