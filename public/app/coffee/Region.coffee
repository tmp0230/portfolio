class Region
    el: null
    currentView: null

    constructor: (el)->
        @el = $(el)

    show: (view, renderedTemplate)->
        @el.append(renderedTemplate)

        if @currentView.onClose?
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

    empty:->
        @el.empty()
