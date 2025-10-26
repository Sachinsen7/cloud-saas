'use client';

import { useEffect, useState } from 'react';

export default function SimpleTest() {
    const [currentTheme, setCurrentTheme] = useState('light');

    useEffect(() => {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        setCurrentTheme(theme);

        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    setCurrentTheme(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Simple Color Test</h1>

            <div className="mb-4 p-4 bg-base-200 rounded">
                <p><strong>Current Theme:</strong> {currentTheme}</p>
                <p><strong>Expected Primary:</strong> {currentTheme === 'light' ? '#3448C5 (purple-blue)' : '#5B6FD8 (light purple-blue)'}</p>
            </div>

            {/* Direct CSS test */}
            <div className="mb-4">
                <div
                    className="p-4 mb-2 text-white rounded"
                    style={{ backgroundColor: currentTheme === 'light' ? '#3448C5' : '#5B6FD8' }}
                >
                    Direct CSS: {currentTheme === 'light' ? '#3448C5' : '#5B6FD8'} (should match theme)
                </div>
            </div>

            {/* DaisyUI classes */}
            <div className="space-y-4">
                <button className="btn btn-primary">DaisyUI Primary Button</button>
                <div className="bg-primary text-primary-content p-4 rounded">
                    DaisyUI bg-primary div
                </div>
                <div className="card bg-primary text-primary-content">
                    <div className="card-body">
                        <h2 className="card-title">Primary Card</h2>
                        <p>This should be {currentTheme === 'light' ? 'purple-blue (#3448C5)' : 'light purple-blue (#5B6FD8)'} background</p>
                    </div>
                </div>
            </div>

            {/* CSS Variable test */}
            <div className="mt-8">
                <div
                    className="p-4 text-white rounded"
                    style={{ backgroundColor: 'var(--primary)' }}
                >
                    Using var(--primary)
                </div>
                <div
                    className="p-4 text-white rounded mt-2"
                    style={{ backgroundColor: 'hsl(var(--p))' }}
                >
                    Using hsl(var(--p))
                </div>
            </div>

            {/* Theme comparison */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-base-100 rounded border">
                    <h3 className="font-bold mb-2">Light Theme Colors</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3448C5' }}></div>
                            <span>Primary: #3448C5</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-base-100 border"></div>
                            <span>Background: White</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-base-200 rounded">
                    <h3 className="font-bold mb-2">Dark Theme Colors</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#5B6FD8' }}></div>
                            <span>Primary: #5B6FD8</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1f2937' }}></div>
                            <span>Background: Dark Gray</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test theme-aware components */}
            <div className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold">Theme-Aware Components</h2>

                {/* Status colors */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-error/10 rounded">
                        <div className="text-error font-semibold">Error</div>
                        <div className="text-error/80 text-sm">Error message</div>
                    </div>
                    <div className="p-3 bg-success/10 rounded">
                        <div className="text-success font-semibold">Success</div>
                        <div className="text-success/80 text-sm">Success message</div>
                    </div>
                    <div className="p-3 bg-warning/10 rounded">
                        <div className="text-warning font-semibold">Warning</div>
                        <div className="text-warning/80 text-sm">Warning message</div>
                    </div>
                    <div className="p-3 bg-info/10 rounded">
                        <div className="text-info font-semibold">Info</div>
                        <div className="text-info/80 text-sm">Info message</div>
                    </div>
                </div>

                {/* Opacity variations */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Primary Color Opacity Variations</h3>
                    <div className="flex gap-2">
                        <div className="p-2 bg-primary/10 rounded text-primary">10%</div>
                        <div className="p-2 bg-primary/20 rounded text-primary">20%</div>
                        <div className="p-2 bg-primary/40 rounded text-primary">40%</div>
                        <div className="p-2 bg-primary/60 rounded text-white">60%</div>
                        <div className="p-2 bg-primary/80 rounded text-white">80%</div>
                        <div className="p-2 bg-primary rounded text-white">100%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}