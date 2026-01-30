"use client";

import { ArrowRight, Pyramid, BarChart3, Bot, TrendingUp, Shield, Lightbulb, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background overflow-hidden">
            {/* Animated background orbs */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            <div className="flex flex-col min-h-screen bg-background bg-grid relative z-10">
                {/* Grid overlay */}
                <div className="fixed inset-0 bg-grid pointer-events-none z-0"></div>
            <header className="p-2 md:p-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10 relative z-20" role="banner">
                <Link href="/" className="flex items-center gap-1 md:gap-3 group flex-shrink-0" aria-label="ALPHA Home">
                    <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
                        <Pyramid className="w-5 h-5 md:w-7 md:h-7 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm md:text-2xl font-bold text-white font-sans truncate">
                            ALPHA
                        </span>
                        <span className="px-2 py-0.5 text-xs font-semibold text-primary bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full font-sans" aria-label="Version 2.0">
                            2.0
                        </span>
                    </div>
                </Link>
                <Link href="/sign-in" aria-label="Sign in to your account">
                    <Button 
                        className="font-sans text-xs md:text-base bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background" 
                        size="sm"
                    >
                        <span className="hidden sm:inline">Login</span>
                        <span className="sm:hidden">Sign In</span>
                        <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-5 md:w-5" aria-hidden="true" />
                    </Button>
                </Link>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-40 relative z-20" role="main">
                <div className="relative z-10 flex flex-col items-center max-w-4xl">
                    <Pyramid className="w-32 h-32 md:w-48 md:h-48 text-primary animate-float mb-6 md:mb-8" aria-hidden="true" />
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-sans font-bold text-white leading-tight mb-4 md:mb-6 px-2">
                        Intelligent Investing, Powered by AI
                    </h1>
                    <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-8 md:mb-10 font-sans px-2 leading-relaxed">
                        ALPHA combines institutional-grade quantitative analysis, predictive forecasting, and personalized advice to help you navigate the markets with confidence.
                    </p>
                    <Link href="/dashboard" aria-label="Enter ALPHA dashboard">
                        <Button 
                            size="lg" 
                            className="font-sans text-base bg-transparent border-4 border-primary hover:border-primary text-white rounded-full px-8 hover:bg-primary/5 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-300"
                        >
                           Enter ALPHA
                           <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                        </Button>
                    </Link>
                </div>
            </main>

            {/* Features Section */}
            <section className="relative z-20 py-24 md:py-32 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white mb-3 md:mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-sans">
                            Everything you need for professional-grade investment analysis
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg group">
                            <div className="w-14 h-14 rounded-lg bg-primary/30 backdrop-blur-md border border-primary/40 flex items-center justify-center mb-6 group-hover:bg-primary/40 transition-all">
                                <BarChart3 className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-sans font-semibold text-white mb-3">Quantitative Analysis</h3>
                            <p className="text-sm text-gray-400 font-sans mb-4">10+ institutional-grade risk metrics</p>
                            <div className="flex items-center gap-2 text-sm text-primary font-sans font-medium">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Sharpe • Beta • Alpha • VaR
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg group">
                            <div className="w-14 h-14 rounded-lg bg-primary/30 backdrop-blur-md border border-primary/40 flex items-center justify-center mb-6 group-hover:bg-primary/40 transition-all">
                                <Bot className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-sans font-semibold text-white mb-3">AI Advisor</h3>
                            <p className="text-sm text-gray-400 font-sans mb-4">PhD-level quantitative researcher</p>
                            <div className="flex items-center gap-2 text-sm text-primary font-sans font-medium">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Real-time • ChatGPT-like • Strategic
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg group">
                            <div className="w-14 h-14 rounded-lg bg-primary/30 backdrop-blur-md border border-primary/40 flex items-center justify-center mb-6 group-hover:bg-primary/40 transition-all">
                                <TrendingUp className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-sans font-semibold text-white mb-3">Real-Time Data</h3>
                            <p className="text-sm text-gray-400 font-sans mb-4">Live market intelligence & news</p>
                            <div className="flex items-center gap-2 text-sm text-primary font-sans font-medium">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Yahoo Finance • Unlimited • Free
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg group">
                            <div className="w-14 h-14 rounded-lg bg-primary/30 backdrop-blur-md border border-primary/40 flex items-center justify-center mb-6 group-hover:bg-primary/40 transition-all">
                                <Shield className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-sans font-semibold text-white mb-3">Risk Management</h3>
                            <p className="text-sm text-gray-400 font-sans mb-4">Dynamic stop-loss & portfolio optimization</p>
                            <div className="flex items-center gap-2 text-sm text-primary font-sans font-medium">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                ATR-based • 3 Profiles • Trailing
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg group">
                            <div className="w-14 h-14 rounded-lg bg-primary/30 backdrop-blur-md border border-primary/40 flex items-center justify-center mb-6 group-hover:bg-primary/40 transition-all">
                                <Lightbulb className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-sans font-semibold text-white mb-3">Smart Insights</h3>
                            <p className="text-sm text-gray-400 font-sans mb-4">Behavioral analysis & panic detection</p>
                            <div className="flex items-center gap-2 text-sm text-primary font-sans font-medium">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                AI-powered • Sentiment • Confidence
                            </div>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg group">
                            <div className="w-14 h-14 rounded-lg bg-primary/30 backdrop-blur-md border border-primary/40 flex items-center justify-center mb-6 group-hover:bg-primary/40 transition-all">
                                <Target className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-sans font-semibold text-white mb-3">Goal Tracking</h3>
                            <p className="text-sm text-gray-400 font-sans mb-4">Investment goals & progress monitoring</p>
                            <div className="flex items-center gap-2 text-sm text-primary font-sans font-medium">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Real-time • Customizable • Analytics
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative z-20 py-24 md:py-32 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-sans">
                            Get started in minutes with professional investment analysis
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center mb-6 shadow-lg">
                                <span className="text-lg font-sans font-bold text-primary">1</span>
                            </div>
                            <h3 className="text-base font-sans font-semibold text-white mb-2 text-center">Sign Up</h3>
                            <p className="text-xs sm:text-sm text-gray-400 text-center font-sans">Create your free account in seconds</p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center mb-6 shadow-lg">
                                <span className="text-lg font-sans font-bold text-primary">2</span>
                            </div>
                            <h3 className="text-base font-sans font-semibold text-white mb-2 text-center">Add Portfolio</h3>
                            <p className="text-xs sm:text-sm text-gray-400 text-center font-sans">Connect your stocks and assets</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center mb-6 shadow-lg">
                                <span className="text-lg font-sans font-bold text-primary">3</span>
                            </div>
                            <h3 className="text-base font-sans font-semibold text-white mb-2 text-center">Get Insights</h3>
                            <p className="text-xs sm:text-sm text-gray-400 text-center font-sans">Receive AI-powered analysis instantly</p>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center mb-6 shadow-lg">
                                <span className="text-lg font-sans font-bold text-primary">4</span>
                            </div>
                            <h3 className="text-base font-sans font-semibold text-white mb-2 text-center">Invest Better</h3>
                            <p className="text-xs sm:text-sm text-gray-400 text-center font-sans">Make data-driven decisions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="relative z-20 py-16 md:py-24 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white mb-3 md:mb-4">
                            Why Choose ALPHA
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-sans">
                            Professional-grade analysis at zero cost
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {/* Metric 1 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg">
                            <div className="text-4xl md:text-5xl font-sans font-bold text-primary mb-2">10+</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-sans">Risk Metrics</p>
                        </div>

                        {/* Metric 2 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg">
                            <div className="text-4xl md:text-5xl font-sans font-bold text-primary mb-2">12</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-sans">Dashboard Pages</p>
                        </div>

                        {/* Metric 3 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg">
                            <div className="text-4xl md:text-5xl font-sans font-bold text-primary mb-2">$0</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-sans">Cost (vs $24k/yr)</p>
                        </div>

                        {/* Metric 4 */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg">
                            <div className="text-3xl md:text-4xl font-sans font-bold text-primary mb-2">Live</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-sans">Real-Time Updates</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-20 py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
                <div className="max-w-2xl mx-auto text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white mb-4 md:mb-6">
                        Ready to Invest Smarter?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-300 mb-8 font-sans">
                        Join thousands of investors using ALPHA for professional-grade analysis
                    </p>
                    <Link href="/dashboard" aria-label="Enter ALPHA dashboard">
                        <Button 
                            size="lg" 
                            className="font-sans text-xs md:text-sm bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/20 text-white shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background transition-all duration-300"
                        >
                           Get Started Free
                           <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-20 border-t border-white/10 py-8 md:py-12 px-4 md:px-8 bg-white/5 backdrop-blur-md">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
                        <div>
                            <h4 className="text-sm font-sans font-semibold text-white mb-3">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Features</a></li>
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Pricing</a></li>
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-sans font-semibold text-white mb-3">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">About</a></li>
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Blog</a></li>
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-sans font-semibold text-white mb-3">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Privacy</a></li>
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Terms</a></li>
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Disclaimer</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-sans font-semibold text-white mb-3">Connect</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Twitter</a></li>
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">GitHub</a></li>
                                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Discord</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-xs text-gray-400 mb-4 md:mb-0 font-sans">© 2024 ALPHA. All rights reserved.</p>
                        <p className="text-xs text-gray-400 font-sans">Built with institutional-grade quantitative analysis</p>
                    </div>
                </div>
            </footer>
        </div>
        </div>
    );
}
