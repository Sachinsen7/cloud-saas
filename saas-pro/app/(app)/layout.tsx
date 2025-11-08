'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { LogOutIcon, MenuIcon, ImageIcon, LockIcon } from 'lucide-react';
import { FREE_FEATURES, PREMIUM_FEATURES } from '@/lib/features';

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useUser();
    const { signOut } = useClerk();

    const handleLogoClick = () => {
        router.push('/');
    };

    const handleSignOut = () => {
        signOut();
        setShowLogoutConfirm(false);

        router.push("/");
    };


    return (
        <div className="drawer lg:drawer-open">
            <input
                id="sidebar-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={sidebarOpen}
                onChange={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <header className="w-full bg-base-200">
                    <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex-none lg:hidden">
                            <label
                                htmlFor="sidebar-drawer"
                                className="btn btn-square btn-ghost drawer-button"
                            >
                                <MenuIcon />
                            </label>
                        </div>
                        <div className="flex-1">
                            <Link href="/" onClick={handleLogoClick}>
                                <div className="btn btn-ghost normal-case text-2xl font-bold tracking-tight cursor-pointer">
                                    Cloudinary Showcase
                                </div>
                            </Link>
                        </div>
                        <div className="flex-none flex items-center space-x-4">
                            {user && (
                                <>
                                    <div className="avatar">
                                        <div className="w-8 h-8 rounded-full">
                                            <img
                                                src={user.imageUrl}
                                                alt={
                                                    user.username ||
                                                    user.emailAddresses[0]
                                                        .emailAddress
                                                }
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm truncate max-w-xs lg:max-w-md">
                                        {user.username ||
                                            user.emailAddresses[0].emailAddress}
                                    </span>
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="btn btn-ghost btn-circle"
                                    >
                                        <LogOutIcon className="h-6 w-6" />
                                    </button>

                                </>
                            )}
                        </div>
                    </div>
                </header>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 backdrop-blur-sm">
                        <div
                            className={` text-white p-8 rounded-xl shadow-4xl flex flex-col items-center gap-6 max-w-sm w-full border border-gray-700/50`}
                        >
                            <svg
                                className="w-10 h-10 text-primary mb-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"></path>
                            </svg>

                            <p className="text-xl font-medium text-center">
                                Are you sure you want to log out?
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={handleSignOut}
                                    className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 px-4 py-3 bg-primary/80 text-gray-300 font-semibold rounded-lg hover:bg-primary/60 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Page content */}
                <main className="flex-grow">
                    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
                        {children}
                    </div>
                </main>
            </div>
            <div className="drawer-side">
                <label
                    htmlFor="sidebar-drawer"
                    className="drawer-overlay"
                ></label>
                <aside className="bg-base-200 w-64 h-full flex flex-col">
                    <div className="flex items-center justify-center py-4">
                        <ImageIcon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex flex-col flex-grow overflow-y-auto">
                        <div className="p-4">
                            <div className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2 px-2">
                                Free Features
                            </div>
                            <ul className="menu w-full text-base-content">
                                {FREE_FEATURES.map((item) => (
                                    <li key={item.href} className="mb-1">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                                pathname === item.href
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-base-300'
                                            }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-sm">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="p-4">
                            <div className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2 px-2 flex items-center gap-1">
                                <LockIcon className="w-3 h-3" />
                                Premium Features
                            </div>
                            <ul className="menu w-full text-base-content">
                                {PREMIUM_FEATURES.map((item) => (
                                    <li key={item.href} className="mb-1">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                                pathname === item.href
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-base-300'
                                            }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-sm">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {user && (
                        <div className="p-4">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="btn btn-outline btn-error w-full"
                            >
                                <LogOutIcon className="mr-2 h-5 w-5" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
