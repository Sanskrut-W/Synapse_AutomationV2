import path from 'path';
import { activeRegion } from './oddsApiUrl';

/**
 * Loads a JSON data file from the active region's own folder (src/regions/<REGION>/<relativePath>).
 * Several shared Page Objects need region-specific data (userData.json, api.json, ...) — this
 * keeps that lookup dynamic instead of hardcoding a region name inside otherwise-shared code
 * (the old repo's shared OddSelection.ts hardcoding NG's domain was exactly this mistake).
 */
export function loadRegionData(relativePath: string): any {
    const fullPath = path.resolve(__dirname, '../../regions', activeRegion(), relativePath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(fullPath);
}
