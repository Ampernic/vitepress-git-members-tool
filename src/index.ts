import yargs from 'yargs'
import { init } from './utils/init.js'
import { gray, blueBright } from 'colorette'
import figlet from "figlet"

const args = yargs(process.argv)
  .options({
    key: { type: 'string', default: '' },
    init: { type: 'boolean', default: false },
    debug: { type: 'boolean', default: false },
    build: { type: 'boolean', default: false },
  })
  .parseSync()

const main = () => {
  if (args.init) {
    init()
  }
}

figlet.text(
  "VP GitMembers",
  {
    font: "Cybermedium",
  },
  function (err, data) {
    console.log(blueBright(`${data}`));
    console.log(gray(`
Vitepress GitHub integration for team page and section
Made with love by Ampernic (@alt-gnome)
Licence: MIT
`))
    main()
  }
)

