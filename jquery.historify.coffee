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
           "nav li a"
          contentSelector:
           "#content"
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
           ( $dataContent ) ->
             plug.content
                 .html( $dataContent.html())
                 .animate
                          opacity:
                           1
                         ,
                          800
          afterShow: ->
          scrollOptions:
           duration:
            800
           easing:
            "swing"
          matchingLinkSelector: ( url, \
                                  relativeUrl ) ->
             """
              a[href='#{ relativeUrl }'],
              a[href='/#{ relativeUrl }'],
              a[href='#{ url }']
             """
          navActiveFilter: ( _option, \
                             url, \
                             relativeUrl ) ->
            ->
             $( this )
              .has _option( "matchingLinkSelector" )( url,
                                                      relativeUrl )
          updateNav: ( _option, \
                       url, \
                       relativeUrl ) ->
            $( _option "navSelector" )
             .removeClass( _option "navActiveClass" )
             .filter( _option( "navActiveFilter" )( _option,
                                                    url,
                                                    relativeUrl ))
               .addClass _option "navActiveClass"
          navSelector:
           "nav li"
          navActiveClass:
           "active"

      init: ( options ) ->
          return no unless History?.enabled

          rootUrl = History.getRootUrl()

          $.expr[ ":" ]
           .internal =
            ( obj ) ->
              url = $( obj ).attr "href"
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

          plug.contentSelector = _option "contentSelector"
          $content =
           plug.content = $ plug.contentSelector

          addScript = ->
            $.getScript $( this )
                         .attr( "src" )

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

                   $scripts = $data.find ".document-script"
                   $scripts.detach() if $scripts.length

                   abort unless $dataContent.html()

                   relativeUrl = url.replace rootUrl,
                                             ""

                   _option( "updateNav" )?( _option,
                                            url,
                                            relativeUrl )

                   _option( "stopHide" )?()

                   _option( "show" )( $dataContent )

                   _option( "afterShow" )()

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

                 unless _option "stopHide"
                   $.when( jqXHR,
                           $.Deferred(( dfd ) ->
                                        _option( "hide" )( dfd.resolve ))
                            .promise())
                    .done( done )
                 else
                   _option( "hide" ) ->
                   jqXHR.done done
) jQuery
