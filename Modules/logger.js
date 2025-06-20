const fs = require('fs');
const path = require('path');

function log(message) {
    const logEntry = `[${new Date().toISOString()}]: ${message}\n`;
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10);
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }
    const logFilePath = path.join(logsDir, `${dateStr}.log`);
    fs.appendFileSync(logFilePath, logEntry, { flag: 'a' });
}

module.exports = log;