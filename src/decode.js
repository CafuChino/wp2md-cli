const fs = require('fs')
const htmlToMd = require('html-to-md')
const path = require('path')
const log = require("../src/log")

function format(str) {
    str = str.replace(/\t/g, '');
    str = str.replace(/<!-- wp:shortcode -->/g, "<code>")
    str = str.replace(/<!-- \/wp:shortcode -->/g, "</code>")
    return str
}
async function parse(item, option) {
    return new Promise((resove, reject) => {
        let parseOptions = {
            skipTags: ['figure', "figcaption", 'cite']
        }
        let title, link, time, creator, passage
        try {
            title = format(item.title[0])
            title = title.replace(/\n/g, '');
        } catch (error) {
            console.log(error)
            log.logWarning("Title not found, incorrect dumpfile?")
            return reject("Title not found error.");
        }
        try {
            link = format(item.link[0])
            link = link.replace(/\n/g, '');
        } catch (error) {
            log.logWarning("Link not found, incorrect dumpfile?");
            link = "Unkown"
        }
        try {
            creator = format(item.creator[0])
            creator = creator.replace(/\n/g, '');
        } catch (error) {
            log.logWarning("Author not found, incorrect dumpfile?");
            creator = "Unkown"
        }
        try {
            time = format(item.pubDate[0])
            time = time.replace(/\n/g, '');
        } catch (error) {
            log.logWarning("Time not found, incorrect dumpfile?");
            time = "Unkown"
        }
        let info = `>Title:${title}\n>Author:${creator}\n>Time:${time}`
        if (option.link) {
            info = `${info}\n>Remote Link:<${link}>\n`
        }
        try {
            passage = format(item.encoded[0])
        } catch (error) {
            log.logError("Passage not found!");
            return reject('Passage not found error')
        }
        title = title.replace(/\n\/\\:\*\?:"\|/g, '')
        title = title.replace(/\//g, "")
        fs.writeFile(`${option.dumpFolder}/${title.replace(/\n\/\\:\*\?:"\|/g,'')}.md`, info + htmlToMd(passage, parseOptions), (err) => {
            if (err) {
                log.logError(err.message)
                reject("Write file error")
            }
            resove(`"${title.replace(/\n\/\\:\*\?:"\|/g,'')}" finished.`.yellow)
        })
    })
}

module.exports.parse = parse