const fs = require("fs/promises");
const path = require("path");

const VEHICLES_URL = "https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/master/vehicles.json";
const WEAPONS_URL = "https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/master/weapons.json";
const OUTPUT_PATH = path.join(__dirname, "../../public/data/labels.json");

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch from ${url}:`, error.message);
        return [];
    }
}

async function run() {
    let labels = {};

    try {
        const existingContent = await fs.readFile(OUTPUT_PATH, "utf8");
        labels = JSON.parse(existingContent);
        console.log(`Loaded ${Object.keys(labels).length} existing labels.`);
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log("No existing file found. Creating a new one.");
        } else {
            console.error("Error reading existing file:", error.message);
        }
    }

    console.log("Fetching latest data for labels...");
    const [vehicles, weapons] = await Promise.all([
        fetchData(VEHICLES_URL),
        fetchData(WEAPONS_URL),
    ]);

    vehicles.forEach((v) => {
        const key = v?.Name?.toUpperCase();
        if (key && !Object.prototype.hasOwnProperty.call(labels, key)) {
            const manufacturer = v?.ManufacturerDisplayName?.English ?? "";
            const name = v?.DisplayName?.English ?? "";
            const value = `${manufacturer} ${name}`.trim();

            if (value !== "") {
                labels[key] = value;
            }
        }
    });

    weapons.forEach((w) => {
        const key = w?.Name?.toUpperCase();
        if (key && !Object.prototype.hasOwnProperty.call(labels, key)) {
            const value = w?.TranslatedLabel?.English ?? "";

            if (value !== "" && value.toUpperCase() !== "INVALID") {
                labels[key] = value;
            }
        }
    });

    const sortedKeys = Object.keys(labels).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );

    const sortedLabels = {};
    for (const key of sortedKeys) {
        sortedLabels[key] = labels[key];
    }

    try {
        const outputDir = path.dirname(OUTPUT_PATH);
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(
            OUTPUT_PATH,
            JSON.stringify(sortedLabels, null, 2),
            "utf8",
        );
        console.log(`Update complete. Total labels: ${sortedKeys.length}`);
    } catch (err) {
        console.error("Failed to write updated labels:", err);
    }
}

run();
