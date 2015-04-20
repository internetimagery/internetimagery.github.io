downloader = ()->
    $ "download"
    .each (i, el)->
        repo = $ el
        .text()
        $.get "https://api.github.com/repos/internetimagery/#{repo}/releases/latest", (data)->
            console.log data
            if data.assets[0]
                console.log "here"
                name = data.assets[0].name
                link = data.assets[0].browser_download_url
            else
                name = repo
                link = data.zipball_url
            $ el
            .html "<a href=\"#{link}\">DOWNLOAD: #{name}</a>"

InstantClick.on 'change', downloader
