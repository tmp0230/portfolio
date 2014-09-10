class Menu

    switchMenu: (isTwoState)->
        if isTwoState
            $('#menu li:first').removeClass('is-hidden').addClass('is-floated-left')

        else
            $('#menu li:first').removeClass('is-floated-left').addClass('is-hidden')
