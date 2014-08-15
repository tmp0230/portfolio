class View
    url: null

    constructor: (@url)->

    open:->
        @el = $('#'+@el)

    triggerClose:->
        app.vent.viewClosed.dispatch()
