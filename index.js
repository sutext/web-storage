Object.defineProperty(exports, "__esModule", { value: true });

var orm = globalThis.orm || (globalThis.orm = {});
(function (orm) {
    var FIELD_KEY = "__orm_field";
    var CLASS_KEY = "__orm_class";
    var INDEX_KEY = "__orm_index";
    var _stored = {};
    orm._storage = globalThis.localStorage;
    function awake(cls, json) {
        if (!json) return undefined;
        var obj = new cls();
        Object.assign(obj, json);
        var fields = cls[FIELD_KEY];
        if (fields) {
            var _loop_1 = function (field_1) {
                var subjson = obj[field_1];
                if (!subjson) return "continue";
                var conf = fields[field_1];
                if (Array.isArray(subjson)) {
                    obj[field_1] = subjson.map(function (sb) {
                        return awake(conf.cls, sb);
                    });
                } else if (conf.map) {
                    var result = (obj[field_1] = {});
                    for (var key in subjson) {
                        result[key] = awake(conf.cls, subjson[key]);
                    }
                } else {
                    obj[field_1] = awake(conf.cls, subjson);
                }
            };
            for (var field_1 in fields) {
                _loop_1(field_1);
            }
        }
        return obj;
    }
    function getClskey(cls) {
        var clskey = cls && cls[CLASS_KEY];
        if (!clskey) {
            throw new Error(
                "The Class:" +
                    cls.name +
                    " did't  mark with decorate @Entity(clskey,idxkey)"
            );
        }
        return clskey;
    }
    function getIdxkey(cls) {
        var idxkey = cls && cls[INDEX_KEY];
        if (!idxkey) {
            throw new Error(
                "The privkey:" + idxkey + " of " + cls.name + " is invalid!"
            );
        }
        return idxkey;
    }
    function getObjkey(clskey, id) {
        if (!clskey || !id) return null;
        return clskey + "." + id;
    }
    function getItem(key) {
        var str = orm._storage.getItem(key);
        return str && JSON.parse(str);
    }
    function setItem(key, value) {
        var str = value && JSON.stringify(value);
        orm._storage.setItem(key, str);
    }
    function removeItem(key) {
        orm._storage.removeItem(key);
    }
    function okstr(value) {
        var type = typeof value;
        switch (type) {
            case "string":
                return value.length !== 0;
            case "number":
                return !isNaN(value);
            default:
                return false;
        }
    }
    orm.Entity = function (clskey, idxkey) {
        if (!okstr(clskey)) {
            throw new Error("The clskey:" + clskey + " invalid!");
        }
        if (!okstr(idxkey)) {
            throw new Error("The privkey:" + idxkey + " invalid!");
        }
        if (_stored[clskey]) {
            throw new Error(
                "The clskey:" +
                    clskey +
                    " already exist!!You can't mark different class with same name!!"
            );
        }
        _stored[clskey] = true;
        return function (target) {
            target[CLASS_KEY] = clskey;
            target[INDEX_KEY] = idxkey;
        };
    };
    orm.Field = function (cls, map) {
        return function (target, field) {
            var fields =
                target.constructor[FIELD_KEY] ||
                (target.constructor[FIELD_KEY] = {});
            fields[field] = { map: !!map, cls: cls };
        };
    };
    orm.save = function (model) {
        if (!model) return;
        var clskey = getClskey(model.constructor);
        var idxkey = getIdxkey(model.constructor);
        var objkey = getObjkey(clskey, model[idxkey]);
        var keys = getItem(clskey) || {};
        keys[objkey] = true;
        setItem(clskey, keys);
        setItem(objkey, model);
    };
    orm.find = function (cls, id) {
        var clskey = getClskey(cls);
        var objkey = getObjkey(clskey, id);
        return awake(cls, getItem(objkey));
    };
    orm.ids = function (cls) {
        var clskey = getClskey(cls);
        var keys = getItem(clskey);
        return keys ? Object.keys(keys) : [];
    };
    orm.all = function (cls) {
        var keys = orm.ids(cls);
        var result = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var obj = awake(cls, getItem(key));
            if (obj) {
                result.push(obj);
            }
        }
        return result;
    };
    orm.count = function (cls) {
        return orm.ids(cls).length;
    };
    orm.clear = function (cls) {
        var clskey = getClskey(cls);
        var keys = getItem(clskey);
        if (keys) {
            for (var key in keys) {
                removeItem(key);
            }
        }
        removeItem(clskey);
    };
    orm.remove = function (cls, id) {
        var clskey = getClskey(cls);
        var objkey = getObjkey(clskey, id);
        var keys = getItem(clskey);
        if (keys && keys[objkey]) {
            delete keys[objkey];
            removeItem(objkey);
            setItem(clskey, keys);
        }
    };
})(orm);
module.exports.default = orm;
