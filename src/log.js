const colors = require('colors')
const nodeEmoji = require('node-emoji')

function logError(msg) {
    return console.log(nodeEmoji.emojify(":x:  [ERROR] ".red + msg.yellow))
}

function logWarning(msg) {
    return console.log(nodeEmoji.emojify(":heavy_exclamation_mark: [WARNING] ".yellow + msg.yellow))
}
module.exports.logWarning = logWarning;
module.exports.logError = logError;