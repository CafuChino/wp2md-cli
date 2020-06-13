const argv = require('yargs').argv
const xml2Js = require('xml2js')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const nodeEmoji = require('node-emoji')

function logError(msg) {
    return console.log(nodeEmoji.emojify(":x:  [ERROR] ".red + msg.yellow))
}

function logWarning(msg) {
    return console.log(nodeEmoji.emojify(":heavy_exclamation_mark: [WARNING] ".yellow + msg.yellow))
}
console.log(nodeEmoji.emojify(":sparkles:  wp2md tool made by CafuChino").rainbow)
console.log("And he is looking for a good job :)".gray)
async function choice(args) {
    return new Promise((resolve, reject) => {
        let result = {
            confirm: false,
            img: false,
            link: false
        }
        let filePath = args
        if (filePath) {
            try {
                filePath = args[0]
                filePath = path.resolve(args[0])
            } catch (err) {
                return reject('File path invalid!')
            }
            if (path.extname(filePath) != ".xml") {
                return reject("Only support xml wordpress dumpfile.")
            }
        } else {
            return reject("Dumpfile path required!")
        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return reject({msg:err.message,rl:rl})
            } else {
                xml2Js.parseString(data, (err, data) => {
                    if (err) {
                        return reject({msg:`This file "${filePath}" you select maybe not a xml file.`,rl:rl})
                    } else {
                        let dumpObject = data.rss
                        if (!dumpObject) {
                            logWarning(`This file "${filePath}" you select maybe not a wordpress-dump file.Try anyway?`)
                            rl.question("Continue anyway(Y/N):".cyan, (answer) => {
                                console.log(answer)
                                rl.close();
                                return reject({msg:"Bye",rl:rl})
                            })
                        } else {
                            let channal = dumpObject.channel[0]
                            let title = channal.title[0].replace(/[\n\t]/g, '');
                            let link = channal.link[0].replace(/[\n\t]/g, '');
                            let description = channal.description[0].replace(/[\n\t]/g, '');
                            if (title && link && description) {
                                console.log(nodeEmoji.emojify('We have got some basic information:'))
                                console.log(`Title:${title}`);
                                console.log(`Link:${link}`);
                                console.log(`Description:${description}`);
                                rl.question("Confirm? (Y/N):".cyan, (answer) => {
                                    switch (answer.toUpperCase()) {
                                        case "Y":
                                            rl.question("Dump remote link into markdown file?(Y/N):".cyan, (answer) => {
                                                switch (answer.toUpperCase()) {
                                                    case "Y":
                                                        result.link = true
                                                        rl.question("Download images and use local resourses in markdown file?(Y/N):".cyan, (answer) => {
                                                            switch (answer.toUpperCase()) {
                                                                case "Y":
                                                                    result.img = true
                                                                    break;
                                                                case "N":
                                                                    result.img = false
                                                                    break;
                                                                default:
                                                                    rl.close();
                                                                    return reject({msg:"Wrong input,quit",rl:rl});
                                                            }
                                                        })
                                                        break;
                                                    case "N":
                                                        result.link = false
                                                        break;
                                                    default:
                                                        return reject({msg:"Wrong input,quit",rl:rl});
                                                }
                                            })
                                            return resolve(result)
                                            break;
                                        case "N":
                                            rl.close();
                                            return reject({msg:"Bye",rl:rl})
                                            break;
                                        default:
                                            rl.close();
                                            return reject({msg:"Wrong input,quit",rl:rl});
                                    }
                                })
                            }
                        }
                    }
                })
            }
        })
    })
}
module.exports.choice = choice