import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {TestSuite, TestCase, Tester} from '@rnoh/testerino';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

export function VideoAudioTest() {
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const camera = useRef<Camera>(null);
  const format = useCameraFormat(device, [
    {videoResolution: {width: 3048, height: 2160}},
    {fps: 30},
  ]);
  if (!device) {
    return <Text>No Devices</Text>;
  }

  if (!hasPermission) {
    requestPermission();
  }

  const [audio, setAudio] = useState(true);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [preview, setPreview] = useState(true);
  const [videoCodec, setVideoCodec] = useState<'h265' | 'h264'>('h265');

  const [videoHdr, setVideoHdr] = useState(false);

  const [startStatus, seteStartStatus] = useState('end');
  const [videoFile, setVideoFile] = useState<string>('');
  const [videoPath, setVideoPath] = useState<string>('');

  const onStart = async () => {
    setVideoPath('');
    seteStartStatus('start');
    await camera.current?.startRecording({
      fileType: 'mp4',
      flash: flash,
      onRecordingError: error => {
        seteStartStatus('end');
        console.log(
          `videoStartParmas CameraSession: onRecordingError.${JSON.stringify(
            error,
          )}`,
        );
      },
      onRecordingFinished: video => {
        seteStartStatus('end');
        video && setVideoFile(JSON.stringify(video));
        video?.path && setVideoPath(video.path);
      },
      videoBitRate: 'extra-low',
      videoCodec: videoCodec,
    });
  };
  const onPause = async () => {
    seteStartStatus('pause');
    camera.current?.pauseRecording();
  };
  const onStop = async () => {
    seteStartStatus('end');
    camera.current?.stopRecording();
  };
  const onResume = async () => {
    seteStartStatus('start');
    camera.current?.resumeRecording();
  };
  const onChangeVideoCodeC = async () => {
    const code = videoCodec === 'h264' ? 'h265' : 'h264';
    setVideoCodec(code);
  };

  const onChangeAudio = async () => {
    setAudio(!audio);
  };

  return (
    <Tester>
      <TestSuite name="audio">
        <TestCase itShould={`启用视频录制的音频捕获:${audio ? '是' : '否'}`}>
          <View>
            <Text>录像结果:{videoFile}</Text>
          </View>
          {videoPath && (
            <View style={{height: 50}}>
              <Button
                title="SaveAsset"
                onPress={() => {
                  CameraRoll.saveAsset(videoPath).then(res => {
                    console.log('video-res', JSON.stringify(res));
                  });
                }}
              />
            </View>
          )}
          <Camera
            style={style.cameraPreview}
            ref={camera}
            isActive={true}
            preview={preview}
            device={device}
            video={true}
            audio={audio}
            videoHdr={videoHdr}
            fps={30}
            format={format}
          />

          <View style={style.actionBtn}>
            <>
              {videoHdr && videoCodec === 'h264' ? (
                <Text>videoHdr为true时，videoCodeC只能设置为h265; </Text>
              ) : (
                <>
                  {startStatus === 'end' ? (
                    <Button title="开始" onPress={onStart}></Button>
                  ) : (
                    ''
                  )}
                  {startStatus === 'start' ? (
                    <Button title="暂停" onPress={onPause}></Button>
                  ) : (
                    ''
                  )}
                  {startStatus === 'pause' ? (
                    <Button title="恢复" onPress={onResume}></Button>
                  ) : (
                    ''
                  )}
                  {startStatus !== 'end' ? (
                    <Button title="停止" onPress={onStop}></Button>
                  ) : (
                    ''
                  )}
                </>
              )}
              <Text>fps: 30</Text>
            </>
            <Button
              title={`codec:${videoCodec}`}
              onPress={onChangeVideoCodeC}></Button>
            <Button title={`audio:${audio}`} onPress={onChangeAudio}></Button>
          </View>
        </TestCase>
      </TestSuite>
    </Tester>
  );
}

const style = StyleSheet.create({
  actionBtn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    gap: 10,
    position: 'absolute',
    top: 300,
  },
  cameraPreview: {
    width: 300,
    height: 400,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
});