import { RegionOverrides, LocatorMap } from './sel';
import { zaOverrides } from '../../regions/ZA/locators';
import { bwOverrides } from '../../regions/BW/locators';
import { ghOverrides } from '../../regions/GH/locators';
import { mwOverrides } from '../../regions/MW/locators';
import { mzOverrides } from '../../regions/MZ/locators';
import { ngOverrides } from '../../regions/NG/locators';
import { tzOverrides } from '../../regions/TZ/locators';
import { zmOverrides } from '../../regions/ZM/locators';

/**
 * Region selector overrides registry.
 *
 * Each region exports a partial {@link RegionOverrides} map (page-group -> selector map). The
 * active region is chosen by the `REGION` env var — set by every playwright.<REGION>.config.ts,
 * and also the exact env var name the Dashboard tool's `execution.env.REGION` sets on triggered
 * runs, so the override mechanism works whether a test is launched by Dashboard or bare CLI.
 * A Page Object resolves its selectors via BasePage.build(), which merges
 * overridesForGroup(group) over the PO's own base map — so a region only needs to declare the
 * keys where its markup actually differs.
 */
const REGIONS: Record<string, RegionOverrides> = {
    ZA: zaOverrides,
    BW: bwOverrides,
    GH: ghOverrides,
    MW: mwOverrides,
    MZ: mzOverrides,
    NG: ngOverrides,
    TZ: tzOverrides,
    ZM: zmOverrides,
};

export function overridesForGroup(group: string): LocatorMap {
    const region = (process.env.REGION || 'ZA').toUpperCase();
    return (REGIONS[region] || {})[group] || {};
}
