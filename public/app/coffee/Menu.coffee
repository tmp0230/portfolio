class Menu
    vent: null

    constructor:->
        Signal = signals.Signal

        @vent =
            menuChanged: new Signal()

        @vent.menuChanged.add(@switchMenu)

    switchMenu: (isTwoState)->
        if isTwoState
            $('#menu li:first').removeClass('is-hidden').addClass('is-floated-left')

        else
            $('#menu li:first').removeClass('is-floated-left').addClass('is-hidden')
