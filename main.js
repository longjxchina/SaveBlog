//：中文Shift+A，Shift+Z：译文

var Z = 90,
	A = 65,
	st_original = "st_original",
	st_all = "st_all";
	
$(function(){
	
});

$(document).keypress(function (e) {
    if (e.shiftKey && e.which == A) {
        var blogContent = getWords(),
			all = getLocalStorage(st_all);

        all += blogContent;
        window.localStorage.setItem(st_all, all);
    } else if (e.shiftKey && e.which == Z) {

    }
}) 
 
 function getWords(){  
    return "<p class='ext_content'>" + window.getSelection() + "</p>";
}  

function getLocalStorage(key){
	var text = window.localStorage.getItem(key);
	
	if (text){
		return text;
	}
	
	return "";
}

function emptyData(){
	window.localStorage.setItem(st_all,"");
}

function showSavedData(){
	var data = getLocalStorage(st_all);
	var doc = $(document.body);
	
	if ($(".st_all_data").length > 0){
		$(".st_all_data").remove();
		return;
	}
	
	var html = "<div class='st_all_data'><div class='header'>您的博文</div><div id='chromeExtBlogContent'>" + data +"</div><textarea rows='20' cols='100' id='data'>" + data + "</textarea>";
	html += "<div class='buttons'><input type='button' value='复制' class='copy'/><input type='button' value='重做' id='redo'/><input type='button' value='关闭' class='close' /></div>";
	html += "</div>";
	
	doc.append(html);
}

$(document).on("click", ".st_all_data .close",function(){
	$(".st_all_data").fadeOut().remove();
})

$(document).on("click", ".st_all_data .copy", function(){
	var text = $("#data").val();
	
	chrome.extension.sendRequest({data: text}, function(){
		emptyData();
		$("#data").text("复制成功！");
	});
})

$(document).on("click", ".st_all_data #redo", function () {
    var text = $("#data").val("");
    $("#chromeExtBlogContent").html("");
    emptyData();
})

function copyToClipBoard(text){       
	window.Clipboard.copy("hello world");
}   
 