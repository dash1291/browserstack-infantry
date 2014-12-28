(function () {
    function map(data) {
        var tokensMap = {};
        var results = [];

        var docIndex = data.key;

        // do some HTML cleaning
        var htmlParser = new DOMParser();
        var docText = htmlParser.parseFromString(data.val, 'text/html').documentElement.innerText;

        var tokens = docText.split(' ');

        tokens.forEach(function(tok) {
            if (tok in tokensMap) {
                if (!results[tokensMap[tok]]) return;
                results[tokensMap[tok]].val.count++;
            } else {
                results.push({
                    key: tok,
                    val: {
                        doc: docIndex,
                        count: 1
                    }
                });
                tokensMap[tok] = results.length - 1;
            }
        });

        return results;
    }

    function reduce(key, results) {
        var sum = 0;
        var sorted = results.sort(function(a, b) {
            return a.count < b.count;
        });
        for (var i = 0; i < results.length; i++) {
            sum += Number(results[i].count);
        }

        return {
            key: key,
            val: {
                count: sum,
                postings: sorted
            }
        };
    }

    function splitJob(names, divs) {
        var splitLen = Math.ceil(names.length / divs);
        var splits = [];
        for (var i = 0; i < divs; i++) {
            splits.push(names.slice(splitLen * i, splitLen * (i + 1)));
        }

        return splits;
    }

    return {
        map: map,
        reduce: reduce,
        splitJob: splitJob
    };
})();
