const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv();
const dataPath = path.join(__dirname, '..', '..', 'public', 'data');
const schemaPath = path.join(__dirname, '..', '..', 'schemas');

const filesToValidate = {
    'hash_dictionary': [
        'labels',
    ],
    'string_array': [
        'daily_objectives',
        'hsw_time_trials',
        'rc_time_trials',
        'time_trials',
        'salvage_yard',
    ],
    'tunable_types': [
        'tunable_types',
    ],
    'weekly_objectives': [
        'weekly_objectives',
    ],
};

let isValid = true;
for (const schemaName in filesToValidate) {
    const schema = require(path.join(schemaPath, `${schemaName}.json`));
    const validate = ajv.compile(schema);

    for (const fileName of filesToValidate[schemaName]) {
        const data = require(path.join(dataPath, `${fileName}.json`));
        const valid = validate(data);

        if (valid) {
            console.log(`✅ ${schemaName}: ${fileName}.json`);
            continue;
        }

        console.error(`❌ ${schemaName}: ${fileName}.json\n\n${JSON.stringify(validate.errors, null, '  ')}\n`);
        isValid = false;
    }
}

if (!isValid) {
    console.error('\nValidation failed.');
    process.exit(1);
} else {
    console.log('\nValidation succeeded.');
    process.exit(0);
}
