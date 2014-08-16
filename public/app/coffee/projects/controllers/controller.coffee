class ProjectController
    projects: null

    showProject: (slug)->

        item = new ProjectShow()

        if !@projects?
            $.get('/api/projects', (data)->
                projects = data
            )

    listProject:->

        item = new ProjectList()

        if !@projects?
            $.get('/api/projects', (data)->
                projects = data
            )
