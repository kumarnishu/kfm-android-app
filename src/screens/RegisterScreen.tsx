import React, { useContext, useEffect, useState } from 'react';
import { Button, TextInput, HelperText, Text, Snackbar, Divider } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { ScrollView, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { CreateOrEditCustomer } from '../services/CustomerService';
import { CreateOrEditCustomerDto } from '../dto/CustomerDto';
import { AlertContext } from '../contexts/AlertContext';

type Props = StackScreenProps<PublicStackParamList, 'RegisterScreen'>;


function RegisterScreen({ navigation }: Props) {
  const { setAlert } = useContext(AlertContext)
  const { mutate, isSuccess, isLoading } = useMutation<
    AxiosResponse<{ message: string }>,
    BackendError,
    { id?: string, body: CreateOrEditCustomerDto }
  >(CreateOrEditCustomer, {
    onError: ((error) => {
      error && setAlert({ message: error.response.data.message || "", color: 'error' })
    })
  });


  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      address: "",

    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required').min(4).max(100),
      email: Yup.string().required('Required').email('Invalid email'),
      gst: Yup.string().required('Required 15 digit gst number').min(15).max(15),
      address: Yup.string().required('Required Address').min(4).max(300),
      pincode: Yup.number().required('Required 6 digit pincode').min(100000).max(999999),
      mobile: Yup.string().required('mobile is required').min(10, 'mobile must be 10 digits').max(10, 'mobile must be 10 digits').matches(/^[0-9]+$/, 'mobile must be a number'),
    }),
    onSubmit: (values) => {
      mutate({ body: values });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setAlert({ message: `${formik.values.name} ThankYou for joining With us !!`, color: 'error' })
      setTimeout(() => {
        {
          formik.resetForm()
          navigation.navigate("LoginScreen")
        }
      }, 3000);
    }

  }, [isSuccess]);


  return (
    <>

      <ScrollView>
        <View style={{ flex: 1, justifyContent: 'center', padding: 10, gap: 2 }}>
          <Text style={{ fontSize: 30, textAlign: 'center', padding: 20, fontWeight: 'bold' }}>Create Account</Text>
          <TextInput
            label="Enter you name"
            mode="outlined"
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          {formik.touched.name && Boolean(formik.errors.name) && <HelperText type="error" >
            {formik.errors.name}
          </HelperText>}

          <TextInput
            label="Enter your email"
            mode="outlined"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          {formik.touched.email && Boolean(formik.errors.email) && <HelperText type="error" >
            {formik.errors.email}
          </HelperText>}

          <TextInput
            label="Enter your mobile"
            mode="outlined"
            keyboardType="number-pad"
            value={formik.values.mobile}
            onChangeText={formik.handleChange('mobile')}
            onBlur={formik.handleBlur('mobile')}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          />
          {formik.touched.mobile && Boolean(formik.errors.mobile) && <HelperText type="error" >
            {formik.errors.mobile}
          </HelperText>}


          <TextInput
            label="Enter your address"
            mode="outlined"
            multiline
            style={{ height: 100 }}
            numberOfLines={4}
            value={formik.values.address}
            onChangeText={formik.handleChange('address')}
            onBlur={formik.handleBlur('address')}
            error={formik.touched.address && Boolean(formik.errors.address)}
          />
          {formik.touched.address && Boolean(formik.errors.address) && < HelperText type="error">
            {formik.errors.address}
          </HelperText>}
          <Divider style={{ marginVertical: 10 }} />
          <Button
            mode="contained"
            buttonColor='red'
            style={{ padding: 5, borderRadius: 10 }}
            onPress={() => formik.handleSubmit()}
            loading={isLoading}
            disabled={isLoading}
          >
            Register
          </Button>

        </View>
      </ScrollView >
    </>
  );
}



export default RegisterScreen;