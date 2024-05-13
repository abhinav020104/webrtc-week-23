import { useEffect } from "react"
import { useState } from "react";
export function Sender(){
    const [socket ,  setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080"); 
        setSocket(socket);
        socket.onopen = () =>{
            socket.send(JSON.stringify({type:'sender'}));
        }
    },[])
    async function startSendingVideo(){
        if(!socket){
            return;
        }
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async()=>{
            console.log("On negotiation needed");
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({type:'createOffer' , sdp:pc.localDescription}));
        }
        pc.onicecandidate = (event)=>{
            console.log(event); 
            if(event.candidate){
                socket.send(JSON.stringify({type:"iceCandidate" , candidate:event.candidate}));
            }
        }
        socket.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if(data.type === "createAnswer"){
                pc.setRemoteDescription(data.sdp)
            }else if(data.type === "iceCanidate"){
                pc.addIceCandidate(data.candidate);
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia({video:true , audio:false});
        pc.addTrack(stream.getVideoTracks()[0]);
    }
    return(
        <div>
            <button onClick={startSendingVideo}>Send Video</button>
        </div>
    ) 
} 
