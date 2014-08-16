class Manager
    region: null
    vent: null

    constructor:->
        Signal = signals.Signal

        @vent =
            viewClosed: new Signal()
            viewChanged: new Signal()

    trigger: (url)->
        if History.getState().url != url
            History.pushState({_index: History.getCurrentIndex()}, null, url)
