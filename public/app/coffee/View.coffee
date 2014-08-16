class View

    open:->
        @el = $('#'+@el)

    triggerClose:->
        app.vent.viewClosed.dispatch()
