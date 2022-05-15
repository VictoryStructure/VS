Const Confirm = {
    open(options) {
        options = Object.assign({}, {
            title: "",
            message: "",
            okText: "OK",
            cancelText: "Cancel",
            onok: function () { },
            oncancel: function () { }
        }, options);
        console.log(options);
    },
    _close(confirmEL) {

    }
};