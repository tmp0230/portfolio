class ProjectController

    listProject:->

        item = new ProjectList()

        data = Project.getAll()

        if data.promise?

            data.then((result)->

                app.region.mainRegion.show(item, {projects: result})
            )

        else

            app.region.mainRegion.show(item, {projects: data})


    showProject: (slug)->

        item = new ProjectShow()

        data = Project.getOne(slug)

        if data? && data.promise?

            data.then((result)->

                getProject = Project.getOne(slug)

                app.region.mainRegion.show(item, {project: getProject})
            )

        else

            app.region.mainRegion.show(item, {project: data})
