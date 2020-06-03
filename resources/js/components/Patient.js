import React, { Component} from 'react';
import Pusher from 'pusher-js';
import Peer from 'simple-peer';
import MediaHandler from '../MediaHandler';

const APP_KEY = '52b6df945610aa082478';

class Patient extends Component {
    constructor() {
        super();


        this.state = {
            hasMedia: false,
            otherUserId: null
        }

        this.user = window.user;
        this.peers = {};
        this.user.stream = null;

        this.mediaHandler = new MediaHandler();
        this.setupPusher();

        this.setupPusher = this.setupPusher.bind(this);
        this.startPeer = this.startPeer.bind(this);

    }

    componentWillMount() {
        this.mediaHandler.getPermissions()
        .then((stream) => {
            this.setState({hasMedia: true});
            this.user.stream = stream;
            try {
                this.myVideo.srcObject = stream;
            } catch (e) {
                this.myVideo.src = URL.createObjectURL(stream);
            }

            this.myVideo.play();
        })
    }

    setupPusher() {
        Pusher.logToConsole=true;
        this.pusher = new Pusher(APP_KEY, {
            authEndpoint: '/pusher/auth',
            cluster: 'ap2',
            auth: {
                params: this.user.id,
                headers: {
                    'X-CSRF-Token': window.csrfToken
                }
            }
        });

        this.channel = this.pusher.subscribe('presence-'+this.user.channel);
        this.channel.bind(`client-signal-${this.user.id}`, (signal)=> {
            let peer =this.peers[signal.userId];

            //if peer is not already exists, we got an incoming call
            if(peer === undefined){
                this.setState({otherUserId: signal.userId});
                peer = this.startPeer(signal.userId, false);
            }
            peer.signal(signal.data);
        })
    }

    startPeer(userId, initiator = true) {
        const peer = new Peer({
            initiator,
            stream: this.user.stream,
            trickle: false
        });

        peer.on('signal',(data) => {
            this.channel.trigger(`client-signal-${userId}`,{
                type: 'signal',
                userId: this.user.id,
                data: data
            });
        });

        peer.on('stream', (stream)=> {
            try {
                this.userVideo.src = URL.createObjectURL(stream);
            } catch (e) {
                this.userVideo.srcObject = stream;
            }
            this.userVideo.play();
        });
        peer.on('close', () => {
            let peer = this.peers[userId];
            if(peer !== undefined){
                peer.destroy();
            }
            this.peers[userId] = undefined;
        });
        return peer;
    }

    render() {
        return (
            <div className="">
                <div className="video-container">
                    <video className="my-video" ref={(ref)=> {this.myVideo = ref;}} autoPlay muted></video>
                    <video className="user-video" ref={(ref)=> {this.userVideo = ref;}} autoPlay></video>
                </div>
            </div>
        );
    }
}

export default Patient;

