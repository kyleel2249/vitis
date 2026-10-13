/**
 * Cloudflare Pages build for Vitis.
 *
 *   npm run cf:build   (Pages "Build command")
 *   Build output directory: .open-next/pages
 *
 * 1. Runs the OpenNext Cloudflare build (Next.js -> Worker bundle + static assets).
 * 2. Assembles a Pages "advanced mode" output directory:
 *      .open-next/pages/            static assets (served directly by Pages)
 *      .open-next/pages/_worker.js  the app server (Pages Functions / advanced mode)
 *      .open-next/pages/_routes.json  static paths that skip the Worker
 *
 * Pages only accepts static files <= 25 MiB and never uploads the .next cache,
 * because the output directory is .open-next/pages (not .next).
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const open = path.join(root, '.open-next');
const out = path.join(open, 'pages');
const run = (cmd, env = {}) =>
  execSync(cmd, { stdio: 'inherit', cwd: root, env: { ...process.env, ...env } });

// 1. Next.js -> OpenNext (images are unoptimized: Workers cannot run sharp)
run('npx opennextjs-cloudflare build', { IMAGES_UNOPTIMIZED: 'true' });

// 2. Static assets
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(open, 'assets'), out, { recursive: true });

// 3. Worker entry for Pages: same handler, minus the Durable Object class exports
//    (Pages cannot host Durable Object classes; the default OpenNext cache config does not use them).
const entrySrc = fs.readFileSync(path.join(open, 'worker.js'), 'utf8');
const entry = entrySrc
  .split('\n')
  .filter((line, i, lines) => {
    if (/^export \{ (DOQueueHandler|DOShardedTagCache|BucketCachePurge) \}/.test(line)) return false;
    // drop the comment line directly above a removed export
    const next = lines[i + 1] || '';
    if (/^\s*\/\/\s*@?ts-expect-error/i.test(line) && /^export \{ (DOQueueHandler|DOShardedTagCache|BucketCachePurge) \}/.test(next)) return false;
    return true;
  })
  .join('\n');
fs.writeFileSync(path.join(open, 'worker-pages.js'), entry);

// 4. Bundle with wrangler (same bundler Cloudflare uses; resolves node:* / cloudflare:* with nodejs_compat)
const bundleDir = path.join(open, 'pages-bundle');
fs.rmSync(bundleDir, { recursive: true, force: true });
const bundleConfig = path.join(open, 'bundle.wrangler.json');
fs.writeFileSync(
  bundleConfig,
  JSON.stringify({
    name: 'vitis',
    main: './worker-pages.js',
    compatibility_date: '2025-03-01',
    compatibility_flags: ['nodejs_compat', 'global_fetch_strictly_public'],
  })
);
run(`npx wrangler deploy --dry-run --config ${JSON.stringify(bundleConfig)} --outdir ${JSON.stringify(bundleDir)}`);

const files = fs.readdirSync(bundleDir).filter((f) => !f.endsWith('.map') && f !== 'README.md');
const extras = files.filter((f) => f !== 'worker-pages.js');
if (extras.length === 0) {
  // single-file Worker -> _worker.js
  fs.copyFileSync(path.join(bundleDir, 'worker-pages.js'), path.join(out, '_worker.js'));
} else {
  // extra modules (e.g. wasm) -> _worker.js directory with index.js entry
  const dir = path.join(out, '_worker.js');
  fs.mkdirSync(dir);
  for (const f of files) {
    fs.copyFileSync(path.join(bundleDir, f), path.join(dir, f === 'worker-pages.js' ? 'index.js' : f));
  }
}

// 5. Static paths served straight from Pages (no Worker invocation)
fs.writeFileSync(
  path.join(out, '_routes.json'),
  JSON.stringify(
    {
      version: 1,
      include: ['/*'],
      exclude: ['/_next/static/*', '/BUILD_ID', '/favicon.png', '/icon-*.png', '/apple-touch-icon.png', '/vitis-logo.png', '/manifest.json'],
    },
    null,
    2
  )
);

const size = (p) => (fs.statSync(p).size / 1024 / 1024).toFixed(2) + ' MiB';
const worker = fs.existsSync(path.join(out, '_worker.js')) && fs.statSync(path.join(out, '_worker.js')).isFile()
  ? path.join(out, '_worker.js')
  : path.join(out, '_worker.js', 'index.js');
console.log(`\n✅ Pages output ready: ${path.relative(root, out)}  (worker ${size(worker)})`);
