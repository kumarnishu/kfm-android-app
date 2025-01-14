import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  TextInput,
  HelperText,
  Text,
  Snackbar,
  Divider,
} from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { ScrollView, View, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { BackendError } from '../../../..';
import { GetSparePartDto } from '../../../dto/SparePartDto';
import { CreateOrEditSparePart } from '../../../services/SparePartService';
import { AlertContext } from '../../../contexts/AlertContext';

function NewServiceRequestsForm({
  part,
  setDialog,
}: {
  part?: GetSparePartDto;
  setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [message, setMessage] = useState<string | undefined>();
  const { setAlert } = useContext(AlertContext);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [fileType, setFileType] = useState<'photo' | 'video' | null>(null);
  const { mutate, isSuccess, isLoading } = useMutation<
    AxiosResponse<{ message: string }>,
    BackendError,
    { id?: string; body: FormData }
  >(CreateOrEditSparePart, {
    onError: (error) => {
      error && setMessage(error.response.data.message || '');
    },
  });

  const formik = useFormik({
    initialValues: {
      name: part ? part.name : '',
      partno: part ? part.partno : '',
      price: part ? part.price : 0,
      media: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required').max(100),
      partno: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
    }),
    onSubmit: (values) => {
      let formData = new FormData();
      if (file) {
        formData.append('media', {
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        });
      }
      formData.append('name', values.name);
      formData.append('partno', values.partno);
      formData.append('price', String(values.price));

      if (part) {
        mutate({ id: part._id, body: formData });
      } else {
        mutate({ body: formData });
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setMessage(`${formik.values.name} ThankYou for joining With us !!`);
      setTimeout(() => {
        formik.resetForm();
      }, 3000);
      setDialog(undefined);
    }
  }, [isSuccess]);

  const selectMedia = async (source: 'camera' | 'gallery', mediaType: 'photo' | 'video') => {
    const options = {
      mediaType: mediaType,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    try {
      const result =
        source === 'camera'
          ? await launchCamera(options)
          : await launchImageLibrary(options);

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        if (mediaType === 'photo' && selectedFile.fileSize && selectedFile.fileSize > 20 * 1024 * 1024) {
          setAlert({ message: 'Size should be less than 20 MB', color: 'info' });
          return;
        }
        if (mediaType === 'video' && selectedFile.fileSize && selectedFile.fileSize > 50 * 1024 * 1024) {
          setAlert({ message: 'Video size should be less than 50 MB', color: 'info' });
          return;
        }
        setFile(selectedFile as unknown as File);
        setPreview(selectedFile.uri);
        setFileType(mediaType);
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
            Customer
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
          <Button
            mode="contained"
            style={{ marginBottom: 10 }}
            onPress={() => selectMedia('camera', 'photo')}
          >
            Take Photo
          </Button>
          <Button
            mode="contained"
            style={{ marginBottom: 10 }}
            onPress={() => selectMedia('gallery', 'photo')}
          >
            Choose Photo from Gallery
          </Button>
          <Button
            mode="contained"
            style={{ marginBottom: 10 }}
            onPress={() => selectMedia('camera', 'video')}
          >
            Record Video
          </Button>
          <Button
            mode="contained"
            style={{ marginBottom: 10 }}
            onPress={() => selectMedia('gallery', 'video')}
          >
            Choose Video from Gallery
          </Button>
          {fileType === 'photo' && preview && (
            <Image
              source={{ uri: preview }}
              style={{ width: 100, height: 100, marginBottom: 10 }}
            />
          )}
          {fileType === 'video' && preview && (
            <Video
              source={{ uri: preview }}
              style={{ width: 300, height: 200, marginBottom: 10 }}
              controls
            />
          )}
          <Button
            mode="contained"
            buttonColor="red"
            style={{ padding: 5, borderRadius: 10 }}
            onPress={() => formik.handleSubmit()}
            loading={isLoading}
            disabled={isLoading}
          >
            Submit
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

export default NewServiceRequestsForm;
