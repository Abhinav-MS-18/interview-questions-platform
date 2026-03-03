import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <BookOpen size={18} className="text-white" />
                            </div>
                            <span className="font-bold text-xl text-white">
                                Interview<span className="text-indigo-400">Hub</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            A community platform for engineers to share and discover real interview questions from top companies.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/browse', label: 'Browse Questions' },
                                { to: '/submit', label: 'Submit Question' },
                            ].map((l) => (
                                <li key={l.to}>
                                    <Link to={l.to} className="hover:text-indigo-400 transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Community</h4>
                        <p className="text-sm mb-4">Built by engineers, for engineers. Contribute and help others prepare.</p>
                        <div className="flex gap-3">
                            {[
                                { icon: <Github size={18} />, href: '#' },
                                { icon: <Twitter size={18} />, href: '#' },
                                { icon: <Linkedin size={18} />, href: '#' },
                            ].map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <p>© 2024 InterviewHub. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart size={12} className="text-red-400 fill-red-400" /> by the community
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
