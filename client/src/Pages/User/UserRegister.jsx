import axios from 'axios';
import { createElement, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { server_url } from '../../config';
import { toast } from 'react-toastify';
import {
    User, Mail, School, BookOpen, GitBranch, Calendar,
    Phone, Lock, Eye, EyeOff, ChevronRight, ChevronLeft,
    Camera
} from 'lucide-react';
import { StudentAuthShowcase } from './StudentAuthShowcase';
import './UserAuth.css';

const InputWrapper = ({ icon: Icon, children }) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
            {createElement(Icon, { size: 18 })}
        </div>
        {children}
    </div>
);

export const UserRegister = () => {
    const [step, setStep] = useState(1);
    const [form, setform] = useState({
        name: '', email: '', college: '', course: '',
        branch: '', year: '', phone: '', session: '',
        password: '', status: 'inactive'
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [allSessions, setAllSessions] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableBranches, setAvailableBranches] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get(`${server_url}/api/session`);
                setAllSessions(res.data.result);
            } catch {
                toast.error("Failed to load session data");
            }
        };
        fetchSessions();
    }, []);

    const handleSessionChange = (e) => {
        const sessionName = e.target.value;
        const filtered = allSessions.filter(s => s.name === sessionName);
        const courses = [...new Set(filtered.map(s => s.course))];
        setAvailableCourses(courses);
        setAvailableBranches([]);
        setform({ ...form, session: sessionName, course: '', branch: '', year: '' });
    };

    const handleCourseChange = (e) => {
        const courseName = e.target.value;
        const filtered = allSessions.filter(s => s.name === form.session && s.course === courseName);
        const branches = [...new Set(filtered.map(s => s.branch))];
        setAvailableBranches(branches);
        setform({ ...form, course: courseName, branch: '', year: '' });
    };

    const handleBranchChange = (e) => {
        const branchName = e.target.value;
        const filteredRecords = allSessions.filter(s => s.name === form.session && s.course === form.course && s.branch === branchName);
        const years = [...new Set(filteredRecords.map(s => s.year))];
        setAvailableYears(years);
        const defaultYear = years.length === 1 ? years[0] : '';
        setform({ ...form, branch: branchName, year: defaultYear });
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
        if (e.target.name === 'password') setPasswordError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const nextStep = () => {
        if (!form.name || !form.email || !form.college || !form.session) {
            toast.error("Please fill all fields in Step 1");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== confirmPassword) {
            setPasswordError("Passwords do not match!");
            return;
        }
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));
        if (image) formData.append("profileImage", image);

        setLoading(true);
        try {
            const res = await axios.post(`${server_url}/api/examinee/register`, formData);
            toast.success(res.data.message || "Registration Successful!");
            navigate("/");
        } catch (er) {
            toast.error(er.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="student-auth-page student-auth-register-page min-h-screen">
            <div className="student-auth-layout grid min-h-screen grid-cols-1 lg:grid-cols-12">

                <StudentAuthShowcase />

                {/* Right Side: Form (Spacing optimized) */}
                <div className="student-auth-form-side min-h-screen overflow-y-auto px-5 py-8 sm:px-10 lg:col-span-6 lg:px-8">
                    <div className="student-auth-card mx-auto my-auto w-full max-w-[520px] rounded-3xl border border-white bg-white/90 p-6 shadow-[0_24px_80px_rgba(54,91,175,.14)] backdrop-blur sm:p-8">
                        <header className="mb-6 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-blue-600">
                                <User size={23} />
                            </div>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#101b3c]">Create your <span className="text-blue-600">account</span></h2>
                            <p className="mt-1 text-xs text-slate-500">A few details to get you started.</p>

                            {/* Compact Step Indicator */}
                            <div className="mt-4 flex items-center gap-2">
                                <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-100'}`} />
                                <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-100'}`} />
                            </div>
                            <p className="mt-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Step {step} of 2 · {step === 1 ? "Personal details" : "Academic & security details"}
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {step === 1 ? (
                                <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                                    {/* Compact Profile Upload */}
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="relative group">
                                            <div className="w-16 h-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                                                {preview ? (
                                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Camera className="text-gray-300" size={24} />
                                                )}
                                            </div>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Photo</span>
                                    </div>

                                    <div className="space-y-3">
                                        <InputWrapper icon={User}>
                                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" />
                                        </InputWrapper>

                                        <InputWrapper icon={Mail}>
                                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" />
                                        </InputWrapper>

                                        <InputWrapper icon={School}>
                                            <input type="text" name="college" value={form.college} onChange={handleChange} placeholder="College" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" />
                                        </InputWrapper>

                                        <InputWrapper icon={Calendar}>
                                            <select name="session" value={form.session} onChange={handleSessionChange} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none appearance-none focus:border-blue-500 transition-all">
                                                <option value="">Select Session</option>
                                                {[...new Set(allSessions.map(s => s.name))].map(name => <option key={name} value={name}>{name}</option>)}
                                            </select>
                                        </InputWrapper>
                                    </div>

                                    <button type="button" onClick={nextStep} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                                        Continue <ChevronRight size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-right-2 duration-300 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputWrapper icon={BookOpen}>
                                            <select name="course" value={form.course} onChange={handleCourseChange} className="w-full pl-9 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none appearance-none">
                                                <option value="">Course</option>
                                                {availableCourses.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </InputWrapper>
                                        <InputWrapper icon={GitBranch}>
                                            <select name="branch" value={form.branch} onChange={handleBranchChange} className="w-full pl-9 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none appearance-none">
                                                <option value="">Branch</option>
                                                {availableBranches.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </InputWrapper>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <InputWrapper icon={Calendar}>
                                            <select name="year" value={form.year} onChange={handleChange} className="w-full pl-9 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none appearance-none">
                                                <option value="">Year</option>
                                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </InputWrapper>
                                        <InputWrapper icon={Phone}>
                                            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                                        </InputWrapper>
                                    </div>

                                    <InputWrapper icon={Lock}>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 text-gray-400">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </InputWrapper>

                                    <InputWrapper icon={Lock}>
                                        <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }} placeholder="Confirm Password" className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border ${passwordError ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm outline-none`} />
                                    </InputWrapper>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-lg font-bold hover:bg-gray-50 text-sm transition-all flex items-center justify-center gap-1"
                                        >
                                            <ChevronLeft size={16} /> Back
                                        </button>
                                        <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md text-sm transition-all">
                                            {loading ? "Registering..." : "Create Account"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        <p className="mt-4 text-center text-xs text-gray-400">
                            Already registered? <Link to="/" className="text-blue-600 font-bold hover:underline">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};