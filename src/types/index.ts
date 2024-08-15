export interface UtilArgs {
    /**
     * GitHub API key
     */
    key?: string,
    /** 
     * Input team file relative path
     */
    file: string,
    /**
     * Relative path to output file
     */
    out: string,
    /**
     * Display name of project in utility log
     */
    pkgName: string,
    /**
     * URL to github repo
     */
    url: string,
    /**
     * @deprecated Show debug log
     */
    debug?: boolean,
    /**
     * @deprecated Build arg
     */
    build?: boolean,
}

export interface TeamMember {
    name: string,
    title: string,
    avatar: string,
    /**
     * Nolebase GitChangelog / Vitepress name locales
     * @description The overriding display name of the contributor in other locales if needed
     */
    i18n?: Record<string, string>
    /**
     * Nolebase GitChangelog mapping by name
     * @link https://github.com/nolebase/integrations/blob/main/packages/vitepress-plugin-git-changelog/src/types/index.ts#L157
     */
    mapByNameAliases: string[]
    /**
     * Vitepress default team page links structure
     */
    links: {
        icon: {
            svg: string
        } | string,
        link: string
    }[]
    actionText?: string,
    sponsor?: string 
}

export interface ContributorMember extends TeamMember {
    summary: {
        commits: number,
        add: number,
        remove: number
    },
    lastMonthActive: {
        commits: number,
        add: number,
        remove: number
    },
}