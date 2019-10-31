import React from 'react';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const withWebSocketSupport = () => Component => {
  return class WithWebSocketSupport extends React.Component {
    constructor(props) {
      super(props);

      this.id = uuidv4();
      this.ws = null;
    }

    componentDidMount() {
      let websockerServerUrl;
      if (window.location.origin.indexOf('github.io') >= 0) {
        websockerServerUrl = 'wss://catchgameserver.herokuapp.com/';
      } else {
        websockerServerUrl = window.location.origin.replace('http', 'ws');
        websockerServerUrl = websockerServerUrl.replace(':3000', ':3001');
      }

      websockerServerUrl = 'wss://catchgameserver.herokuapp.com/';
      this.ws = new WebSocket(websockerServerUrl);
            
      this.ws.onmessage = this.onMessage;
      this.ws.onopen = this.onopen;
      this.ws.onerror = err => console.log('onerror', err);
      this.ws.onclose = err => console.log('onclose', err);
    }

    onOpen = () => {
      setInterval(() => {
        this.ws.send(JSON.stringify({
          id: this.id,
          ...this.props.getWebSocketData(),
        }));
      }, 10);
    };

    onMessage = event => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.log('error parsing message', e);
      }

      this.props.onWebSocketData(data);
    };

    render() {
      return <Component {...this.props} />;
    }
  };
}