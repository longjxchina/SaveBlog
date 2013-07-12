function loadData() {
    try {
        chrome.tabs.executeScript(null, { code: "showSavedData()" });
    }
    catch (e) {
        chrome.tabs.executeScript(null, { code: "alert('“收集博客”未能及时加载，请刷新网页重试！')" });
    }
}

chrome.browserAction.onClicked.addListener(loadData);

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    var operate = request.operate ? request.operate : null;

    // 复制
    if (request.data) {
        window.Clipboard.copy(request.data);
        sendResponse();
    }

    switch (operate) {
        case "save_data":
            {
                window.localStorage.setItem(request.key, request.value);
                break;
            }
        case "get_data":
            {
                var val = window.localStorage.getItem(request.key);

                val = !val ? "" : val;

                sendResponse({ "value": val });
                break;
            }
        case "remove_item":
            {
                window.localStorage.removeItem(request.key);
                break;
            }
        case "copy_data":
            {
                var data = window.localStorage.getItem(request.key);

                window.Clipboard.copy(data);
                sendResponse();
            }
        default:
            break;
    }
});

(function() {
  var Clipboard, root;

  Clipboard = {
    _createTextArea: function() {
      var textArea;
      textArea = document.createElement("textarea");
      textArea.style.position = "absolute";
      textArea.style.left = "-100%";
      return textArea;

     /* var textArea;
      textArea = document.createElement("iframe");
      textArea.style.position = "absolute";
      textArea.style.left = "-100%";
      return textArea;*/
    },
    copy: function(data) {
      var textArea;
      textArea = this._createTextArea();
      textArea.value = data;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("Copy");
      return document.body.removeChild(textArea);
    },
    paste: function() {
      var textArea, value;
      textArea = this._createTextArea();
      document.body.appendChild(textArea);
      textArea.focus();
      document.execCommand("Paste");
      value = textArea.value;
      document.body.removeChild(textArea);
      return value;
    }
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.Clipboard = Clipboard;

}).call(this);

