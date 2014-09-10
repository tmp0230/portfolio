class window.App extends Manager
    menu: null

    constructor:->
        super

        @region =
            mainRegion: new Region('#mainRegion')

    start:->
        new ProjectRouter()

        @menu = new Menu()
        new About()

        $('body').on('click', 'a:not(.real)', (evt)=>
            evt.preventDefault()
            url = $(evt.currentTarget).attr('href')

            if url != '#'
                @trigger(url)
                @vent.viewChanged.dispatch('view:show', url)
        )
