import JsSIP from 'jssip';

let incomingSession = null;
let outgoingSession = null;
let currentSession = null;
let localStream = null;

export const startCall = () => {

  const curUrl = window.location.href;
  const type = curUrl.includes('http://') ? 'ws' : 'wss'
  const linkUrl = type === 'ws' ? 'ws://11.112.0.42:5066' : 'wss://11.112.0.42:7443'

  const registerUrl = '@11.112.0.42:5070'

  const socket = new JsSIP.WebSocketInterface(linkUrl);
  var configuration = {
    sockets: [socket],
    uri: 'sip:' + '1000' + registerUrl,
    password: 'yiwise', // 公司freeswitch,
    outbound_proxy_set: linkUrl,
    display_name: 'JeffyLiang',
    register: true,
    session_timers: false //启用会话计时器（根据RFC 4028）
  };

  const userAgent = new JsSIP.UA(configuration);

  //成功注册成功,data:Response JsSIP.IncomingResponse收到的SIP 2XX响应的实例
  userAgent.on('registered', function (data) {
    console.info("registered: ", data.response);
  });

  //由于注册失败而被解雇,data:Response JsSIP.IncomingResponse接收到的SIP否定响应的实例，如果失败是由这样的响应的接收产生的，否则为空
  userAgent.on('registrationFailed', function (data) {
    console.log("registrationFailed, ", data);
    //console.warn("registrationFailed, ", data.response.status_code, ",", data.response.reason_phrase, " cause - ", data.cause);
  });

  //1.在注册到期之前发射几秒钟。如果应用程序没有为这个事件设置任何监听器，JsSIP将像往常一样重新注册。
  // 2.如果应用程序订阅了这个事件，它负责ua.register()在registrationExpiring事件中调用（否则注册将过期）。
  // 3.此事件使应用程序有机会在重新注册之前执行异步操作。对于那些在REGISTER请求中的自定义SIP头中使用外部获得的“令牌”的环境很有用。
  userAgent.on('registrationExpiring', function () {
    console.warn("registrationExpiring");
  });

  //为传入或传出会话/呼叫激发。data:
  //originator：'remote',新消息由远程对等方生成；'local',新消息由本地用户生成。
  //session:JsSIP.RTCSession 实例。
  //request:JsSIP.IncomingRequest收到的MESSAGE请求的实例；JsSIP.OutgoingRequest传出MESSAGE请求的实例
  userAgent.on('newRTCSession', function (data) {
    console.info('onNewRTCSession: ', data);

    //通话呼入
    if (data.originator == 'remote') {
      console.info("incomingSession, answer the call----------------------");
      incomingSession = data.session;
      //回答传入会话。此方法仅适用于传入会话。
      data.session.answer({
        'mediaConstraints': {
          'audio': true,
          'video': false,
          mandatory: {
            maxWidth: 640,
            maxHeight: 360
          }
        },
        'mediaStream': localStream
      });
    } else {
      console.info("outgoingSession");
      outgoingSession = data.session;
      outgoingSession.on('connecting', function (data) {
        console.info('onConnecting - ', data.request);
        currentSession = outgoingSession;
        outgoingSession = null;
      });
    }

    //接受呼叫时激发
    data.session.on('accepted', function (data) {
      console.info('onAccepted - ', data);
      if (data.originator == 'remote' && currentSession == null) {
        currentSession = incomingSession;
        incomingSession = null;
        console.info("setCurrentSession - ", currentSession);
      }
    });

    //确认呼叫后激发
    data.session.on('confirmed', function (data) {
      console.info('onConfirmed - ', data);
      if (data.originator == 'remote' && currentSession == null) {
        currentSession = incomingSession;
        incomingSession = null;
        console.info("setCurrentSession - ", currentSession);
      }
    });

    //在将远程SDP传递到RTC引擎之前以及在发送本地SDP之前激发。此事件提供了修改传入和传出SDP的机制。
    data.session.on('sdp', function (data) {
      console.info('onSDP, type - ', data.type, ' sdp - ', data.sdp);
    });

    //接收或生成对邀请请求的1XX SIP类响应（>100）时激发。该事件在SDP处理之前触发（如果存在），以便在需要时对其进行微调，甚至通过删除数据对象中响应参数的主体来删除它
    data.session.on('progress', function (data) {
      console.info('onProgress - ', data.originator);
      if (data.originator == 'remote') {
        console.info('onProgress, response - ', data.response);
      }
    });

    //创建基础RTCPeerConnection后激发。应用程序有机会通过在peerconnection上添加RTCDataChannel或设置相应的事件侦听器来更改peerconnection。
    data.session.on('peerconnection', function (data) {
      console.info('onPeerconnection - ', data.peerconnection);
      data.peerconnection.onaddstream = function (ev) {
        console.info('onaddstream from remote ----------- ', ev);
        const videoView = document.getElementById('video');
        videoView.src = URL.createObjectURL(ev.stream);
      };
    });
  });

  //为传入或传出消息请求激发。data:
  //originator：'remote',新消息由远程对等方生成；'local',新消息由本地用户生成。
  //message:JsSIP.Message 实例。
  //request:JsSIP.IncomingRequest收到的MESSAGE请求的实例；JsSIP.OutgoingRequest传出MESSAGE请求的实例
  userAgent.on('newMessage', function (data) {
    if (data.originator == 'local') {
      console.info('onNewMessage , OutgoingRequest - ', data.request);
    } else {
      console.info('onNewMessage , IncomingRequest - ', data.request);
    }
  });

  console.info("call register");

  //连接到信令服务器，并恢复以前的状态，如果以前停止。重新开始时，如果UA配置中的参数设置为register:true，则向SIP域注册。
  userAgent.start();

}
