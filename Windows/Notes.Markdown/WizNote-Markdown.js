﻿;(function() {
    var WizMD_pluginPath = objApp.GetPluginPathByScriptFileName("WizNote-Markdown.js");
    var WizMD_inited = -1;
    var isMarkdown;

    function WizIsMarkdown(doc) {
        try {
            var title = doc.title;

            if (-1 != title.indexOf(".md")) {
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    }

    //---------------------------------------------------------------
    eventsHtmlDocumentComplete.add(OnMarkdownHtmlDocumentComplete);


    function OnMarkdownHtmlDocumentComplete(doc) {
        isMarkdown = WizIsMarkdown(doc);
        if (isMarkdown) {
            WizInitMarkdown(doc);
            WizMD_inited = 1;
        }
        else {
            WizMD_inited = 0;
        }
    }
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    function WizMDInsertElem(doc, part, elem_type, callbackfunc) {
        var WizMD_pluginPath = WizMD_pluginPath;
        var oPart = doc.getElementsByTagName(part).item(0);
        var oElem = doc.createElement(elem_type);
        callbackfunc(oElem);
        oPart.insertBefore(oElem, null);
        return oElem;
    }
    //--------------------------------------------

    function WizMDAppendScriptSrc(doc, part, script_type, str, isServer) {
        return WizMDInsertElem(doc, part, "script", function(oScript) {
            oScript.type = script_type;
            if (isServer) {
                oScript.src = str;
            } else {
                oScript.src = ("file:///" + WizMD_pluginPath + str).replace(/\\/g, '/');
            }
        }
      );
    }

    function WizMDAppendCssSrc(doc, str) {
        WizMDInsertElem(doc, 'HEAD', "link", function(oCss) {
            oCss.rel = "stylesheet";
            oCss.href = ("file:///" + WizMD_pluginPath + str).replace(/\\/g, '/');
        }
      );
    }

    function WizMDAppendScriptInnerHtml(doc, part, script_type, innerHtmlStr) {
        WizMDInsertElem(doc, part, "script", function(oScript) {
            oScript.type = script_type;
            oScript.innerHTML = innerHtmlStr;
        }
      );
    }
    /*
    *解析markdown内容
    */

    function WizInitMarkdown(doc) {
        WizMDAppendCssSrc(doc, "markdown\\GitHub2.css");
       
        WizMDAppendScriptSrc(doc, 'HEAD', "text/javascript", "markdown\\marked.min.js");
        WizMDAppendScriptSrc(doc, 'HEAD', "text/javascript", "google-code-prettify\\prettify.js");
        var jqueryScript = WizMDAppendScriptSrc(doc, 'HEAD', "text/javascript", "markdown\\jquery.min.js");
        jqueryScript.onload = function() {
            WizMDAppendScriptSrc(doc, 'HEAD', "text/javascript", "wiznote-markdown-inject.js");
        };
    }
})();

