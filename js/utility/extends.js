Promise.__proto__.chain = function(array, callback, delay = 0)
{
    let options = {delay};
    
    array.map(i => p => new Promise(r => setTimeout(() => r(callback(i, options)), options.delay)))
        .reduce((p, p2) => p.then(p2), Promise.resolve());
};