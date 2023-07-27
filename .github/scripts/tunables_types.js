const fs = require('fs');
const path = require('path');

const labelsPath = path.join(__dirname, 'labels.json');
const basePath = path.join(__dirname, '..', '..');
const publicPath = path.join(basePath, 'public');
const publicLabelsPath = path.join(publicPath, 'data', 'labels.json');
const publicTunableTypesPath = path.join(publicPath, 'data', 'tunable_types.json');

let labels = require(labelsPath);
let publicTunableTypes = require(publicTunableTypesPath);
let publicLabels = require(publicLabelsPath);

function flattenObject(ob) {
    let result = {};

    for (const i in ob) {
        if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
            const temp = flattenObject(ob[i]);
            for (const j in temp) {
                result[j] = temp[j];
            }
        } else {
            result[i] = ob[i];
        }
    }

    return result;
};

function orderObject(unordered) {
    const collator = new Intl.Collator('en', {
        numeric: true,
        sensitivity: 'base',
    });

    return Object.keys(unordered)
        .sort((a, b) => collator.compare(a, b))
        .reduce((obj, key) => {
            obj[key] = unordered[key];
            return obj;
        }, {});
};

function sortTypes(unordered) {
    const collator = new Intl.Collator('en', {
        numeric: true,
        sensitivity: 'base',
    });

    return unordered.sort((a, b) => {
        if (a.type === b.type) {
            return collator.compare(a.key, b.key);
        }

        return collator.compare(a.type, b.type);
    });
}

function run() {
    const inputLabelsFlat = flattenObject(labels);
    const inputLabelKeys = Object.keys(inputLabelsFlat);
    const inputLabelsUsed = {};
    const publicLabelKeys = Object.keys(publicLabels);

    if (publicTunableTypes.length !== [...new Set(publicTunableTypes.map(x => x.key))].length) {
        console.warn(`Tunable types contains duplicate keys.`);

        publicTunableTypes = publicTunableTypes.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.key === item.key
            ))
        );
    }

    for (const item of publicTunableTypes) {
        if (inputLabelKeys.includes(item.display)) {
            inputLabelsUsed[item.display] = inputLabelsFlat[item.display];
        } else if (!publicLabelKeys.includes(item.display)) {
            console.warn(`[${item.key}] "${item.display}" isn't a valid label.`);
        }
    }

    fs.writeFileSync(publicTunableTypesPath, JSON.stringify(sortTypes(publicTunableTypes), null, 2));

    if (Object.keys(inputLabelsUsed).length > 0) {
        const outputLabels = orderObject({ ...inputLabelsUsed, ...publicLabels });

        if (Object.values(outputLabels).some(x => x === String(x).toUpperCase())) {
            console.warn(`Some labels are uppercase.`);
            console.log(Object.values(outputLabels).filter(x => x === String(x).toUpperCase()));
        }

        fs.writeFileSync(publicLabelsPath, JSON.stringify(outputLabels, null, 2));
    }
}

run();
