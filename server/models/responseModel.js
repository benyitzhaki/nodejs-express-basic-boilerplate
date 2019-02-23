class ResponseModel {
    constructor() {
        this.questions = [];
    }

    add_question(question) {
        this.questions.push(question)
    }
}

module.exports = {ResponseModel};