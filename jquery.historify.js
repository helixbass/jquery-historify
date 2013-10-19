(function() {
  var __slice = [].slice;

  (function($) {
    var cascade, plug, startsWith;

    startsWith = function(str, prefix) {
      return str.substring(0, prefix.length) === prefix;
    };
    cascade = function() {
      var objs;

      objs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return function(attr) {
        var obj, _i, _len;

        for (_i = 0, _len = objs.length; _i < _len; _i++) {
          obj = objs[_i];
          if ((obj != null ? obj[attr] : void 0) != null) {
            return obj[attr];
          }
        }
        return void 0;
      };
    };
    return $.historify = plug = {
      options: {
        linkSelector: "nav li a",
        contentSelector: "#content",
        fadeDuration: 800,
        hide: function(done, _option) {
          return plug.content.animate({
            opacity: 0
          }, _option('fadeDuration'), done);
        },
        stopHide: function() {
          return plug.content.stop(true, true);
        },
        attach: function($dataContent) {
          return plug.content.html($dataContent.html());
        },
        show: function(_option) {
          return plug.content.animate({
            opacity: 1
          }, _option('fadeDuration'));
        },
        afterShow: function() {},
        scrollOptions: {
          duration: 800,
          easing: "swing"
        },
        matchingLinkSelector: function(url, relativeUrl) {
          return "a[href='" + relativeUrl + "'],\na[href='/" + relativeUrl + "'],\na[href='" + url + "']";
        },
        navActiveFilter: function(_option, url, relativeUrl) {
          return function() {
            return $(this).has(_option("matchingLinkSelector")(url, relativeUrl));
          };
        },
        updateNav: function(_option, url, relativeUrl) {
          return $(_option("navSelector")).removeClass(_option("navActiveClass")).filter(_option("navActiveFilter")(_option, url, relativeUrl)).addClass(_option("navActiveClass"));
        },
        navSelector: "nav li",
        navActiveClass: "active"
      },
      init: function(options) {
        var $body, $content, addScript, clean, rootUrl, setTitle, _option;

        if (!(typeof History !== "undefined" && History !== null ? History.enabled : void 0)) {
          return false;
        }
        rootUrl = History.getRootUrl();
        $.expr[":"].internal = function(obj) {
          var url;

          url = $(obj).attr("href");
          return startsWith(url, rootUrl) || url.indexOf(":") === -1;
        };
        _option = cascade(options, plug.options);
        $body = $("body");
        $body.on("click", _option("linkSelector"), function(event) {
          var $this, _ref;

          if (event.which === 2 || event.metaKey) {
            return true;
          }
          $this = $(this);
          History.pushState(null, (_ref = $this.attr("title")) != null ? _ref : null, $this.attr("href"));
          event.preventDefault();
          return false;
        });
        plug.contentSelector = _option("contentSelector");
        $content = plug.content = $(plug.contentSelector);
        addScript = function() {
          return $.getScript($(this).attr("src"));
        };
        setTitle = function() {
          var Exception;

          document.title = $(this).text();
          try {
            return document.getElementsByTagName("title")[0].innerHTML = document.title.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ");
          } catch (_error) {
            Exception = _error;
          }
        };
        clean = function(data) {
          return $.trim(String(data)).replace(/<\!DOCTYPE[^\>]*/i, "").replace(/<(html|head|body|title|meta|script)([\s\>])/gi, "<div class='document-$1'$2").replace(/<\/(html|head|body|title|meta|script)\>/gi, "</div>");
        };
        return $(window).on("statechange", function() {
          var abort, done, jqXHR, url;

          $body.addClass("loading");
          url = History.getState().url;
          abort = function() {
            document.location.href = url;
            return false;
          };
          jqXHR = $.get(url).fail(abort);
          done = function(data) {
            var $data, $dataContent, $scripts, relativeUrl, _base, _base1, _base2;

            $data = $(clean(data));
            $dataContent = $data.find(_option("contentSelector"));
            $scripts = $data.find(".document-script");
            if ($scripts.length) {
              $scripts.detach();
            }
            if (!$dataContent.html()) {
              abort();
            }
            relativeUrl = url.replace(rootUrl, "");
            if (typeof (_base = _option("updateNav")) === "function") {
              _base(_option, url, relativeUrl);
            }
            if (typeof (_base1 = _option("stopHide")) === "function") {
              _base1();
            }
            if (typeof (_base2 = _option("beforeAttach")) === "function") {
              _base2($dataContent);
            }
            _option("attach")($dataContent);
            plug.content.trigger("attach");
            _option("show")(_option);
            _option("afterShow")();
            $data.find(".document-title").each(setTitle);
            $scripts.each(addScript);
            if (typeof $body.scrollTo === "function") {
              $body.scrollTo(_option("scrollOptions"));
            }
            $body.removeClass("loading");
            if (typeof pageTracker !== "undefined" && pageTracker !== null) {
              pageTracker._trackPageview(relativeUrl);
            }
            return typeof reinvigorate !== "undefined" && reinvigorate !== null ? typeof reinvigorate.ajax_track === "function" ? reinvigorate.ajax_track(url) : void 0 : void 0;
          };
          if (!_option("stopHide")) {
            return $.when(jqXHR, $.Deferred(function(dfd) {
              return _option("hide")(dfd.resolve, _option);
            }).promise()).done(done);
          } else {
            _option("hide")((function() {}), _option);
            return jqXHR.done(done);
          }
        });
      }
    };
  })(jQuery);

}).call(this);
