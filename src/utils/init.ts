import { cyan, gray } from 'colorette'
import ora from 'ora'

export const init = () => {
    const toolname = `${cyan(`[ @alt-gnome/alt-wiki-vitepress-gnome | Git Statistic ]`)}${gray(':')}`
    const spiner = ora({ discardStdin: false })
    spiner.start(`${toolname} Читаем данные с гита...\n`)
}