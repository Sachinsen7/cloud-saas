import type { NextConfig } from 'next';
import path from 'path';

const workspaceRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
    output: 'standalone',
    outputFileTracingRoot: workspaceRoot,
    outputFileTracingExcludes: {
        '*': [
            'node_modules/@swc/**',
            'node_modules/@esbuild/**',
            'node_modules/webpack/**',
        ],
    },
};

export default nextConfig;
