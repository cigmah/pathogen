import {
    investigations,
    QuantRefGroup,
    QuantRefGroupPredicate,
    QuantSpec,
} from "./Investigation";

test("parses investigations data correctly", () => {
    let testPredicate = (p: QuantRefGroupPredicate) => {
        switch (p.type) {
            case "age": {
                expect(typeof p.lower).toBe("number");
                expect(typeof p.upper).toBe("number");
                break;
            }
            case "gender": {
                expect(["male", "female"]).toContain(p.gender);
                break;
            }
        }
    };

    let testGroup = (g: QuantRefGroup) => {
        expect(typeof g.range.lower).toBe("number");
        expect(typeof g.range.upper).toBe("number");
        let predicates = g.predicates;
        predicates.forEach((p) => testPredicate(p));
    };

    let testQuantSpec = (spec: QuantSpec) => {
        expect(typeof spec.maxValue).toBe("number");
        expect(typeof spec.minValue).toBe("number");
        expect(typeof spec.units).toBe("string");
        let ref = spec.ref;
        switch (ref.type) {
            case "grouped": {
                expect(typeof ref.default.lower).toBe("number");
                expect(typeof ref.default.upper).toBe("number");
                let groups = ref.groups;
                groups.forEach((g) => testGroup);
                break;
            }
            case "static": {
                expect(typeof ref.lower).toBe("number");
                expect(typeof ref.upper).toBe("number");
            }
        }
    };

    let keys = Object.keys(investigations);
    keys.forEach((k) => {
        let item = investigations[k];
        let spec = item.spec;
        switch (spec.type) {
            case "quant": {
                testQuantSpec(spec);
                break;
            }
        }
    });
});
