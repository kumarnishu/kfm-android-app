import React, { useContext, useEffect } from 'react';
import { Button, TextInput, HelperText, Snackbar, Divider, Text } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { ScrollView, View, StyleSheet } from 'react-native';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../../..';
import { CreateOrEditEngineer } from '../../../services/EngineerServices';
import { CreateOrEditUserDto, GetUserDto } from '../../../dto/UserDto';
import { AlertContext } from '../../../contexts/AlertContext';

function CreateOrEditEngineerForm({ customer, setDialog, staff }: { customer: string, staff?: GetUserDto, setDialog: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    const { setAlert } = useContext(AlertContext);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const { mutate, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { id?: string, body: CreateOrEditUserDto }
    >(CreateOrEditEngineer, {
        onSuccess: () => {
            setSnackbarMessage("Success!");
            setSnackbarVisible(true);
            setDialog(undefined);
        },
        onError: (error) => {
            setSnackbarMessage(error?.response?.data?.message || "An error occurred.");
            setSnackbarVisible(true);
        },
    });

    const formik = useFormik({
        initialValues: {
            customer: customer,
            email: staff?.email || "",
            mobile: staff?.mobile || "",
            username: staff?.username || "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required').min(4).max(100),
            customer: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email'),
            mobile: Yup.string()
                .required('Mobile is required')
                .matches(/^[0-9]{10}$/, 'Mobile must be a 10-digit number'),
        }),
        onSubmit: (values) => {
            mutate(staff ? { id: staff._id, body: values } : { id: customer, body: values });
        },
    });

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.headerText}>Engineer</Text>
                    
                    <TextInput
                        label="Enter your name"
                        mode="outlined"
                        value={formik.values.username}
                        onChangeText={formik.handleChange('username')}
                        onBlur={formik.handleBlur('username')}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        style={styles.input}
                        accessibilityLabel="Name Input"
                        placeholder="e.g., John Doe"
                    />
                    {formik.touched.username && formik.errors.username && <HelperText type="error">{formik.errors.username}</HelperText>}

                    <TextInput
                        label="Enter your email"
                        mode="outlined"
                        value={formik.values.email}
                        onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        style={styles.input}
                        accessibilityLabel="Email Input"
                        placeholder="e.g., john.doe@example.com"
                    />
                    {formik.touched.email && formik.errors.email && <HelperText type="error">{formik.errors.email}</HelperText>}

                    <TextInput
                        label="Enter your mobile"
                        mode="outlined"
                        keyboardType="number-pad"
                        value={formik.values.mobile}
                        onChangeText={formik.handleChange('mobile')}
                        onBlur={formik.handleBlur('mobile')}
                        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                        style={styles.input}
                        accessibilityLabel="Mobile Input"
                        placeholder="e.g., 1234567890"
                    />
                    {formik.touched.mobile && formik.errors.mobile && <HelperText type="error">{formik.errors.mobile}</HelperText>}

                    <Divider style={styles.divider} />
                    <Button
                        mode="contained"
                        onPress={()=>formik.handleSubmit()}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.submitButton}
                        labelStyle={styles.submitButtonText}
                    >
                        Submit
                    </Button>
                </View>
            </ScrollView>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
            >
                {snackbarMessage}
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    formContainer: {
        flex:1,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#ffffff',
    },
    divider: {
        marginVertical: 10,
        height: 1,
        backgroundColor: '#ddd',
    },
    submitButton: {
        backgroundColor: 'red',
        borderRadius: 8,
        paddingVertical: 10,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateOrEditEngineerForm;
