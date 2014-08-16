class Project
    projects: null

    @getAll:->

        if !@projects then return @apiCall()
            
        return @projects


    @getOne: (slug)->

        if !@projects? then return @apiCall()

        for project in @projects

            if project.slug == slug

                return project

        console.error 'Project '+slug+' not found'
        return null
            

    @apiCall:->
        defer = new $.Deferred()

        $.get('/api/projects', (data)=>
            @projects = data

            defer.resolve(data)
        ).fail(->

            defer.reject()
        )

        return defer.promise()