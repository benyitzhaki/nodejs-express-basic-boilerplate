const path = require('path');
const fetch = require("node-fetch");
const csv = require("csvtojson");
const vision = require('@google-cloud/vision');

const {ResponseModel} = require("../models/responseModel");
const {QuestionModel} = require("../models/questionModel");
const {error_response} = require("../helpers/error_response");
const {constants} = require( "../constants");

// Google vision client
const visionClient = new vision.ImageAnnotatorClient();

/***
 * Controller method. Gets a string of sources in req.body and returns an array of question models
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const extract_questions = async function(req, res) {

    // read manifest file
    const manifest = req.file;

    if(!manifest) {
        res.status(constants.STATUS_ERROR).send(error_response("manifest.dat file was not provided"));
    }

    const parsed_manifest = req.file.buffer.toString().split("\n");
    if(!parsed_manifest.length) {
        res.status(constants.STATUS_ERROR).send(error_response("manifest.dat file was invalid"));
    }

    // holds the aggregated results
    const results = new ResponseModel;

    for (let item of parsed_manifest) {
        const response = await parse_item_by_type(item);
        for (let response_item of response) {
            results.add_question(response_item);
        }
    }

    res.status(200).send(results);
};

/***
 * Responsible for fetching a csv file and returning its content as json array
 * @param path
 * @returns {Promise<*>}
 */
const read_csv = async function(path) {
    const csv_response = await fetch(path, { method: 'GET' });
    const csv_text = await csv_response.text();
    return normalize_data("csv", await csv().fromString(csv_text));
};


/***
 * Responsible for fetching a json file and returning its content as json array
 * @param path
 * @returns {Promise<*>}
 */
const read_json = async function(path) {
    const response = await fetch(path, { method: 'GET' });
    const questions = await response.json();
    return normalize_data("json", questions.questions || []);
};

/***
 * Responsible for fetching an image file and returning its content as json array
 * @param path
 * @returns {Promise<*>}
 */
const read_image = async function(path) {
    const [result] = await visionClient.textDetection(path);
    const detections = result.textAnnotations;
    if(detections.length) {
        // assumption: the first string is the question. there might be multiple texts in the image, figuring
        // the right one is bit tricky (by the longest one? the first one?)
        return [new QuestionModel("image", detections[0].description)];
    }
    return [];
};


const parse_item_by_type = async function(item) {
    const item_extension = path.extname(item).toLowerCase();
    let response = [];
    switch (item_extension) {

        case ".csv":
            response = await read_csv(item);
            break;

        case ".json":
            response = await read_json(item);
            break;

        case ".png":
        case ".jpg":
        case ".jpeg":
            response = await read_image(item);
            break;

        default:
            console.error("unsupported-source was ignored", item);

    }

    return response;
};

/***
 * Responsible for getting a raw question object (containing field and text for each question), return a unified
 * array of question models
 * @param raw_questions
 * @param source
 * @returns {*}
 */
const normalize_data = function(source, raw_questions) {
    if(!raw_questions.length){
        console.error("invalid raw_questions", raw_questions);
        return null;
    }
    const normalized_data = [];
    for (let item of raw_questions) {
        if(item.text && item.field) {
            normalized_data.push(new QuestionModel(source, `(${item.field}) ${item.text}`))
        }
    }

    return normalized_data;
};


module.exports = { extract_questions };