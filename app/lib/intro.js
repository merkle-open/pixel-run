(function() {

    var art = [
        '╭━┳╮╱╱╱╱╱╱╭━╮',
        '┃╋┣╋┳┳━┳╮╱┃╋┣┳┳━┳╮',
        '┃╭┫┣┃┫┻┫╰╮┃╮┫┃┃┃┃┃',
        '╰╯╰┻┻┻━┻━╯╰┻┻━┻┻━╯'].join('\n') + '\n';

    if(typeof module !== 'undefined' && module.exports) {
        exports = module.exports = art;
    } else {
        window.$introduction = art;
    }
})();
