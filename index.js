const fs = require("fs");
const cp = require("child_process");

const noitaFolder = `${process.env.APPDATA}/../LocalLow/Nolla_Games_Noita`;
const backupFolder = `${noitaFolder}/backup`;
const cwdNoita = `${process.env["ProgramFiles(x86)"]}\\Steam\\steamapps\\common\\Noita\\`
const gameExePath = `start "" "${process.env["ProgramFiles(x86)"]}\\Steam\\steamapps\\common\\Noita\\noita.exe"`

if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder);
}

function backup() {
    console.log("Backing up save00 folder...");
    const from = `${noitaFolder}/save00`;
    const to = `${noitaFolder}/backup/save00-${formatDate(new Date())}`;
    console.log(`Copying [${from}] to [${to}]`);
    fs.cpSync(from, to, {recursive: true});
    console.log("Successfully backed up!");
}

function restore() {
    console.log("Restorig save00 folder...");
    const latestDate = getLatestDate();
    const from = `${noitaFolder}/backup/save00-${formatDate(latestDate)}`;
    const to = `${noitaFolder}/save00`;
    console.log(`Copying [${from}] to [${to}]`);
    fs.cpSync(from, to, {recursive: true});
    console.log("Successfully restored!");
}

function formatDate(date) {
    return [
        ("0000" + date.getFullYear()).slice(-4),
        ("00" + (date.getMonth()+1)).slice(-2),
        ("00" + date.getDate()).slice(-2),
        ("00" + date.getHours()).slice(-2),
        ("00" + date.getMinutes()).slice(-2),
        ("00" + date.getSeconds()).slice(-2)
    ].join("-");
}

function getLatestDate() {
    const saves = fs.readdirSync(backupFolder);
    if (saves.length > 0) {
        const dates = saves.map(save => {
            const split = save.split("-");
            const yyyy = parseInt(split[1]);
            const MM = parseInt(split[2])-1;
            const dd = parseInt(split[3]);
            const HH = parseInt(split[4]);
            const mm = parseInt(split[5]);
            const ss = parseInt(split[6]);
            return new Date(yyyy, MM, dd, HH, mm, ss);
        });
        return new Date(Math.max(...dates));
    } else {
        console.log("The backup fodler is empty!");
        return null;
    }
}

switch (process.argv[2]) {
    case "backup": backup(); break;
    case "restore": restore(); break;
    default: console.log("Invalid argument!"); break;
}

console.log(`Running game [${gameExePath}]`)
cp.exec(gameExePath, {
    cwd: cwdNoita
}, () => {
    process.exit(0);
});