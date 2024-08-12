import yargs from 'yargs'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { generate } from './utils/git.js'
import { gray, blue, blueBright, redBright, yellow, magentaBright } from 'colorette'
import figlet from "figlet"

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf-8'))

const args = yargs(process.argv)
  .options({
    key: { type: 'string', default: undefined },
    file: { type: 'string', default: './.vitepress/data/team.json' },
    out: { type: 'string', default: './.vitepress/data/teamGit.json' },
    pkgName: { type: 'string', default: pkg.name ?? '@ampernic/vitepress-plugin-git-members' },
    url: { type: 'string', default: pkg?.repository?.url },
    debug: { type: 'boolean', default: false },
    build: { type: 'boolean', default: false },
  })
  .parseSync()

figlet.text(
  "VP GitMembers",
  {
    font: "Cybermedium",
  },
  function (err, data) {
    console.log(`
                        ${blue('▒▒▒▒▒▒▒▒▒▒▒')}       
              ${blue('▒▒▒▒▒▒░░░░░░        ▒▒')}      
            ${blue('▒▒                   ▒▒')}      
            ${blue('▒▒                   ░▒')}      
            ${blue('▒▒░')}           ${yellow('░')}      ${blue('░▒▒')}     
              ${blue('▒░')}       ${yellow('░░░░░░')}${magentaBright('▒▒▒  ░▒▒     ')}
              ${blue('▒░  ░▒▒▒▒')}${yellow('░░░░░')}${magentaBright('▒▒▒░   ▒▒   ')}  
              ${blue('▒▒   ░▒▒▒▒')}${yellow('░░░░')}${magentaBright('▒▒▒    ░▒▒    ')}
              ${blue('▒▒░    ▒▒▒▒▒')}${magentaBright('▒▒▒▒    ░▒▒    ')} 
              ${blue('▒▒░     ░▒▒')}${magentaBright('▒▒▒▒░      ▒▒    ')}
              ${blue('▒▒       ▒▒')}${magentaBright('▒▒░       ▒▒    ')}
              ${blue('▒▒░       ░')}${magentaBright('▓▒        ░▒    ')}
              ${blue('▒▒░')}                  ${magentaBright('░▒▒   ')}
                ${magentaBright('▒░                   ▒▓   ')}
                ${magentaBright('▒▒                   ▒▓   ')}
                ${magentaBright('▒▒        ░░░░░▒▒▒▒▓▓▓    ')}
                ${magentaBright('▒▒▒▒▒▒▒▒▒▒▒')}             

${blueBright(`${data}`)}`);
    console.log(gray(`
  ------------------------------------------------------
  Vitepress GitHub integration for team page and section
  Made by Ampernic (@alt-gnome) with ${redBright('<3')}
  Licence: MIT
  ------------------------------------------------------
`))
  generate(args)
  }
)

