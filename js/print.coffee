printview = ()=>
    alert "Entering Print View.\nReload page to exit."

    $ "body"
    .children()
    .hide()

    $ "#desktop"
    .prependTo $ "body"
    .show()