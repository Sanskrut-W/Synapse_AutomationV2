#!/usr/bin/env node
/**
 * Run the Bet Influencer automation across every Synapse region, one region per process.
 *
 * One process per region is required, not a convenience: the framework selects a region's locator
 * overrides from process.env.REGION (src/common/locators/overrides.ts), so two regions can never
 * share a worker.
 *
 * Usage:
 *   node scripts/run-influencer.mjs daily
 *   node scripts/run-influencer.mjs payout
 *   node scripts/run-influencer.mjs daily NG,GH          # subset
 *
 * Exit code is non-zero if any region failed, so CI sees the whole sweep.
 */
import { spawnSync } from 'child_process';

const ALL_REGIONS = ['ZA', 'GH', 'BW', 'MW', 'MZ', 'NG', 'TZ', 'ZM'];

const part = (process.argv[2] || '').toLowerCase();
if (!['daily', 'payout'].includes(part)) {
    console.error('Usage: node scripts/run-influencer.mjs <daily|payout> [REGION,REGION,...]');
    process.exit(2);
}

const regions = process.argv[3]
    ? process.argv[3].split(',').map(r => r.trim().toUpperCase()).filter(Boolean)
    : ALL_REGIONS;

const unknown = regions.filter(r => !ALL_REGIONS.includes(r));
if (unknown.length) {
    console.error(`Unknown region(s): ${unknown.join(', ')}. Known: ${ALL_REGIONS.join(', ')}`);
    process.exit(2);
}

const results = [];

for (const region of regions) {
    console.log(`\n${'='.repeat(70)}\n  Bet Influencer [${part}] - ${region}\n${'='.repeat(70)}`);

    const run = spawnSync(
        'npx',
        ['playwright', 'test', '--config=playwright.influencer.config.ts', '--grep', part],
        {
            stdio: 'inherit',
            shell: true,
            env: {
                ...process.env,
                REGION: region,
                PLAYWRIGHT_JSON_OUTPUT_NAME: `influencer-${part}-${Date.now()}.json`,
            },
        }
    );

    results.push({ region, code: run.status ?? 1 });
}

console.log(`\n${'='.repeat(70)}\n  Summary - Bet Influencer [${part}]\n${'='.repeat(70)}`);
for (const { region, code } of results) {
    console.log(`  ${region.padEnd(4)} ${code === 0 ? 'OK' : 'FAILED (exit ' + code + ')'}`);
}

const failed = results.filter(r => r.code !== 0);
console.log(`\n  ${results.length - failed.length}/${results.length} region(s) passed.\n`);
process.exit(failed.length ? 1 : 0);
