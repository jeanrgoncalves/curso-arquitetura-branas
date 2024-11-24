import { distance } from '@turf/turf';
import { Units } from '@turf/helpers';

export default class RideUtils {
    static calcDistance(fromLat: number, fromLong: number, toLat: number, toLong: number): Number {
        const from = [fromLat, fromLong]; 
        const to = [toLat, toLong]; 

        const units: Units = 'kilometers';

        return distance(from, to, {units});
    }
}