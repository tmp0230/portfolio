class About

    constructor:->
        $('#aboutLink').click((evt)->

            evt.preventDefault()

            $('#aboutContainer').addClass('show')
            $('#aboutClose').one('click', ->
                $('#aboutContainer').removeClass('show')
            )
        )
