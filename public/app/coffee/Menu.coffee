class Menu

    goSingle: (state)->
        elMenu = $('#menu')

        if state
            elMenu.find('li:first').removeClass('is-floated-left').addClass('is-hidden')
            elMenu.find('li:last').removeClass('is-floated-right')

        else
            elMenu.find('li:first').removeClass('is-hidden').addClass('is-floated-left')
            elMenu.find('li:last').addClass('is-floated-right')
