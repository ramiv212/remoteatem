var ATEM = require('applest-atem');


class Atem {
  constructor() {
    this.atem = new ATEM();

    this.ip = null;

    // ATEM actions 
    this.actionMap = {
      changeProgramInput: ({input, me}) => {
        console.log(`ran actual function ${input,me}`);
        this.atem.changeProgramInput(input, me);
      },
    
      changePreviewInput: ({input, me}) =>  
        this.atem.changeProgramInput(input,me),
    
      fadeToBlack: ({me}) =>  
        this.atem.fadeToBlack(me),
    
      autoTransition: ({me}) =>
        this.atem.autoTransition(me),
    
      cutTransition: ({me}) =>
        this.atem.cutTransition(me),
    
      changeTransitionPosition: ({me, position}) =>
        this.atem.changeTransitionPosition(me, position),
    
      changeUpstreamKeyState: ({number, state, me = 0}) =>
        this.atem.changeUpstreamKeyState(number,state,me),
    
      changeAuxInput: ({aux, input}) => 
        this.atem.changeAuxInput(aux,input),
    
      changeDownstreamKeyOn: ({number,state}) => 
        this.atem.changeDownstreamKeyOn(number,state),
    
      autoDownstreamKey: ({number}) => 
        this.atem.autoDownstreamKey(number),
    
      runMacro: ({number}) =>
        this.atem.runMacro(number),
    };
  };


  // helper functions
  isIp(ip) {
    const regex = /^((\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])$/;
    return (regex.test(ip));
  };

  isConnected() {
    return this.atem;
  };

  connect(ip) {
    console.log(`Connect to ${ip}`)
    // if this is not an IP address, return error message
    if (!this.isIp(ip)) throw new Error('Not a valid IP address');

    this.atem.connect(ip);
  };

  disconnect() {
    this.atem.disconnect();
  };


  do({action,values}) {
    this.actionMap[action](values);
  };

};



function initAtemStateEventListeners(win) {
  console.log('event listeners initialized')
  // let the renderer process know when the ATEM is connected
  atem.atem.on('connect',() => {
    console.log('CONNECTED TO ATEM');

    win.webContents.send('message-from-main',{
      connectedToAtem: true
    });
  });


  // let the renderer process know when the ATEM is disconnected
  atem.atem.on('disconnect',() => {
    console.log('CONNECTED TO ATEM');
    
    const jsonifiedBody = JSON.stringify({
      connectedToAtem: false
    });


    // TODO add code for atem state change HERE


    win.webContents.send('message-from-main',jsonifiedBody);
  });
}




const atem = new Atem();

exports.atem = atem;
exports.initAtemStateEventListeners = initAtemStateEventListeners;
