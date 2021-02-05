import * as B from "../components/ui/blockly";

export const formatDate = date => {
    let createdAt = new Date(date);
    let ano = createdAt.getFullYear();
    let mes = createdAt.getMonth() + 1;
    let dia = createdAt.getDate();
    let hora = createdAt.getHours();
    let minuto = createdAt.getMinutes();
    //let segundo = createdAt.getSeconds()
    mes = mes < 10 ? "0" + mes : mes;
    dia = dia < 10 ? "0" + dia : dia;
    hora = hora < 10 ? "0" + hora : hora;
    minuto = minuto < 10 ? "0" + minuto : minuto;
    //segundo = segundo<10?'0'+segundo:segundo
    return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
};

export const generateHash = (value) => {
    return value
        .toString()
        .split('')
        .reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0)
        .toString()
}

export const range = num => {
    let arr = [];
    for (let i = 0; i < num; i++) arr.push(i);
    return arr;
};

export const findLocalIp = (logInfo = true) => new Promise((resolve, reject) => {
    window.RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;

    if (typeof window.RTCPeerConnection == 'undefined'){
        console.log('WebRTC not supported by browser');
        //return reject();
        return resolve(['undefined'])
    }

    let pc = new RTCPeerConnection();
    let ips = [];

    pc.createDataChannel("");
    pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(err => reject(err));
    pc.onicecandidate = event => {
        if (!event || !event.candidate) {
            // All ICE candidates have been sent.
            if (ips.length === 0){
                console.log('WebRTC disabled or restricted by browser');
                return resolve(['undefined']);
            }

            return resolve(ips);
        }

        let parts = event.candidate.candidate.split(' ');
        let [base, componentId, protocol, priority, ip, port, , type, ...attr] = parts;
        let component = ['rtp', 'rtpc'];

        if (!ips.some(e => e === ip))
            ips.push(ip);

        if (!logInfo)
            return;

        console.log(" candidate: " + base.split(':')[1]);
        console.log(" component: " + component[componentId - 1]);
        console.log("  protocol: " + protocol);
        console.log("  priority: " + priority);
        console.log("        ip: " + ip);
        console.log("      port: " + port);
        console.log("      type: " + type);

        if (attr.length) {
            console.log("attributes: ");
            for (let i = 0; i < attr.length; i += 2)
                console.log("> " + attr[i] + ": " + attr[i + 1]);
        }

        console.log();
    };
});

export function getStateFormQuestionsFromStorage(field) {
    switch (field) {
        case 'pageQuestions':
            return sessionStorage.getItem('pageQuestions') || 1;
        case 'titleOrCodeInputQuestions':
            return sessionStorage.getItem('titleOrCodeInputQuestions') || '';

        case 'radioAscQuestions':
            if (sessionStorage.getItem('radioAscQuestions')) {
                return JSON.parse(sessionStorage.getItem('radioAscQuestions'))
            }
            return false;

        case 'radioDescQuestions':
            if (sessionStorage.getItem('radioDescQuestions')) {
                return JSON.parse(sessionStorage.getItem('radioDescQuestions'))
            }
            return true;

        case 'sortRadioQuestions':
            return sessionStorage.getItem('sortRadioQuestions') || 'DESC';

        case 'sortBySelectQuestions':
            return sessionStorage.getItem('sortBySelectQuestions') || 'createdAt';

        case 'tagSelectQuestion':
            return sessionStorage.getItem('tagSelectQuestion') || '';

        case 'docsPerPageQuestions':
            return sessionStorage.getItem('docsPerPageQuestions') || 15;

        default:
            return null;
    }
}

export const getBlocklyCode = (workspace) => {
    const code = B.BlocklyLanguage.workspaceToCode(workspace);
    //console.log(code);
    return code;
}

export const getBlocklyXML = (workspace) => {
    const xml = B.Blockly.Xml.workspaceToDom(workspace);
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xml);  // converte xml para string  
}

export const isXml= (text) =>{
    const XMlDoc = new DOMParser().parseFromString(text,"text/xml");
    return !XMlDoc.getElementsByTagName('parsererror').length
}
