class App extends Manager

    constructor:->
        super

        @region =
            mainRegion: new Region('#mainRegion')
            asideRegion: new Region('#asideRegion')

    start:->
        new ProjectRouter()

        $('body').on('click', 'a:not(.real)', (evt)=>
            evt.preventDefault()
            url = $(evt.currentTarget).attr('href')

            @trigger(url)
            @vent.viewChanged.dispatch('view:show', url)
        )
