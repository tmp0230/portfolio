class ProjectRouter extends Router
    controller: null

    constructor:->

        @controller = new ProjectController()
        super

    switchView: (name, url = History.getState().url)=>

        if name == 'view:show'

            urlSimplified = url.replace(Config.BASE_URL, '')

            switch urlSimplified

                when '/'
                    console.log 'projects'
                    @controller.listProject()

                    app.menu.goSingle(true)

                else
                    reg = new RegExp('^\/projects\/([A-Z0-9-]*)\/$', 'i')
                    match = reg.exec(urlSimplified)

                    if match != null
                        console.log match[1]
                        @controller.showProject(match[1])

                        app.menu.goSingle(false)
