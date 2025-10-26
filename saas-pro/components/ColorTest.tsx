export default function ColorTest() {
    return (
        <div className="p-8 space-y-4">
            <h2 className="text-2xl font-bold text-base-content">DaisyUI Color Test</h2>

            {/* Primary Colors */}
            <div className="flex gap-4 flex-wrap">
                <button className="btn btn-primary">Primary Button</button>
                <button className="btn btn-secondary">Secondary Button</button>
                <button className="btn btn-accent">Accent Button</button>
                <button className="btn btn-neutral">Neutral Button</button>
            </div>

            {/* Status Colors */}
            <div className="flex gap-4 flex-wrap">
                <button className="btn btn-info">Info Button</button>
                <button className="btn btn-success">Success Button</button>
                <button className="btn btn-warning">Warning Button</button>
                <button className="btn btn-error">Error Button</button>
            </div>

            {/* Background Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-base-100 p-4 rounded-lg border">
                    <h3 className="font-semibold text-base-content">Base 100</h3>
                    <p className="text-base-content opacity-70">Main background color</p>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-base-content">Base 200</h3>
                    <p className="text-base-content opacity-70">Secondary background</p>
                </div>
                <div className="bg-base-300 p-4 rounded-lg">
                    <h3 className="font-semibold text-base-content">Base 300</h3>
                    <p className="text-base-content opacity-70">Tertiary background</p>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-primary text-primary-content">
                    <div className="card-body">
                        <h3 className="card-title">Primary Card</h3>
                        <p>This card uses primary colors</p>
                    </div>
                </div>
                <div className="card bg-secondary text-secondary-content">
                    <div className="card-body">
                        <h3 className="card-title">Secondary Card</h3>
                        <p>This card uses secondary colors</p>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            <div className="space-y-2">
                <div className="alert alert-info">
                    <span>Info alert with custom colors</span>
                </div>
                <div className="alert alert-success">
                    <span>Success alert with custom colors</span>
                </div>
                <div className="alert alert-warning">
                    <span>Warning alert with custom colors</span>
                </div>
                <div className="alert alert-error">
                    <span>Error alert with custom colors</span>
                </div>
            </div>
        </div>
    );
}