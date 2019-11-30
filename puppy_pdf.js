#!/bin/node
const puppeteer   = require('puppeteer')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2), {
    default: {
        media: "print",
    },
    alias: {
        url: "u",
        out: "o",
        media: "m",
        help: "h",
    }
})


async function make_pdf(args){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.emulateMedia(args.media)

    try {
        await page.goto(args.u, {waitUntil: "networkidle2"})
    } catch(err) {
        console.log(err)
    }

    await page.pdf({
        path: args.o,
        format: 'A4',
        displayHeaderFooter: true,
        footerTemplate: args.footer,
    })

    await browser.close()
}

function help() {
    console.log(`
--help    -h : this help message
--out     -o : output file destination (including filename)
--url     -u : url address
--media   -m : media type 'screen' or 'print'
    `)
}

if(args.help){
    help()
} else {
    make_pdf(args)
}
