class ProjectShow extends View
    el: null
    template: 'partials/project-show.html'

    onShow:->
        @el = $('div.root-view:last')
