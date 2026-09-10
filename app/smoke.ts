/** Contract smoke test: exercises the port, not any adapter's internals. */
import { content } from './src/content/index.js';

const c = content();
const featured = await c.getProjects({ featured: true });
const ongoing  = await c.getProjects({ status: 'ongoing' });
const one      = await c.getProject('courtyard-house');
const settings = await c.getSettings();

console.log(JSON.stringify({
  source: c.name,
  slugs: await c.getProjectSlugs(),
  featuredCount: featured.length,
  ongoingCount: ongoing.length,
  oneTitle: one?.title,
  oneRole: one?.role,
  services: (await c.getServices()).map(s => s.title),
  packages: (await c.getPackages()).map(p => `${p.name} — ${p.rate}`),
  studio: (await c.getStudio()).name,
  wa: settings.whatsappNumber,
  missingProject: await c.getProject('does-not-exist'),
}, null, 2));
