# nodejs-express-basic-boilerplate
basic boilerplate for express api. can be used as a basic template for nodejs application, without the overhead
of the most basic setup required. not intended for use in production environment.

# Main libraries that i used:
 - server
    - Express js (https://expressjs.com)
    - multer for for handling multipart/form-data (https://github.com/expressjs/multer)
    - body-parser for parsing query string and post data easily (https://www.npmjs.com/package/body-parser)
    - node-fetch for creating requests (https://www.npmjs.com/package/node-fetch)
    - csvtojson for transforming csv response to json objects (https://www.npmjs.com/package/csvtojson)
    - google-cloud/vision for reading text in images (https://cloud.google.com/nodejs/docs/reference/vision/0.24.x/)
 - client
    - react js (https://reactjs.org/)
    - react-filepond for uploading files (https://github.com/pqina/react-filepond)


# setup
`npm install` and you are good to go (app runs in port 3000 by default using nodemon)

# Env variables
 - GOOGLE_APPLICATION_CREDENTIALS   
 path to google credentials file with permission to cloud-vision-api (https://cloud.google.com/vision/docs/quickstart-client-libraries)

# run
`npm start`

# methods
## /api/extract_questions
Api that accepts a binary data and response with an aggregated response of extracted questions
 - verb: POST
 - form data:
    - name: manifest   
      value: type binary, manifest.dat file (each source in a new line). manifest.dat file provided as demo
 - response:
    - success:
        - status 200
        - body
         ```
         [ 
             {"source": "image", "value" : "question value" }, 
             {"source": "json", "value" : "question value" },
             {"source": "csv", "value" : "question value" }
         ]
         ```
    - error:
        - status 400
        - body
         ```
         [ 
             {"source": "image", "value" : "question value" }, 
             {"source": "json", "value" : "question value" },
             {"source": "csv", "value" : "question value" }
         ]
         ```