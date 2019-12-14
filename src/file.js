const path = require('path')
const xml2Js = require('xml2js')
const fs = require('fs')
// rawPath = '11'
async function validateFile(rawPath) {
    let result = {
        path: '',
        info:{},
        passage:[]
    }
    let infoObject
    return new Promise((resove, reject) => {
        try {
            result.path = path.resolve(rawPath)
        } catch (error) {
            console.log(error)
            return reject(error.message)
        }
        if (path.extname(rawPath) != ".xml") {
            return reject("Only support xml wordpress dumpfile")
        }
        fs.readFile(result.path, (err, data) => {
            if (err) {
                return reject(err.message)
            }
            xml2Js.parseString(data, (err, data) => {
                if (err) {
                    return reject(`This file "${result.path}" you select maybe not a xml file.`)
                }
                try {
                    infoObject = data.rss.channel[0];
                    result.info = {
                        title:infoObject.title[0].replace(/[\n\t]/g, ''),
                        link: infoObject.link[0].replace(/[\n\t]/g, ''),
                        description:infoObject.description[0].replace(/[\n\t]/g, '')
                    }
                    result.passage = infoObject.item
                } catch (error) {
                    return reject(`This file "${result.path}" you select maybe not a wordpress-dump file.Add flag "-f" to override.`)
                }
                resove(result)
            })
        })
    })
}
// validateFile(rawPath)
module.exports.validateFile = validateFile