import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { Button, Text, Divider, Snackbar, ActivityIndicator } from 'react-native-paper';
import { useOtpVerify } from 'react-native-otp-verify';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { UserContext } from '../contexts/UserContext';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { CheckOtpAndLogin, SendOtp } from '../services/UserService';
import { GetUserDto } from '../dto/UserDto';

type Props = StackScreenProps<PublicStackParamList, 'OtpVerifyScreen'>;

const OtpVerifyScreen = ({ route }: Props) => {
    const { hash, otp, timeoutError, stopListener, startListener } = useOtpVerify({ numberOfDigits: 6 });
    const { mobile } = route.params;
    const { setUser } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState<string | undefined>()
    const { mutate, data, isSuccess, error } = useMutation<
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

            setTimeout(() => {
                mutate({ mobile: mobile, otp: Number(otp) })
            }, 2000);
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
        setIsLoading(false)
    }, [timeoutError])
    
    useEffect(() => {
        if (isSuccess && data) {
            setIsLoading(false)
            setUser(data.data.user)
            setMessage(undefined)
            stopListener()
        }
        if (error) {
            setIsLoading(false)
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
                {timeoutError && <Text style={{ color: 'red' }}>Otp Timedout !! Retry</Text>} 
                 <ActivityIndicator size={'large'} style={{ margin: 10 }} color='red' />
                 <Button
                    mode="text"
                    disabled={isLoading}
                    onPress={() => mobile && resendOtp({ mobile: mobile })}
                    labelStyle={{ textAlign: 'center', fontSize: 14, marginTop: 30 }}
                >
                    I didnot get an otp ? Resend

                </Button>
            </View >
        </>
    );
};


export default OtpVerifyScreen;