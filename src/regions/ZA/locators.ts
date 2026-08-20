import { RegionOverrides } from '../../common/locators/sel';

/**
 * ZA is the base region for this migration — every shared Page Object's locator map IS ZA's
 * markup, so there is nothing to override here. When NG/GH/etc. migrate later, each gets its own
 * `regions/<REGION>/locators.ts` with only the keys where its markup genuinely differs (see
 * src/common/locators/overrides.ts for how these get merged in).
 */
export const zaOverrides: RegionOverrides = {};
