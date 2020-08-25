/*object representation,
 key : ["backend_name", "frontend_name"]
 ADD NEW LANGUAGES HERE!!!
 */
const languageObject = {
    JAVASCRIPT: {backendName : "javascript", niceName: "JavaScript"},
    CPP : {backendName:"cpp" , niceName:"C++"},
    C : {backendName:"c", niceName:"C"},
    PYTHON : {backendName:"python", niceName:"Python"},
};

/*
    defaultLanguages.list contains the list of languages in the string format
    defaultLanguages.lang.backendName contains the name of a given lang for the backend format e.g: languages.CPP.backendName == "cpp"
    defaultLanguages.lang.niceName contains the name of a given lang for the frontend, aka "nice name", format e.g: languages.CPP.niceName == "C++"
*/
const DefaultLanguages = {
    list : [],
    niceNames : [],
    /*workaround since Ace editor uses cpp and c as the same name*/
    getAceName : function (languageName){
        if(languageName === "cpp" || languageName === 'c')
            return "c_cpp"
        return languageName;
    }
};

//creating language names list
Object.values(languageObject).map( l => DefaultLanguages.list.push(l.backendName) );

//creating niceNames list
Object.values(languageObject).map( l => DefaultLanguages.niceNames.push(l.niceName) );

//adding the language object in the DefaultLanguages object
Object.keys(languageObject).map( k => DefaultLanguages[k]=languageObject[k] );

export default DefaultLanguages;