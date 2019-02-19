const myMiddleware = function (req, res, next) {
    console.log('Through middleware');
    next();
};

module.exports = myMiddleware;