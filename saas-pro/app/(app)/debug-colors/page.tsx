'use client';

import { useEffect, useState } from 'react';

export default function DebugColors() {
    const [computedStyles, setComputedStyles] = useState<any>({});

    useEffect(() => {
        // Get computed CSS variables
        const root = document.documentElement;
        const styles = getComputedStyle(root);

        setComputedStyles({
            primary: styles.getPropertyValue('--primary'),
            primaryHSL: styles.getPropertyValue('--p'),
            primaryContent: styles.getPropertyValue('--pc'),
            theme: root.getAttribute('data-theme'),
            rawPrimary: styles.getPropertyValue('--primary').trim(),
        });
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Color Debug Page</h1>

            {/* Debug Info */}
            <div className="bg-base-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Debug Info</h2>
                <p>Current theme: {computedStyles.theme}</p>
                <p>Primary color (--primary): {computedStyles.primary}</p>
                <p>Primary HSL (--p): {computedStyles.primaryHSL}</p>
                <p>Primary content (--pc): {computedStyles.primaryContent}</p>
                <p>Raw primary: {computedStyles.rawPrimary}</p>
            </div>

            {/* Test Buttons */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Test Buttons</h2>
                <div className="flex gap-4 flex-wrap">
                    <button className="btn btn-primary">Primary Button (Should be Black)</button>
                    <button className="btn btn-secondary">Secondary Button</button>
                    <button className="btn btn-accent">Accent Button</button>
                </div>
            </div>

            {/* Test Cards */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Test Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card bg-primary text-primary-content">
                        <div className="card-body">
                            <h3 className="card-title">Primary Card</h3>
                            <p>This should have a black background with white text</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title text-base-content">Base Card</h3>
                            <p className="text-base-content">This should have normal colors</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Variables Display */}
            <div className="bg-base-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">CSS Variables</h2>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div>--primary: <span className="text-primary">■</span></div>
                    <div>--secondary: <span className="text-secondary">■</span></div>
                    <div>--accent: <span className="text-accent">■</span></div>
                    <div>--neutral: <span className="text-neutral">■</span></div>
                </div>
            </div>

            {/* Raw CSS Test */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Raw CSS Test</h2>
                <div
                    className="p-4 rounded-lg text-white"
                    style={{ backgroundColor: '#111111' }}
                >
                    This div has inline style backgroundColor: #111111 (should be black)
                </div>
                <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'hsl(var(--p))' }}
                >
                    This div uses hsl(var(--p)) - DaisyUI primary color
                </div>
            </div>
        </div>
    );
}