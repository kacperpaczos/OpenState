const fs = require('fs');
const path = require('path');

const id = "24";
// Simulate the path construction used in page.tsx
const filePath = path.join(process.cwd(), "public/data/bills", `${id}.json`);

console.log("Node Version:", process.version);
console.log("CWD:", process.cwd());
console.log("Checking File Path:", filePath);

if (fs.existsSync(filePath)) {
    console.log("File EXISTS.");
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(content);
        console.log("JSON Parsed Successfully. ID:", json.number || json.id);
    } catch (e) {
        console.error("Read/Parse Error:", e.message);
    }
} else {
    console.log("File does NOT exist.");
    // Try to list the directory to see what IS there
    const dir = path.join(process.cwd(), "public/data/bills");
    if (fs.existsSync(dir)) {
        console.log("Directory exists. Listing first 5 files:");
        const files = fs.readdirSync(dir);
        console.log(files.slice(0, 5));
    } else {
        console.log("Directory does NOT exist:", dir);
    }
}
