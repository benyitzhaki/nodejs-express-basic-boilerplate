import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// Import React FilePond
import { FilePond } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: null
    }
  }

  setQuestions(response) {
    const parsed = JSON.parse(response);
    if(!parsed.questions.length) {
      parsed.questions.push({"source" : "none", "value" : "failed fetching questions from the manifest file"});
    }
    this.setState({"questions" : JSON.stringify(parsed.questions)});
  }

  onError(response) {
    const parsed = JSON.parse(response);
    this.setState({"questions" : [parsed.error]});
  }

  render() {
    const {questions} = this.state;
    const parsedQuestions = JSON.parse(questions) || [];

    return (
        <div className="App">
          <p>
            Upload a manifest.dat file to fetch some new questions!
          </p>
          <FilePond server={
            {
              url: '/api',
              process: {
                url: '/extract_questions',
                method: 'POST',
                headers: {},
                timeout: 7000,
                onload: (data) => {
                  this.setQuestions(data)
                },
                onerror: (data) => {
                  this.onError(data)
                }
              }
            }
          }/>
          {parsedQuestions.length > 0 && (
          <div className={"questions"}>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Source</CustomTableCell>
                  <CustomTableCell>Value</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedQuestions.map((question,index) => (
                    <TableRow key={index}>
                      <CustomTableCell component="th" scope="row">
                        {question.source}
                      </CustomTableCell>
                      <CustomTableCell>{question.value}</CustomTableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>)}
        </div>
    );
  }
}

export default App;
