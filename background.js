function loadData() {
	chrome.tabs.executeScript(null,{code:"showSavedData()"});
}

chrome.browserAction.onClicked.addListener(loadData);

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {	
	if (request && request.data){
		window.Clipboard.copy(request.data);
		sendResponse();
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

