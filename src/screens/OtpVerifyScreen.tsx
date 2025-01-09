import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { TextInput, Button, Text, Divider, Snackbar } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { UserContext } from '../contexts/UserContext';
import { GetUserDto } from '../dto/user.dto';
import { CheckOtpAndLogin, SendOtp } from '../services/UserService';

type Props = StackScreenProps<PublicStackParamList, 'OtpVerify'>;

const OtpVerifyScreen = ({ route }: Props) => {
    const { mobile } = route.params;
    const { setUser } = useContext(UserContext)
    const [message, setMessage] = useState<string | undefined>()
    const { mutate, data, isSuccess, isLoading, error } = useMutation<
        AxiosResponse<{ user: GetUserDto; token: string }>,
        BackendError,
        { mobile: string, otp: number }
    >(CheckOtpAndLogin, {
        onError: ((error) => {
            error && setMessage(error.response.data.message || "")
        })
    });
    const { mutate: resendOtp, isSuccess: isotpSuccss } = useMutation<
        AxiosResponse<{ user: GetUserDto; token: string }>,
        BackendError,
        { mobile: string }
    >(SendOtp, {
        onError: ((error) => {
            error && setMessage(error.response.data.message || "")
        })
    });

    console.log(mobile)
    const formik = useFormik({
        initialValues: {
            mobile: String(mobile),
            otp: 0,
        },
        validationSchema: Yup.object({
            mobile: Yup.string().required('mobile is required').min(10, 'mobile must be 10 digits').max(10, 'mobile must be 10 digits').matches(/^[0-9]+$/, 'mobile must be a number'),
            otp: Yup.number().required('otp is required').min(100000, 'otp must be 6 digits').max(999999, 'otp must be 6 digits')
        }),
        onSubmit: async (values) => {
            mutate(values);
        },
    });

    useEffect(() => {
        if (isotpSuccss) {
            setMessage('Otp sent successfully')
        }
        if (error) {
            setMessage(error?.response?.data?.message || 'Unknown error occurred');
        }
    }, [isSuccess, error]);

    useEffect(() => {
        if (isSuccess && data) {
            setUser(data.data.user)
            setMessage(undefined)
        }
        if (error) {
            setMessage(error?.response?.data?.message || 'Unknown error occurred');
        }
    }, [isSuccess, error]);

    return (
        <>
            {message && <Snackbar
                visible={message ? true : false}
                onDismiss={() => setMessage(undefined)}
                action={{
                    label: 'Close',
                    onPress: () => {
                        setMessage(undefined)
                    },
                }}
                duration={3000} // Optional: Snackbar duration (in milliseconds)
            >
                {message}
            </Snackbar>}
            <View style={{ flex: 1, padding: 20, flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
                <TextInput
                    label="Enter your otp"
                    placeholder="Enter your otp"
                    autoFocus
                    value={String(formik.values.otp)}
                    onChangeText={formik.handleChange('otp')}
                    onBlur={formik.handleBlur('otp')}
                    keyboardType='numeric'
                    mode="outlined"
                    style={{ backgroundColor: 'white', paddingTop: 10, borderRadius: 10 }}
                    error={formik.touched.otp && !!formik.errors.otp}
                />
                {formik.touched.otp && formik.errors.otp && <Text style={{ color: 'red' }}>{formik.errors.otp}</Text>} <Divider />
                <Button
                    mode="contained"
                    onPress={() => formik.handleSubmit()}
                    loading={isLoading}
                    buttonColor='red'
                    style={{ padding: 5, borderRadius: 10 }}
                >
                    <Text> Verify otp</Text>
                </Button>

                <Button
                    mode="text"
                    disabled={isLoading}
                    onPress={() => resendOtp({ mobile: formik.values.mobile })}
                    labelStyle={{ textAlign: 'center', fontSize: 14, marginTop: 30 }}
                >
                    I didnot get an otp ? Resend

                </Button>
            </View >
        </>
    );
};


export default OtpVerifyScreen;