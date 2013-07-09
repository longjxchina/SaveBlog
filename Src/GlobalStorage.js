function GlobalStorage() {
    if (GlobalStorage.prototype.set === undefined) {
        GlobalStorage.prototype.setData = function (key, value) {
            var operate = "save_data";

            GlobalStorage.prototype.set(operate, key, value);
        }

        GlobalStorage.prototype.getData = function (key, callback) {
            var operate = "get_data";
            var savedData = null;

            savedData = GlobalStorage.prototype.get(operate, key, callback);
        }

        // 设置全局储存
        GlobalStorage.prototype.set = function (operate, key, value) {
            if (!key || !value) {
                return;
            }

            chrome.extension.sendRequest({ "operate": operate, "key": key, "value": value });
        }

        // 获取全局存储
        GlobalStorage.prototype.get = function (operate, key, backDataHandler) {
            var savedData = null;

            if (!key) {
                return;
            }

            chrome.extension.sendRequest({ "operate": operate, "key": key }, function (data) {
                if (backDataHandler) {
                    backDataHandler(data);
                }
            });
        }

        GlobalStorage.prototype.remove = function (key, callback) {
            var operate = "remove_item";

            chrome.extension.sendRequest({ "operate": operate, "key": key }, function (data) {
                callback(data);
            });
        }
    }
}

window.globalStorage = new GlobalStorage();