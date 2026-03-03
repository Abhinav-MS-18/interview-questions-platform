import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  PlusCircle,
  Building2,
  LayersIcon,
  Star,
  Users,
  Zap,
  Shield,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { getStats } from "../services/api";

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc, icon }) => (
  <div className="flex flex-col items-center text-center fade-in">
    <div className="relative mb-5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
        {number}
      </div>
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">
      {desc}
    </p>
  </div>
);

const Home = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    companies: 0,
    roles: 0,
  });

  useEffect(() => {
    getStats()
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-1.5 text-sm text-indigo-200 mb-8 fade-in">
            <Zap size={14} className="text-indigo-400" />
            Real questions from real interviews
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight fade-in">
            Ace Your Next
            <span className="block gradient-text mt-1">
              Technical Interview
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed fade-in ">
            Browse thousands of interview questions shared by engineers who've
            been through the process. Filter by company, role, round, and
            difficulty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-900/50 hover:-translate-y-1 hover:shadow-2xl transition-all text-lg"
            >
              <Search size={20} />
              Browse Questions
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl hover:-translate-y-1 transition-all text-lg backdrop-blur-sm"
            >
              <PlusCircle size={20} />
              Submit a Question
            </Link>
          </div>

          {/* Floating stats */}
          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center">
            {[
              {
                label: "Questions",
                value: stats.totalQuestions.toLocaleString(),
              },
              { label: "Companies", value: stats.companies.toLocaleString() },
              { label: "Roles", value: stats.roles.toLocaleString() },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4 float"
              >
                <div className="text-3xl font-black text-white">
                  {s.value || "—"}
                </div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-800 mb-3">
            Everything You Need to Prepare
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            A powerful platform built to help you land your dream job with real
            interview data.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Building2 size={24} />}
            title="Company-Wise Questions"
            desc="Filter questions by top companies like Google, Microsoft, Amazon, and hundreds more."
          />
          <FeatureCard
            icon={<LayersIcon size={24} />}
            title="Round-Wise Prep"
            desc="Targeted preparation for each interview round — technical, HR, system design, and more."
          />
          <FeatureCard
            icon={<Star size={24} />}
            title="Real Experiences"
            desc="All questions are submitted by engineers who actually went through these interviews."
          />
          <FeatureCard
            icon={<TrendingUp size={24} />}
            title="Smart Filtering"
            desc="Filter by difficulty, year, role, question type, and keyword to zero in on what matters."
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-800 mb-3">
              How It Works
            </h2>
            <p className="text-slate-500">
              Three simple steps to supercharge your interview prep.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-8 left-[22%] right-[22%] h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300" />
            <StepCard
              number="1"
              icon={<Search size={26} />}
              title="Browse Questions"
              desc="Filter the library by company, role, or round to find exactly what you need."
            />
            <StepCard
              number="2"
              icon={<BookOpen size={26} />}
              title="Learn & Practice"
              desc="Read real answers and strategies from engineers who aced these interviews."
            />
            <StepCard
              number="3"
              icon={<PlusCircle size={26} />}
              title="Contribute Back"
              desc="Share your own interview experience to help the next engineer prepare."
            />
          </div>

          <div className="text-center mt-12">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Start Browsing <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-gradient-to-br from-slate-800 to-indigo-900 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 pointer-events-none" />
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/30 flex items-center justify-center">
                <Users size={28} className="text-indigo-300" />
              </div>
            </div>
            <h2 className="text-3xl font-black mb-3">Join the Community</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Every question you submit helps hundreds of engineers. Be part of
              the movement to make interview prep accessible for everyone.
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 hover:-translate-y-1 transition-all shadow-xl"
            >
              <PlusCircle size={19} />
              Submit Your First Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
