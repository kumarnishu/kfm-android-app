import React, { useContext, useEffect, useState } from 'react';
import { Button, TextInput, HelperText, Text, Snackbar, Divider } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { ScrollView, View } from 'react-native';
import { BackendError } from '../../../..';
import { CreateOrEditEngineer } from '../../../services/EngineerServices';
import { CreateOrEditUserDto, GetUserDto } from '../../../dto/UserDto';
import { AlertContext } from '../../../contexts/AlertContext';


function CreateOrEditEngineerForm({ customer, setDialog, staff }: { customer: string, staff?: GetUserDto, setDialog: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    const { setAlert } = useContext(AlertContext);
    const { mutate, isSuccess, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { id?: string, body: CreateOrEditUserDto }
    >(CreateOrEditEngineer, {
        onError: ((error) => {
            error && setAlert({ message: error.response.data.message || "", color: 'error' })
        })
    });


    const formik = useFormik({
        initialValues: {
            customer: customer,
            email: staff ? staff.email : "",
            mobile: staff ? staff.mobile : "",
            username: staff ? staff.username : "",

        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required').min(4).max(100),
            customer: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email'),
            mobile: Yup.string().required('mobile is required').min(10, 'mobile must be 10 digits').max(10, 'mobile must be 10 digits').matches(/^[0-9]+$/, 'mobile must be a number'),
        }),
        onSubmit: (values) => {
            if (staff) {
                mutate({ id: staff._id, body: values });
            }
            else {
                mutate({ id: customer, body: values });
            }

        },
    });

    useEffect(() => {
        if (isSuccess) {
            setAlert({ message: `success`, color: 'success' })
            setDialog(undefined)
            setTimeout(() => {
                {
                    formik.resetForm()
                }
            }, 3000);
        }

    }, [isSuccess]);


    return (
        <>

            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center', padding: 10, gap: 2 }}>
                    <Text style={{ fontSize: 30, textAlign: 'center', padding: 20, fontWeight: 'bold' }}>Engineer</Text>                    <TextInput
                        label="Enter you name"
                        mode="outlined"
                        value={formik.values.username}
                        onChangeText={formik.handleChange('username')}
                        onBlur={formik.handleBlur('username')}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                    />
                    {formik.touched.username && Boolean(formik.errors.username) && <HelperText type="error" >
                        {formik.errors.username}
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


                    <Divider style={{ marginVertical: 10 }} />
                    <Button
                        mode="contained"
                        buttonColor='red'
                        style={{ padding: 5, borderRadius: 10 }}
                        onPress={() => formik.handleSubmit()}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Submit
                    </Button>

                </View>
            </ScrollView >
        </>
    );
}



export default CreateOrEditEngineerForm;