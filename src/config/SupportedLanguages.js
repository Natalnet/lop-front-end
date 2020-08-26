/*object representation,
 key : ["backend_name", "frontend_name"]
 ADD NEW LANGUAGES HERE!!!
 */
const LanguageObject = {
    javascript: {backendName : "javascript", niceName: "JavaScript", icon : 'assets/icons/icons-javascript.svg'},
    cpp : {backendName:"cpp" , niceName:"C++", icon : 'assets/icons/icons-c.svg'},
    c : {backendName:"c", niceName:"C", icon : 'assets/icons/icons-c.svg'},
    python : {backendName:"python", niceName:"Python", icon : 'assets/icons/icons-python.svg'},
};

/*
    defaultLanguages.list contains the list of languages in the string format
    defaultLanguages.lang.backendName contains the name of a given lang for the backend format e.g: languages.CPP.backendName == "cpp"
    defaultLanguages.lang.niceName contains the name of a given lang for the frontend, aka "nice name", format e.g: languages.CPP.niceName == "C++"
*/
const SupportedLanguages = {
    list : [],
    niceNames : []
};

//creating language names list
Object.values(LanguageObject).map( l => SupportedLanguages.list.push(l.backendName) );

//creating niceNames list
Object.values(LanguageObject).map( l => SupportedLanguages.niceNames.push(l.niceName) );

//adding the language object in the DefaultLanguages object
Object.keys(LanguageObject).map( k => SupportedLanguages[k]=LanguageObject[k] );

export default SupportedLanguages;