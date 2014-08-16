class ProjectShow extends View
    el: null
    template: 'project-show.html'

    onShow:->
        @el = $('div.root-view:last')
