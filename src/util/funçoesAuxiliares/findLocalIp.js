const findLocalIp = (logInfo = true) => new Promise( (resolve, reject) => {
    window.RTCPeerConnection = window.RTCPeerConnection 
                            || window.mozRTCPeerConnection 
                            || window.webkitRTCPeerConnection;

    if ( typeof window.RTCPeerConnection == 'undefined' )
        return reject('WebRTC not supported by browser');

    let pc = new RTCPeerConnection();
    let ips = [];

    pc.createDataChannel("");
    pc.createOffer()
     .then(offer => pc.setLocalDescription(offer))
     .catch(err => reject(err));
    pc.onicecandidate = event => {
        if ( !event || !event.candidate ) {
            // All ICE candidates have been sent.
            if ( ips.length == 0 )
                return reject('WebRTC disabled or restricted by browser');

            return resolve(ips);
        }

        let parts = event.candidate.candidate.split(' ');
        let [base,componentId,protocol,priority,ip,port,,type,...attr] = parts;
        let component = ['rtp', 'rtpc'];

        if ( ! ips.some(e => e == ip) )
            ips.push(ip);

        if ( ! logInfo )
            return;

        console.log(" candidate: " + base.split(':')[1]);
        console.log(" component: " + component[componentId - 1]);
        console.log("  protocol: " + protocol);
        console.log("  priority: " + priority);
        console.log("        ip: " + ip);
        console.log("      port: " + port);
        console.log("      type: " + type);

        if ( attr.length ) {
            console.log("attributes: ");
            for(let i = 0; i < attr.length; i += 2)
                console.log("> " + attr[i] + ": " + attr[i+1]);
        }

        console.log();
    };
});
export default findLocalIp