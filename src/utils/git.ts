import { Octokit } from '@octokit/core'
import { cyan, gray } from 'colorette'
import ora, { type Ora } from 'ora'
import * as fs from 'node:fs'
import * as path from 'node:path'

const ReadJSON = (file: string, spiner: Ora, toolname: string) => {
    try {
        const fileRaw = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8'))
        spiner.info(`${toolname} File '${file}' succesfuly readed...\n`)
        return fileRaw
    } catch (err) {
        spiner.fail(`${toolname} Failed to open file! (Check --file option)\n`)
    }
}

const WriteJSON = (file: string, data: any, spiner: Ora, toolname: string) => {
    try {
        fs.writeFileSync(path.resolve(process.cwd(), file), JSON.stringify(data))
        spiner.succeed(`${toolname} Out file '${file}' succesfuly saved...\n`)
    } catch (err) {
        console.log(err)
        spiner.fail(`${toolname} Failed to write file! (Check --out option)\n`)
    }
}

const API = (key: string) => {
    return new Octokit({
        auth: key
    })
}

const getStats = async (connection: Octokit, url: string, spiner: Ora, toolname:string) => {
    let retryCount = 0
    while (retryCount < 1000) {
        const stats = await connection.request('GET /repos/{owner}/{repo}/stats/contributors', {
            owner: url.split('/')[3],
            repo: url.split('/')[4],
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
          .then((response) => {
            spiner.succeed(`${toolname} Gottcha! Statistic received succesfully.\n`)
            return response
          })
          .catch((err) => {
            spiner.fail(`${toolname} Failed connect GitHub! (Check internet connection)\n`)
          })
        if (stats?.status == 202) {
            retryCount += 1
            spiner.text = `${toolname} Try to get stats of repo ( Attempt: ${retryCount})...\n`
        }
        return stats?.data
    }
}

const getUserInfo = async (connection: Octokit, login: string, spiner: Ora, toolname: string) => {
    spiner.text = `${toolname} Recive more information about users: ${login} ...\n`
    return await connection
      .request('GET /users/{user}', {
        user: login,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      .then(response => response.data)
      .catch((err) =>
        spiner.fail(`${toolname} Failed connect GitHub! (Check internet connection)\n`)
      )
}

export const generate = async (args: any) => {
    const toolname = `${cyan(`[ ${args.pkgName} | Vitepress Git Members ]`)}${gray(':')}`
    const spiner = ora({ discardStdin: false })

    spiner.start(`${toolname} Try to open team map file...\n`)
    const teamFile = ReadJSON(args.file, spiner, toolname)
    
    if (teamFile){
        if(args.key){
            const connection = API(args.key)
            if (args.url) {
                spiner.start(`${toolname} Try to get stats of repo...\n`)
                const stats = await getStats(connection, args.url, spiner, toolname)
                if (stats) {
                    const authors = []
                    await stats.forEach(async (contributor) => {
                        if (contributor.author) {
                            const contributorAbout = await getUserInfo(connection, contributor.author.login, spiner, toolname)

                            const author = {
                                mapByNameAliases: [contributor.author.login],
                                name: contributorAbout.name,
                                title: 'Участник',
                                avatar: contributor.author.avatar_url,
                                summary: {
                                  commits: contributor.total,
                                  add: 0,
                                  remove: 0
                                },
                                lastMonthActive: {
                                  commits: 0,
                                  add: 0,
                                  remove: 0
                                },
                                links: [{ icon: 'github', link: contributor.author.html_url }]
                            }

                            contributor.weeks.forEach((week) => {
                                if (week.a && week.d) {
                                    author.summary.add += week.a
                                    author.summary.remove += week.d
                                }
                              })
                          
                            contributor.weeks.slice(-4).forEach((week) => {
                                if (week.a && week.d && week.c) {
                                    author.lastMonthActive.add += week.a
                                    author.lastMonthActive.remove += week.d
                                    author.lastMonthActive.commits += week.c
                                }
                            })

                            if (teamFile.team) {
                                teamFile.team.forEach((member: any)=> {
                                    if (
                                        member.name == contributorAbout.name ||
                                        Object.values(member.links[0])[1] == Object.values(author.links[0])[1] ||
                                        (member.nameAliases && member.nameAliases.includes(contributor?.author?.login))
                                      ) {
                                        Object.keys(member).forEach((key:string) => {
                                          key == 'mapByNameAliases'
                                            ? member[key].forEach((alias:string) => {
                                              author[key].push(alias)
                                            })
                                            : (author[key] = member[key])
                                        })
                                      }
                                })
                            } else {
                                spiner.fail(`${toolname} Not found team in input JSON (Check team input file structure)...\n`)
                            }
                        }
                    })
                }
            } else {
                spiner.fail(`${toolname} Repo not found (Check --url option)...\n`)
            }
        } else {
            spiner.warn(`${toolname} Missing github key! Generate default file. (Check --key option)\n`)
            WriteJSON(args.out, teamFile, spiner, toolname)
        }
    }
}