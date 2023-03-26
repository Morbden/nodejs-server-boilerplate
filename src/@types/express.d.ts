declare interface RouterRoute {
  path: string
  stack: RouterStack[]
  methods: Record<string, boolean>
}

declare interface RouterStack {
  name: string
  params: Record<string, any>
  path: string
  regexp: RegExp
  route: RouterRoute
}
