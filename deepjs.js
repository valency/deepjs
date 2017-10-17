var None = null;

String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

String.prototype.overlap = function (s) {
    return this.toString().indexOf(s) > -1 || s.indexOf(this.toString()) > -1;
};

String.prototype.djangoFields = function (s) {
    var fields = this.toString().split("__");
    for (var i = 0; i < fields.length; i++) {
        if (is_empty(s)) return s;
        else s = s[fields[i]];
    }
    return s;
};

Array.prototype.contains = function (needle) {
    var find_nan = needle !== needle;
    var index_of;
    if (!find_nan && typeof Array.prototype.indexOf === "function") {
        index_of = Array.prototype.indexOf;
    } else {
        index_of = function (needle) {
            var index = -1;
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                if ((find_nan && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return index_of.call(this, needle) > -1;
};

Array.prototype.locateByKeyValue = function (key, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][key] === value) return i;
    }
    return -1;
};

Array.prototype.randomItem = function () {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.float = function () {
    var n = [];
    for (var i = 0; i < this.length; i++) {
        n.push(parseFloat(this[i]));
    }
    return n;
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

$.fn.enter = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            if ((ev.keyCode ? ev.keyCode : ev.which) === 13) {
                fnc.call(this, ev);
            }
        })
    })
};

$.fn.fileUpload = function (file_picker, file_server, callback_loading, callback_success, callback_error) {
    $(this).click(function () {
        file_picker.click();
    });
    file_picker.on('change', function () {
        var form = new FormData();
        var f = $(this).get(0).files;
        if (f.length > 0) {
            f = f[0];
            form.append('', f, f.name);
            if (callback_loading) callback_loading(file_picker);
            $.ajax({
                url: file_server,
                type: 'POST',
                data: form,
                processData: false,
                contentType: false,
                success: function (resp) {
                    if (callback_success) callback_success(file_picker, resp);
                }, error: function (resp) {
                    if (callback_error) callback_error(file_picker, resp);
                }
            });
        }
    });
};

function is_numeric(s) {
    return !isNaN(parseFloat(s)) && isFinite(s);
}

function is_empty(s) {
    return s === undefined || s === "undefined" || s === null || s === "null" || s === "";
}

function is_object(s) {
    return (s && typeof s === 'object' && !Array.isArray(s));
}

function url_page() {
    return window.location.pathname.split("/").pop();
}

function url_parameter(p) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === p) {
            return sParameterName[1];
        }
    }
}

function url_redirect(args) {
    var l = window.location;
    var params = {};
    var x = /(?:\??)([^=&?]+)=?([^&?]*)/g;
    var s = l.search;
    for (var r = x.exec(s); r; r = x.exec(s)) {
        r[1] = decodeURIComponent(r[1]);
        if (!r[2]) r[2] = '%%';
        params[r[1]] = r[2];
    }
    for (var i in args) {
        if (args.hasOwnProperty(i)) params[i] = encodeURIComponent(args[i]);
    }
    var search = [];
    for (var j in params) {
        var p = encodeURIComponent(j);
        var v = params[j];
        if (v !== '%%') p += '=' + v;
        search.push(p);
    }
    search = search.join('&');
    l.search = search;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function random_color() {
    return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
}

function replace_empty(s, es) {
    if (is_empty(s)) return es;
    else return s;
}

function Deeptime(t) {
    this.t = t;
    this.unix = function () {
        return Math.round((new Date(this.t)).getTime());
    };
    this.format = function (type) {
        var t = moment(this.t);
        if (type === 'd' || type === 'date') return t.format("YYYY-MM-DD");
        else if (type === 't' || type === 'time') return t.format("HH:mm:ss");
        else if (type === 'dt' || type === 'datetime') return t.format("YYYY-MM-DD HH:mm:ss");
        else if (type === 'r' || type === 'range') return t.fromNow();
        else return t.format();
    };
    this.timezone = function (from, to) {
        return new Deeptime(moment.tz(this.t, from).clone().tz(to));
    };
    this.range = function () {
        var seconds = (this.t / 1000).toFixed(0);
        var minutes = (this.t / (1000 * 60)).toFixed(0);
        var hours = (this.t / (1000 * 60 * 60)).toFixed(0);
        var days = (this.t / (1000 * 60 * 60 * 24)).toFixed(0);
        if (seconds < 60) {
            return seconds + " 秒";
        } else if (minutes < 60) {
            return minutes + " 分钟";
        } else if (hours < 24) {
            return hours + " 小时";
        } else {
            return days + " 日"
        }
    }
}

function Deepdict(dict) {
    this.dict = dict;
    this.getKeyByValue = function (value) {
        for (const i in this.dict) {
            if (this.dict.hasOwnProperty(i)) {
                if (this.dict[i] === value) return i;
            }
        }
    };
    this.merge = function (source) {
        if (is_object(this.dict) && is_object(source)) {
            for (const key in source) {
                if (source.hasOwnProperty(key) && is_object(source[key])) {
                    if (!this.dict[key]) {
                        Object.assign(this.dict, {
                            key: {}
                        });
                    }
                    this.dict[key] = new Deepdict(this.dict[key]).merge(source[key]);
                } else {
                    Object.assign(this.dict, {
                        key: source[key]
                    });
                }
            }
        }
        return this.dict;
    };
    this.min = function () {
        var keys = Object.keys(this.dict);
        var keys_float = keys.float();
        var keys_min = keys_float.min();
        var keys_id = keys_float.indexOf(keys_min);
        if (isNaN(keys_min)) {
            return [];
        } else {
            var d = (new Deepdict(this.dict[keys[keys_id]])).min();
            d.push(keys[keys_id]);
            return d;
        }
    };
    this.max = function () {
        var keys = Object.keys(this.dict);
        var keys_float = keys.float();
        var keys_max = keys_float.max();
        var keys_id = keys_float.indexOf(keys_max);
        if (isNaN(keys_max)) {
            return [];
        } else {
            var d = (new Deepdict(this.dict[keys[keys_id]])).max();
            d.push(keys[keys_id]);
            return d;
        }
    };
}

