class Region
    el: null
    currentView: null
    firstRender: true
    loader: null

    constructor:(el)->
        @el = $(el)

    show:(view)->
        #if @el.css('display') == 'none'
            #@el.show()

        # Is this the first page rendered via PHP

        if @firstRender
            @firstRender = false
            app.ajaxManager.setFirstPageCache(view.url)

            #return @noAjaxRender(view)
            return @preloadMedia(@noAjaxRender, view)

        data = app.ajaxManager.get(view.url)

        # Transitions

        @el.velocity(
            'scroll'
        ,
            queue: false
            duration: 600
            offset: -70
        ).velocity(
            opacity: 0
        , 600, =>

            # Wait for the ajax call

            if data.promise?

                # Show loader

                #app.ajaxManager.showLoader()

                data.then((result)=>

                    #@switchView(view, result)
                    @preloadMedia(@switchView, view, result)
                , ->

                    console.error('Failed to get data')
                )

            # We have it in cache

            else
                #@switchView(view, data)
                @preloadMedia(@switchView, view, data)
        )

    switchView:(view, data)=>
        data = $(data).filter(@el.selector).html()
        console.log 'get datas !'
        #data.attr('id', view.el)

        #if @currentView?

        @el.append(data)

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

        #else
            #@el.html(data)

            #@noAjaxRender()

    afterClose:(view)=>
        @currentView.el.remove()

        @currentView = view

    noAjaxRender:(view)=>
        view.open()

        if view.onShow?
            view.onShow()

        @currentView = view

    #close:->
        #@el.empty().hide()

    preloadMedia:(callback, view, result)=>

        myRegexp = new RegExp('<img(?=[^>]+class="[^"]+rm-preload[^"]*")[^>]+src="([^"]+)"', 'g')

        if result?
            stringToParse = result

        else
            stringToParse = $('body').html()

        match = myRegexp.exec(stringToParse)

        if match == null
            # Remove loader

            #app.ajaxManager.hideLoader()

            callback(view, result)

        else
            @loader = new PxLoader()

            while match != null
                @loader.addImage(match[1])

                match = myRegexp.exec(stringToParse)

            @loader.addCompletionListener(->

                console.log 'loaded imgs'
                # Remove loader

                #app.ajaxManager.hideLoader()

                callback(view, result)
            )

            @loader.start()
