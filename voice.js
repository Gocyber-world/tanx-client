let rtc = {
    localAudioTrack: null,
    client: null
};

let aoptions = {
    // Pass your App ID here.
    appId: "32b64339a1bd4b1a962127d36e48e375",
    // Set the channel name.
    channel: "tanx",
    // Pass your temp token here.  在正式使用中 token在业务后端生成，分配给前端用户
    token: "00632b64339a1bd4b1a962127d36e48e375IAB3E5q0UfpXxL4pyUmW4b5PMd6OZrdMbRW5Woo+KEUSPuf2rCkAAAAAEABeKUKVxGW9YQEAAQDAZb1h",
    // Set the user ID.
    uid: Math.random().toString().slice(-6)
};

async function startBasicCall() {
    // Create an AgoraRTCClient object.
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success" + user.uid);
        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        rtc.client.on("user-unpublished", async user => {
            // Unsubscribe from the tracks of the remote user.
            await rtc.client.unsubscribe(user);
        });

    });

    // window.onload = async function () {
    // TODO: 按键发言
    // document.getElementById("join").onclick = async function () {
    // Join an RTC channel.
    await rtc.client.join(aoptions.appId, aoptions.channel, aoptions.token, aoptions.uid);
    // Create a local audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Publish the local audio tracks to the RTC channel.
    await rtc.client.publish([rtc.localAudioTrack]);
    console.log("publish success!");
    // }

    // TODO: 松开按键离开
    // document.getElementById("leave").onclick = async function () {
    //     // Destroy the local audio track.
    //     rtc.localAudioTrack.close();

    //     // Leave the channel.
    //     await rtc.client.leave();
    // }
    // }
}
// 申请权限
navigator.getUserMedia({ audio: true }, async function onSuccess(stream) {
    await startBasicCall()
}, function onError(error) {
    console.log("权限不足")
});