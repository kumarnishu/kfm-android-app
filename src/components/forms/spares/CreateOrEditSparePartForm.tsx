import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  TextInput,
  HelperText,
  Text,
  Snackbar,
  Divider,
  IconButton,
} from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { ScrollView, View, Image, PermissionsAndroid, Platform } from 'react-native';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { BackendError } from '../../../..';
import { GetSparePartDto } from '../../../dto/SparePartDto';
import { CreateOrEditSparePart } from '../../../services/SparePartService';
import { AlertContext } from '../../../contexts/AlertContext';
import { queryClient } from '../../../App';


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
function CreateOrEditSparePartForm({
  part,
  setDialog,
}: {
  part?: GetSparePartDto;
  setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [message, setMessage] = useState<string | undefined>();
  const [validated, setValidated] = useState(true)
  const { setAlert } = useContext(AlertContext);
  const [file, setFile] = useState<Asset | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const { mutate, isSuccess, isLoading } = useMutation<
    AxiosResponse<{ message: string }>,
    BackendError,
    { id?: string; body: FormData }
  >(CreateOrEditSparePart, {
    onSuccess: () => {
      queryClient.invalidateQueries('spares')
    },
    onError: (error) => {
      error && setMessage(error.response.data.message || '');
    },
  });

  const formik = useFormik({
    initialValues: {
      name: part ? part.name : '',
      partno: part ? part.partno : '',
      price: part ? part.price : 0,
      photo: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required').max(100),
      partno: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
    }),
    onSubmit: (values) => {
      let formData = new FormData();
      if (file) {
        formData.append('file', {
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        });
      }
      formData.append('body', JSON.stringify(values));
      if (validated) {
        if (part) {
          mutate({ id: part._id, body: formData });
        } else {
          mutate({ body: formData });
        }
      }

    },
  });

  useEffect(() => {
    if (isSuccess) {
      setMessage(`success`);
      setTimeout(() => {
        formik.resetForm();
      }, 3000);
      setDialog(undefined);
    }
  }, [isSuccess]);

  const selectPhoto = async (source: 'camera' | 'gallery') => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };
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
        const selectedFile = result.assets[0];
        if (selectedFile.fileSize && selectedFile.fileSize > 20 * 1024 * 1024) {
          setAlert({ message: 'Size should be less than 20 MB', color: 'info' });
          setValidated(false)
          return;
        }
        if (
          selectedFile.type &&
          !['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)
        ) {
          setAlert({
            message: 'Allowed formats: .jpg, .jpeg, .png, .gif',
            color: 'info',
          });
          setValidated(false)
          return;
        }
        setFile(selectedFile as unknown as File);
        setPreview(selectedFile.uri);
        setValidated(true)
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {message && (
        <Snackbar
          visible={!!message}
          onDismiss={() => setMessage(undefined)}
          action={{
            label: 'Close',
            onPress: () => setMessage(undefined),
          }}
          duration={2000}
        >
          {message}
        </Snackbar>
      )}
      <ScrollView>
        <View style={{ flex: 1, justifyContent: 'center', padding: 10, gap: 2 }}>
          <Text
            style={{
              fontSize: 30,
              textAlign: 'center',
              padding: 20,
              fontWeight: 'bold',
            }}
          >
            Spare
          </Text>
          <TextInput
            label="Enter Partno"
            mode="outlined"
            value={formik.values.partno}
            onChangeText={formik.handleChange('partno')}
            onBlur={formik.handleBlur('partno')}
            error={formik.touched.partno && Boolean(formik.errors.partno)}
          />
          {formik.touched.partno && Boolean(formik.errors.partno) && (
            <HelperText type="error">{formik.errors.partno}</HelperText>
          )}
          <TextInput
            label="Enter Part Name"
            mode="outlined"
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          {formik.touched.name && Boolean(formik.errors.name) && (
            <HelperText type="error">{formik.errors.name}</HelperText>
          )}
          <TextInput
            label="Enter Price"
            mode="outlined"
            keyboardType="number-pad"
            value={String(formik.values.price)}
            onChangeText={formik.handleChange('price')}
            onBlur={formik.handleBlur('price')}
            error={formik.touched.price && Boolean(formik.errors.price)}
          />
          {formik.touched.price && Boolean(formik.errors.price) && (
            <HelperText type="error">{formik.errors.price}</HelperText>
          )}
          <Divider style={{ marginVertical: 10 }} />
        </View>
        {preview ? (
          <Image
            source={{ uri: preview }}
            style={{ width: '100%', height: 300, marginBottom: 10 }}
          />) :
          (

            part?.photo && <Image
              source={{ uri: part.photo }}
              style={{ width: '100%', height: 300, marginBottom: 10 }}
            />
          )
        }

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
          <View style={{ alignItems: 'center' }}>
            <IconButton
              icon="camera"
              mode="contained"
              size={30}
              onPress={() => selectPhoto('camera')}
            />
            <Text>Take Photo</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <IconButton
              icon="image"
              mode="contained"
              size={30}
              onPress={() => selectPhoto('gallery')}
            />
            <Text>Gallery</Text>
          </View>


        </View>
        <Button
          mode="contained"
          buttonColor="red"
          style={{ padding: 5, borderRadius: 10 }}
          onPress={() => formik.handleSubmit()}
          loading={isLoading}
          disabled={isLoading || !validated}
        >
          Submit
        </Button>
      </ScrollView>
    </>
  );
}

export default CreateOrEditSparePartForm;
