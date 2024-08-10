import yargs from 'yargs'
import { init } from './utils/init.js'
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
  "Vitepress GitMembers",
  {
    font: "Diet Cola",
  },
  function (err, data) {
    console.log(data);
    console.log("\nMade with love by Ampernic (@alt-gnome)\n")
    main()
  }
)

