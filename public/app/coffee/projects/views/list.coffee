class ProjectList extends View
    el: 'projectList'
    template: 'partials/project-list.html'

    onShow:->
        @setLetters()

    setLetters:->
        lettersEl = $('.letter')
        height = $(document).height()

        for i in [0 .. lettersEl.length - 1]

            lettersEl.eq(i).css('top', i * height/lettersEl.length)

        lettersEl.addClass('is-visible')
