class Region
    el: null
    env: null
    currentView: null
    firstRender: true

    constructor: (el)->
        @el = $(el)
        @env = new nunjucks.Environment()
        filters = require('../../../filters/filters')
        filters(@env)

    show: (view, data)->

        if @firstRender
            @firstRender = false
            return @noAjaxRender(view)

        renderedTemplate = @env.render(view.template, data)

        @el.append(renderedTemplate)

        if @currentView? && @currentView.onClose?
            app.vent.viewClosed.addOnce(=>
                @afterClose(view)
            )

            @currentView.onClose()

        else
            @afterClose(view)

        view.open()

        if view.onShow?
            view.onShow()

    afterClose: (view)=>
        @currentView.el.remove()

        @currentView = view

    noAjaxRender: (view)=>
        view.open()

        if view.onShow?
            view.onShow()

        @currentView = view

    empty:->
        @el.empty()
