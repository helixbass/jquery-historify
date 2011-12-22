(( $ ) ->
  startsWith = ( str, \
                 prefix ) ->
                str.substring( 0,
                               prefix.length ) is
                 prefix

  cascade =
   ( objs... ) ->
     ( attr ) ->
       return obj[ attr ] for obj in objs when obj?[ attr ]?

       undefined

  $.historify = plug =
      options:
          linkSelector:
           "a:internal:not(.no-ajaxy)"
          contentSelector:
           "#content"
          waitForHide:
           no
          hide:
           ( done ) ->
             plug.content
                 .animate
                          opacity:
                           0
                         ,
                          800,
                          done
          stopHide: ->
             plug.content
                 .stop yes,
                       yes
          show:
           ( $data ) ->
             plug.content
                 .css( "opacity",
                       100 )
                 .show()

          scrollOptions:
           duration:
            800
           easing:
            "swing"
          updateNav: ( _option, \
                       url, \
                       relativeUrl ) ->
            $( _option "navSelector" )
             .removeClass( _option "navActiveClass" )
             .has( """
                    a[href^='#{ relativeUrl }'],
                    a[href^='/#{ relativeUrl }'],
                    a[href^='#{ url }']
                   """ )
             .addClass _option "navActiveClass"
          navSelector:
           "nav > ul > li"
          navActiveClass:
           "active"

      init: ( options ) ->
          return no unless History?.enabled

          rootUrl = History.getRootUrl()

          $.expr[ ":" ]
           .internal =
            ( url ) ->
              startsWith( url,
                          rootUrl ) or
               url.indexOf( ":" ) is -1

          _option = cascade options,
                            plug.options

          $body = $ "body"
          $body
           .on "click",
               _option( "linkSelector" ),
               ( event ) ->
                 return yes if \
                  event.which is 2 or
                  event.metaKey

                 $this = $( this )
                 History.pushState null,
                                   $this
                                    .attr( "title" ) ?
                                    null,
                                   $this
                                    .attr "href"
                 event.preventDefault()
                 no

          $content =
           plug.content =
            $ _option "contentSelector"

          addScript = ->

          setTitle = ->
            document.title = $( this )
                              .text()
            try
                document.getElementsByTagName( "title" )[ 0 ]
                        .innerHTML =
                 document.title
                         .replace( "<",
                                   "&lt;" )
                         .replace( ">",
                                   "&gt;" )
                         .replace( " & ",
                                   " &amp; " )
            catch Exception
          clean = ( data ) ->
            String( data )
                  .replace( ///
                             <\!DOCTYPE
                             [^\>] *
                            ///i,
                            "" )
                  .replace( ///
                             <
                             (
                              html |
                              head |
                              body |
                              title |
                              meta |
                              script
                             )
                             (
                              [\s\>]
                             )
                            ///gi,
                            "<div class='document-$1'$2" )
                  .replace( ///
                             </
                             (
                              html |
                              head |
                              body |
                              title |
                              meta |
                              script
                             )
                             \>
                            ///gi,
                            "</div>" )

          $( window )
           .on "statechange",
               ->
                 $body
                  .addClass "loading"

                 { url } = History.getState()

                 abort = ->
                   document.location
                           .href =
                    url
                   no

                 jqXHR = $.get( url )
                          .fail( abort )

                 done = ( data ) ->
                   $data = $ clean data

                   $dataContent = $data.find _option "contentSelector"

                   $scripts = $dataContent.find ".document-script"
                   $scripts.detach() if $scripts.length

                   contentHtml = $dataContent.html()
                   abort unless contentHtml

                   relativeUrl = url.replace rootUrl,
                                             ""

                   _option( "updateNav" )?( _option,
                                            url,
                                            relativeUrl )

                   $content
                    .html( contentHtml )

                   _option( "show" )( $data )

                   $data
                    .find( ".document-title" )
                      .each setTitle

                   $scripts
                    .each addScript

                   $body
                    .scrollTo?( _option "scrollOptions" )

                   $body
                    .removeClass "loading"

                   pageTracker?._trackPageview relativeUrl
                   reinvigorate?.ajax_track?( url )

                 if _option "waitForHide"
                   $.when( jqXHR,
                           $.Deferred(( dfd ) ->
                                        _option( "hide" )( dfd.resolve ))
                            .promise())
                    .done( done )
                 else
                   _option( "stopHide" )()
                   jqXHR.done done
) jQuery
