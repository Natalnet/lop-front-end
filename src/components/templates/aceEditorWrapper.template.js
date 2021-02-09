import React, { Component } from "react";

import AceEditor from "react-ace";
import "brace/mode/c_cpp";
import "brace/mode/python";
import "brace/mode/java";

import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/theme/github";
import "brace/theme/tomorrow";
import "brace/theme/kuroir";
import "brace/theme/twilight";
import "brace/theme/xcode";
import "brace/theme/textmate";
import "brace/theme/solarized_dark";
import "brace/theme/solarized_light";
import "brace/theme/terminal";


//used this template so we can use workaround on AceEditor mode tag
export default class AceEditorWrapper extends Component {
    props = {};

    constructor(props) {
        super();
        this.props = props;

        //console.log(this.props.mode);
        
    }

    render() {
        return (
            <AceEditor
                mode={ (this.props.mode === "cpp" || this.props.mode === 'c')? "c_cpp" : this.props.mode }
                theme={this.props.theme}
                focus={this.props.focus}
                onChange={this.props.onChange}
                value={this.props.value}
                fontSize={this.props.fontSize}
                width={this.props.width}
                showPrintMargin={this.props.showPrintMargin}
                name={this.props.name}
                showGutter={this.props.showGutter}
                readOnly={this.props.readOnly}
                highlightActiveLine={this.props.highlightActiveLine}
            />
        );
    }
}

export const themesAceEditor = [
    'monokai', 
    'github', 
    'tomorrow', 
    'kuroir', 
    'twilight', 
    'xcode', 
    'textmate', 
    'solarized_dark', 
    'solarized_light', 
    'terminal'
]
