import React, { useContext, useState } from 'react';
import {
  Text,
  IconButton,
} from 'react-native-paper';
import { View, PermissionsAndroid, Platform } from 'react-native';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AlertContext } from '../contexts/AlertContext';



async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app requires access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
}


function SelectMediaComponent({
  files, setFiles, photos
}: {
  files: { asset: Asset | null, id: number }[],
  photos?: { file: string, mediaType: string }[]
  setFiles: React.Dispatch<React.SetStateAction<{ asset: Asset | null, id: number }[]>>
}) {
  const { setAlert } = useContext(AlertContext)

  const selectMedia = async (source: 'camera' | 'gallery', options: {
    mediaType: string;
    maxWidth: number;
    maxHeight: number;
    quality: number;
  }) => {

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      setAlert({ message: 'Camera permission is required', color: 'error' });
      return;
    }
    try {
      const result =
        source === 'camera'
          //@ts-ignore
          ? await launchCamera(options)
          //@ts-ignore
          : await launchImageLibrary(options);

      if (result.assets && result.assets.length > 0) {
        let tmpfiles = files
        result.assets.map((as, i) => {
          let id = tmpfiles.length + i + 1
          tmpfiles.push({ asset: as, id: id })
        })
        console.log(result.assets)
        setFiles(tmpfiles);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>

      <View style={{ flexDirection: 'row',width:'100%', justifyContent: 'space-around', marginVertical: 10 }}>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon="camera"
            mode="contained"
            size={30}
            onPress={() => {
              selectMedia('camera', {
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.8,
              })
            }}
          />
          <Text>Capture</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon="camera"
            mode="contained"
            size={30}
            onPress={() => {
              selectMedia('camera', {
                mediaType: 'video',
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.8,
              })
            }}
          />
          <Text>Record</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon="image"
            mode="contained"
            size={30}
            onPress={() => selectMedia('gallery', {
              mediaType: 'photo',
              maxWidth: 800,
              maxHeight: 800,
              quality: 0.8,
            })}
          />
          <Text>Gallery</Text>
        </View>

      </View>
    </>
  );
}

export default SelectMediaComponent;
