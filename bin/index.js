#! /usr/bin/env node

const program = require('commander')
const nodeEmoji = require('node-emoji')
const xml2Js = require('xml2js')
const inquirer = require('inquirer')
const colors = require('colors')
const htmlToMd = require('html-to-md')
const fs = require('fs')
const path = require('path')
const log = require("../src/log")
const file = require('../src/file')
const decode = require('../src/decode')
let option = {
    path: '',
    dumpFolder: "",
    link: false,
    img: false
}

async function cli() {
    program
        .requiredOption('-f, --file <path>', 'path to wordpress dumpfile')
        .option('-a, --auto', 'Auto download images and use local resourses in markdown file')
    program.parse(process.argv)
    console.log(nodeEmoji.emojify(":sparkles:  wp2md tool made by CafuChino").rainbow)
    console.log("And he is looking for a good job :)".gray)
    option.path = program.file
    if (!program.auto) {
        await inquirer
            .prompt([{
                type: "confirm",
                name: "link",
                message: "Dump remote link into markdown file?",
                default: true
            }])
            .then((ans) => {
                option.link = ans.link
            })
        await inquirer
            .prompt([{
                type: "input",
                name: "dumpFolder",
                message: "Path to markdown files",
                default: './markdown/',
            }])
            .then((ans) => {
                option.dumpFolder = path.resolve(ans.dumpFolder)
            })
        // await inquirer
        //     .prompt([{
        //         type: "confirm",
        //         name: "img",
        //         message: "Downlod images and use local resourses in markdown file?",
        //         default: false
        //     }])
        //     .then((ans) => {
        //         option.img = ans.img
        //     })

    } else {
        option.link = true;
        option.dumpFolder = path.resolve('./markdown/')
    }
    const dumpObject = await file.validateFile(option.path).catch((err) => {
        log.logError(err)
    })
    let parseOptions = {
        skipTags: ['figure', "figcaption", 'cite']
    }
    // var testItem = dumpObject.passage[14].encoded[0].replace(/\t/g, '')
    // fs.writeFile('./result.md', htmlToMd(testItem, parseOptions), () => {
    //     console.log(htmlToMd(testItem, parseOptions))
    // })
    fs.exists(option.dumpFolder, async (exists) => {
        if (!exists) {
            fs.mkdir(option.dumpFolder, async (err) => {
                if (err) {
                    return log.logError('Create folder error')
                }
                for (let i = 0; i < dumpObject.passage.length; i++) {
                    const element = dumpObject.passage[i];
                    const result = await decode.parse(element, option).catch((err) => {
                        return console.log(err)
                    })
                    console.log(result)
                }
                return;
            })
        } else {
            for (let i = 0; i < dumpObject.passage.length; i++) {
                const element = dumpObject.passage[i];
                const result = await decode.parse(element, option).catch((err) => {
                    return console.log(err)
                })
                console.log(result)
            }
            return;
        }
    })
}
cli()