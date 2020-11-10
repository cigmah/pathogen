import { Investigation } from "./Investigation";

/** A collection is a group of investigations performed on a single sample (e.g. an FBE is a collection including Hb, MCV etc). */
export interface Collection {
    name: string;
    investigations: Array<Investigation>;
}

/** Group an array of investigations into separate collections. */
export function collect(
    investigations: Array<Investigation>
): Array<Collection> {
    let collections: Array<Collection> = [];
    let groups: Record<string, Array<Investigation> | undefined> = {};
    investigations.forEach((i) => {
        if (i.collection) {
            let added = groups[i.collection];
            if (added) {
                added.push(i);
            } else {
                groups[i.collection] = [i];
            }
        } else {
            groups[i.name] = [i];
        }
    });
    Object.keys(groups).forEach((name) => {
        const items = groups[name];
        if (items) {
            collections.push({
                name: name,
                investigations: items,
            });
        }
    });
    return collections;
}
