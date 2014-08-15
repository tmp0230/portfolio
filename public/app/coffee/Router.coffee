class Router

    constructor:->
        app.vent.viewChanged.add(@switchView)

        History.Adapter.bind(window, 'statechange', (evt)=>

            currentIndex = History.getCurrentIndex()
            internal = (History.getState().data._index == (currentIndex - 1))

            if internal
                return

            @switchView('view:show')
        )

        @switchView('view:show')
