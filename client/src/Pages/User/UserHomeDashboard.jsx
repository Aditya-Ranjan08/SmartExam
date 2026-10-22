import { useNavigate } from "react-router-dom";
import { AttemptedPassedGraph } from "../../Components/AttemptedPassedGraph";
import { BookOpen, Trophy, Clock, ArrowRight, XCircle, CheckCircle } from 'lucide-react';
import axios from "axios";
import { useEffect, useState } from "react";
import { server_url } from "../../App";

export const UserHomeDashboard = () => {

  const navigate = useNavigate();

  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch Dashboard Data
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${server_url}/api/userdashboard/std-dashboard`, {
        withCredentials: true
      });

      if (res.data.success) {
        setStatsData(res.data.data);
        console.log("statesd data :", res.data.data)
      }

    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 🔥 Loading UI
  if (loading || !statsData) {
    return (
      <div className="student-dashboard-loading flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  // 🔥 Stats Cards
  const stats = [
    {
      label: 'Total Exams',
      value: statsData.totalExams,
      icon: <BookOpen className="text-blue-600" />,
      bg: 'bg-blue-100'
    },
    {
      label: 'Attempted',
      value: statsData.attemptedCount,
      icon: <Trophy className="text-yellow-600" />,
      bg: 'bg-violet-100'
    },
    {
      label: 'Missed',
      value: statsData.missedCount,
      icon: <Clock className="text-blue-600" />,
      bg: 'bg-blue-100'
    },
    {
      label: 'Passed',
      value: statsData.passedCount,
      icon: <CheckCircle className="text-teal-600" />,
      bg: 'bg-teal-100'
    },
    {
      label: 'Failed',
      value: statsData.failedCount,
      icon: <XCircle className="text-rose-600" />,
      bg: 'bg-rose-100'
    }
  ];

  // 🔥 Performance %
  const performance = statsData.attemptedCount > 0
    ? Math.round((statsData.passedCount / statsData.attemptedCount) * 100)
    : 0;

  return (
    <div className="student-dashboard-home p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="student-dashboard-heading mb-8">
          <span className="student-eyebrow">Your learning space</span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Your progress, <span className="student-accent">at a glance.</span>
          </h2>
          <p className="student-muted">
            Review your exam activity and keep moving toward your goals.
          </p>
        </div>

        {/* 🔥 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="student-stat-card bg-white p-5 rounded-2xl border flex items-center gap-4 transition">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="student-muted text-sm">{stat.label}</p>
                <p className="student-stat-value text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 📊 Graph */}
          <div className="student-chart-card lg:col-span-2 bg-white p-6 rounded-2xl border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Performance overview</h3>
              <span className="student-muted text-sm">
                Success Rate: <b>{performance}%</b>
              </span>
            </div>

            <div className="h-80">
              <AttemptedPassedGraph
                attempted={statsData.attemptedCount}
                passed={statsData.passedCount}
                failed={statsData.failedCount}
              />
            </div>
          </div>

          {/* ⚡ Right Side */}
          <div className="space-y-6">

            {/* CTA */}
            <div className="student-next-exam-card rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Ready for your next exam?</h3>
              <p className="text-sm mb-4">
                Don't miss your upcoming tests. Stay prepared!
              </p>
              <button
                onClick={() => navigate('/userdashboard/myexams')}
                className="student-next-exam-button w-full py-3 bg-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                Go to Exams <ArrowRight size={18} />
              </button>
            </div>

            {/* Tips */}
            <div className="student-tips-card bg-white p-6 rounded-2xl border">
              <h3 className="text-lg font-bold mb-4">Exam tips</h3>
              <ul className="student-muted space-y-3 text-sm">
                <li><span>01</span> Read questions carefully</li>
                <li><span>02</span> Manage time wisely</li>
                <li><span>03</span> Stay calm and focused</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};