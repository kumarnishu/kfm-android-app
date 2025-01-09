import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { Button, Text, Divider, Snackbar, ActivityIndicator } from 'react-native-paper';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { UserContext } from '../contexts/UserContext';
import { GetUserDto } from '../dto/user.dto';
import { CheckOtpAndLogin, SendOtp } from '../services/UserService';
import { useOtpVerify } from 'react-native-otp-verify';

type Props = StackScreenProps<PublicStackParamList, 'OtpVerify'>;

const OtpVerifyScreen = ({ route }: Props) => {
    const { hash, otp, timeoutError, stopListener, startListener } = useOtpVerify({ numberOfDigits: 6 });
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



    useEffect(() => {
        startListener()
    }, [])
    useEffect(() => {
        if (otp && mobile) {
            mutate({ mobile: mobile, otp: Number(otp) })
        }
    }, [otp])

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
            stopListener()
        }
        if (error) {
            setMessage(error?.response?.data?.message || 'Unknown error occurred');
        }
    }, [isSuccess, error]);
    console.log(hash)
    console.log(otp)
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
                {timeoutError && <Text style={{ color: 'red' }}>Otp Timedout !! Retry</Text>} <Divider />
                {isLoading && <ActivityIndicator size={'large'} style={{ margin: 10 }} color='red' />}
                {!isLoading && <Button
                    mode="text"
                    disabled={isLoading}
                    onPress={() => mobile && resendOtp({ mobile: mobile })}
                    labelStyle={{ textAlign: 'center', fontSize: 14, marginTop: 30 }}
                >
                    I didnot get an otp ? Resend

                </Button>}
            </View >
        </>
    );
};


export default OtpVerifyScreen;