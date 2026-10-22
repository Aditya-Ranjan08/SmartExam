import { createElement } from 'react';
import { BookOpen, GraduationCap, ShieldCheck, TrendingUp } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: 'Secure & Reliable',
        description: 'Your data is always protected.',
        color: 'blue',
    },
    {
        icon: BookOpen,
        title: 'Flexible Learning',
        description: 'Learn at your own pace.',
        color: 'violet',
    },
    {
        icon: TrendingUp,
        title: 'Track Progress',
        description: 'Monitor your performance.',
        color: 'teal',
    },
];

export const StudentAuthShowcase = () => (
    <aside className="student-auth-brand relative hidden flex-col justify-between overflow-hidden px-8 py-7 text-white lg:col-span-6 lg:flex xl:px-12">
        <div className="student-auth-brand-header relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/20">
                    <GraduationCap size={30} />
                </span>
                <span>
                    <span className="block text-[26px] font-extrabold tracking-tight text-[#101b3c]">Smart<span className="text-blue-600">Exam</span></span>
                    <span className="block text-[10px] text-slate-500">Online Examination Management System</span>
                </span>
            </div>
            <span className="student-auth-handwriting student-auth-top-note">Learn · Take Exam · Grow</span>
        </div>

        <div className="student-auth-showcase relative z-10">
            <div className="student-auth-brand-content">
                <h1 className="student-auth-title max-w-lg font-bold leading-[1.08] tracking-tight text-[#101b3c]">
                    <span>Start Your</span>
                    <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Learning Journey</span>
                    <span>with SmartExam</span>
                </h1>
                <p className="student-auth-description mt-4 max-w-md text-sm leading-6 text-slate-500">
                    Register now and get access to online exams, practice tests, instant results and more.
                </p>

                <div className="student-auth-feature-list mt-7 space-y-3">
                    {features.map(({ icon: Icon, title, description, color }) => (
                        <div key={title} className="student-auth-feature flex items-center gap-3">
                            <span className={`student-auth-feature-icon student-auth-feature-icon-${color} flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl`}>
                                {createElement(Icon, { size: 19 })}
                            </span>
                            <span>
                                <span className="block text-xs font-semibold text-[#17264c]">{title}</span>
                                <span className="mt-0.5 block text-[10px] text-slate-500">{description}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="student-auth-photo-scene" aria-hidden="true">
                <span className="student-auth-photo-glow" />
                <img
                    src="/smart-exam-student-hero.svg"
                    alt=""
                    className="student-auth-photo"
                />
                <span className="student-auth-photo-check">
                    <ShieldCheck size={19} />
                </span>
            </div>
        </div>

        <div className="student-auth-brand-footer relative z-10 flex items-end justify-between">
            <p className="student-auth-handwriting student-auth-bottom-note">
                Better Learning
                <span>Brighter Future</span>
            </p>
            <span className="text-[10px] text-slate-400">© {new Date().getFullYear()} SmartExam</span>
        </div>
    </aside>
);
