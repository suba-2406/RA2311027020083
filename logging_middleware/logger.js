// logging_middleware/logger.js

function Log(stack, level, packageName, message) {
    const logData = {
        stack,
        level,
        package: packageName,
        message,
        timestamp: new Date().toISOString()
    };

    console.log("LOG:", logData);
}

module.exports = Log;