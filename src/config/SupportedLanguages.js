import js_icon from "../assets/icons/icons-javascript.svg";
import cpp_icon from "../assets/icons/icons-cpp.svg";
import c_icon from "../assets/icons/icons-c.svg";
import python_icon from "../assets/icons/icons-python.svg";
import blockly_icon from "../assets/icons/icons-blockly-pink-24.png";
import java_icon from "../assets/icons/icons-java.svg";
/*object representation,
 backend_name : { backendName: "backend_name", niceName: "frontend_name", mossName: "moss_name", icon: "path" }
 ADD NEW LANGUAGES HERE!!!
 */
const LanguageObject = {
    javascript: {backendName : "javascript", niceName: "JavaScript", mossName: 'javascript', icon : js_icon},
    cpp : {backendName:"cpp" , niceName:"C++", mossName: 'cc',  icon : cpp_icon},
    c : {backendName:"c", niceName:"C", mossName: 'c',  icon : c_icon},
    python : {backendName:"python", niceName:"Python", mossName: 'python', icon : python_icon},
    blockly : {backendName:"blockly", niceName:"Blockly", mossName: 'python', icon : blockly_icon},
    java : {backendName:"java", niceName:"Java", mossName: 'java', icon : java_icon}
};

/*
    defaultLanguages.list contains the list of languages in the string format
    defaultLanguages.lang.backendName contains the name of a given lang for the backend format e.g: languages.CPP.backendName == "cpp"
    defaultLanguages.lang.niceName contains the name of a given lang for the frontend, aka "nice name", format e.g: languages.CPP.niceName == "C++"
*/
const SupportedLanguages = {
    list : [],
    niceNames : [],
    mossNames: [],
};

//creating language names list
Object.values(LanguageObject).map( l => SupportedLanguages.list.push(l.backendName) );

//creating niceNames list
Object.values(LanguageObject).map( l => SupportedLanguages.niceNames.push(l.niceName) );

//creating mossNames list
Object.values(LanguageObject).map( l => SupportedLanguages.mossNames.push(l.mossName) );

//adding the language object in the DefaultLanguages object
Object.keys(LanguageObject).map( k => SupportedLanguages[k]=LanguageObject[k] );

export default SupportedLanguages;