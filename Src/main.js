//：中文Shift+A，Shift+Z：译文

var Z = 90,
	A = 65,
	STORAGE_KEY = "blog_data";

$(function () {
    rangy.init();
    $(document.body).append("<div class='chrome_ext_msg_container'><div id='chromeExtMsg'></div></div>");
    $(document.body).append("<div class='chrome_ext_slider' id='chromeExtSlider'><input type='button' value='撤消' class='chrome_ext_save_prev'/><input type='button' value='复制' class='copy'/><input type='button' value='清除' class='chrome_ext_redo'/></div>");

    document.getElementById("chromeExtSlider").ondragover = function (event) {
        event.preventDefault();
    };

    document.getElementById("chromeExtSlider").ondrop = function (event) {
        saveSelection();
    };
});

$(document).keypress(function (e) {
    if (e.shiftKey && e.which == A) {
        saveSelection();
    } else if (e.shiftKey && e.which == Z) {
        
    }
})

function saveSelection() {
    globalStorage.getData(STORAGE_KEY, function (data) {
        var a = data.value;

        a += getWords();
        globalStorage.setData(STORAGE_KEY, a);
        showExMsg("选择成功！", 1000);
    });
}
 
function getWords(){
     return "<p class='ext_content'>" + rangy.getSelection().toHtml() + "</p>";
} 

function emptyData(){
	globalStorage.remove(STORAGE_KEY);
}

function showSavedData(){
    globalStorage.getData(STORAGE_KEY, function (data) {
        var backHtml = data.value;
        var doc = $(document.body);

        if ($("#chromeExtContainer").length > 0) {
            $("#chromeExtContainer").remove();
            return;
        }

        var html = "<div id='chromeExtContainer'><div class='st_all_data'><div class='header'>您的博文</div>";
        html += "<textarea id='chromeExtData' class='hide'>" + backHtml + "</textarea>";
        html += "<iframe id='chromeExtPreviewFrame'/>";
        html += "<div class='buttons'><input type='button' value='撤消' class='chrome_ext_save_prev'/><input type='button' value='复制' class='copy'/><input type='button' value='清除' class='chrome_ext_redo'/><input type='button' value='关闭' class='close' /></div>";
        html += "</div></div>";

        doc.append(html);

        $("#chromeExtPreviewFrame")[0].contentWindow.document.designMode = 'On';
        $("#chromeExtPreviewFrame")[0].contentWindow.document.body.innerHTML = backHtml;
    });	
}

$(document).on("click", ".st_all_data .close",function(){
    $("#chromeExtContainer").fadeOut().remove();
})

$(document).on("click", ".st_all_data .copy", function () {
    var text = $("#chromeExtPreviewFrame")[0].contentWindow.document.body.innerHTML;

    chrome.extension.sendRequest({ data: text }, function () {
        emptyData();
        showExMsg("复制成功！");
    });
})

$(document).on("click", ".st_all_data .chrome_ext_redo", function () {
    $("#chromeExtPreviewFrame")[0].contentWindow.document.body.innerHTML = "";
    emptyData();
    showExMsg("清除成功！");
})

$(document).on("click", ".st_all_data .chrome_ext_save_prev", function () {
    globalStorage.getData(STORAGE_KEY, function (data) {
        var container = $("<div id='chromeExtTemp' style='display:none;'></div>");

        $(document.body).append(container);
        container.html(data.value);
        $(".ext_content:last", container).remove();
        globalStorage.setData(STORAGE_KEY, container.html());
        container.remove();
        showExMsg("撤消成功！", 1000);
        $("#chromeExtContainer").fadeOut().remove();
    });
})

// 显示提示消息
function showExMsg(msg, delay) {
    $("#chromeExtMsg").text(msg);
    $("#chromeExtMsg").fadeIn();

    var theDelay = 2000;

    if (delay) {
        theDelay = delay;
    }

    setTimeout(function () {
        $("#chromeExtMsg").fadeOut();
    }, theDelay);
}