var ATEM = require('applest-atem');


class Atem {
  constructor(ip) {
    this.atem = new ATEM();

    this.ip = ip;

    this.atem.connect(this.ip);

    this.atem.on('connect',() => {
      console.log('CONNECTED TO ATEM')
    });
  
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


  do({action,values}) {
    console.log({action,values});
    this.actionMap[action](values);
  };

};


module.exports = Atem;