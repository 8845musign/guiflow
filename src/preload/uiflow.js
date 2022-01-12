const uiflow = require('uiflow');
const flumine = require('flumine');
const through2 = require('through2');

const api = module.exports = {};

api.update = function(inputFileName, code, format) {
    const f = flumine(function(d, ok, ng) {
        const buff = [];
        const output = through2(function(chunk, enc, cb) {
            const svg = chunk;
            buff.push(svg);
            cb();

        });
        const stream = uiflow.buildWithCode(
            inputFileName, code, format, function(error) {
                console.log(inputFileName)
                console.log(code)
                console.log(format)

                ng(error);
            });
        stream.pipe(output);
        stream.on('end', function() {
            const buffAll = Buffer.concat(buff);
            ok(buffAll);
            output.end();
        });


    });
    return f();
};

const stringify = function(buff) {
    const str = String(buff);
    return str;
};

const base64nize = function(buff) {
    return buff.toString('base64');
};
api.compile = function(code) {
    return flumine.set({
        svg: flumine.to(function() {
            return api.update('<anon>', code, 'svg');
        }).to(stringify),
        meta: flumine.to(function() {
            return api.update('<anon>', code, 'meta');
        }).to(stringify)
    })();
};

api.base64png = function(code) {
    return flumine.to(function() {
        return api.update('<anon>', code, 'png');
    }).to(base64nize)();
};
