//：中文Shift+A，Shift+Z：译文

var Z = 90,
	A = 65,
	STORAGE_KEY = "blog_data",
    STORAGE_COUNT = "blog_count",
    STORAGE_ENABLE = "enable";

(function () {
    rangy.init();
    $(document.body).append("<div class='chrome_ext_msg_container'><div id='chromeExtMsg'></div></div>");

    // 是否启用侧边栏
    globalStorage.getData(STORAGE_ENABLE, function (data) {
        if (data.value != "0") {
            $(document.body).append("<div class='chrome_ext_slider' id='chromeExtSlider'><div id='chromeExtCount'></div><input type='button' value='撤消' class='chrome_ext_save_prev'/><input type='button' value='复制' class='copy'/><input type='button' value='清除' class='chrome_ext_redo'/></div>");

            document.getElementById("chromeExtSlider").ondragover = function (event) {
                event.preventDefault();
            };

            document.getElementById("chromeExtSlider").ondrop = function (event) {
                var data;
                if (event.dataTransfer.getData("url")) {
                    var url = event.dataTransfer.getData("url");
                    data = wrapText("<img src='" + url + "'/>");
                }
                else {
                    data = getWords();
                }

                saveSelection(data);
                event.preventDefault();
            };

            globalStorage.getData(STORAGE_COUNT, function (data) {
                var count = !data.value ? 0 : parseInt(data.value);

                setCount(count);
            });
        }
    });

    addImgTag();
})();

function addImgTag(){
    $("img").after("<div class='chrome_ext_add_icon'><img src='icon48.png' style='width:20px;height:40px;'/></div>");
}

// 绑定快捷键(Shift + A)缓存选择区域
$(document).keypress(function (e) {
    if (e.shiftKey && e.which == A) {
        saveSelection();
    } 
})

function saveSelection(text) {
    globalStorage.getData(STORAGE_KEY, function (data) {
        var val = data.value;

        if (!text) {
            text = getWords();
        }

        val += text;
        globalStorage.setData(STORAGE_KEY, val);
        globalStorage.getData(STORAGE_COUNT, function (data) {
            var count = !data.value ? 0 : parseInt(data.value);

            count++;
            setCount(count);
            globalStorage.setData(STORAGE_COUNT, count);
        });
        showExMsg("选择成功！", 1000);
    });
}

function getWords() {
    return wrapText(rangy.getSelection().toHtml());
}

function wrapText(text) {
    return "<p class='ext_content'>" + text + "</p>";
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

        var html = "<div id='chromeExtContainer'><div class='st_all_data'><div class='header'>您的博文<span class='chrome_ext_option'><label><input type='checkbox' id='chromeExtShowSlider'/>是否启用左边栏</label></span></div>";
        html += "<textarea id='chromeExtData' class='hide'>" + backHtml + "</textarea>";
        html += "<iframe id='chromeExtPreviewFrame'/>";
        html += "<div class='buttons'><input type='button' value='撤消' class='chrome_ext_save_prev'/><input type='button' value='复制' class='copy'/><input type='button' value='清除' class='chrome_ext_redo'/><input type='button' value='关闭' class='close' /></div>";
        html += "</div></div>";

        doc.append(html);

        $("#chromeExtPreviewFrame")[0].contentWindow.document.designMode = 'On';
        $("#chromeExtPreviewFrame")[0].contentWindow.document.body.innerHTML = backHtml;

        globalStorage.getData(STORAGE_ENABLE, function (data) {
            if (data.value != "0") {
                $("#chromeExtShowSlider").attr("checked", true);
            }
        });
    });
}

$(document).on("click", "#chromeExtShowSlider", function() {
    if (this.checked) {
        globalStorage.setData(STORAGE_ENABLE, 1);
    }
    else {
        globalStorage.setData(STORAGE_ENABLE, 0);
    }
});

$(document).on("click", ".st_all_data .close", function () {
    $("#chromeExtContainer").fadeOut().remove();
})

$(document).on("click", ".st_all_data .copy,.chrome_ext_slider .copy", function () {
    globalStorage.copy(STORAGE_KEY, function (backData) {
        emptyData();
        setCount(0);
        globalStorage.setData(STORAGE_COUNT, 0);
        $("#chromeExtContainer").fadeOut().remove();
        showExMsg("复制成功！");
    });
})

$(document).on("click", ".st_all_data .chrome_ext_redo, .chrome_ext_slider .chrome_ext_redo", function () {
    emptyData();
    globalStorage.setData(STORAGE_COUNT, 0);
    setCount(0);
    $("#chromeExtContainer").fadeOut().remove();
    showExMsg("清除成功！");
})

$(document).on("click", ".st_all_data .chrome_ext_save_prev,.chrome_ext_slider .chrome_ext_save_prev", function () {
    globalStorage.getData(STORAGE_KEY, function (data) {
        var container = $("<div id='chromeExtTemp' style='display:none;'></div>");

        $(document.body).append(container);
        container.html(data.value);

        if ($(".ext_content", container).length == 1) {
            $(".ext_content:first", container).remove();
        }
        else if ($(".ext_content", container).length > 1){
            $(".ext_content:last", container).remove();
        }
        else{
            showExMsg("没有数据！");
            return;
        }

        globalStorage.setData(STORAGE_KEY, container.html());
        container.remove();
        globalStorage.getData(STORAGE_COUNT, function (data) {
            var count = !data.value ? 0 : parseInt(data.value);

            count = count > 0 ? --count : 0;
            setCount(count);
            globalStorage.setData(STORAGE_COUNT, count);
        });
        showExMsg("撤消成功！", 1000);
        $("#chromeExtContainer").fadeOut().remove();
    });
})

function setCount(val) {
    $("#chromeExtCount").html(val);
}

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