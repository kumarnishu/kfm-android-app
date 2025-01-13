import React, { useContext, useEffect, useState } from 'react';
import { Button, TextInput, HelperText, Text, Snackbar, Divider, Checkbox } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BackendError } from '../../../..';
import { CreateOrEditRegisteredProductDto, GetRegisteredProductDto } from '../../../dto/RegisteredProducDto';
import { CreateOrEditRegisteredProduct } from '../../../services/RegisteredProductService';
import { AlertContext } from '../../../contexts/AlertContext';
import { DropDownDto } from '../../../dto/DropDownDto';
import { GetAllCustomersForDropDown } from '../../../services/CustomerService';
import { GetAllMachinesDropdown } from '../../../services/MachineService';

function CreateOrEditRegisteredProductForm({
    setDialog,
    product,
}: {
    product?: GetRegisteredProductDto;
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    const { setAlert } = useContext(AlertContext);
    const { mutate, isSuccess, isLoading } = useMutation<AxiosResponse<{ message: string }>, BackendError, { id?: string; body: CreateOrEditRegisteredProductDto }>(
        CreateOrEditRegisteredProduct,
        {
            onError: (error) => {
                error && setAlert({ message: error.response?.data?.message || 'An error occurred', color: 'error' });
            },
        }
    );

    // Fetch dropdown data
    const { data: customersData } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>('customers', GetAllCustomersForDropDown);
    const { data: machinesData } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>('machines', GetAllMachinesDropdown);

    const formik = useFormik({
        initialValues: {
            customer: product ? product.customer.id : '',
            sl_no: product ? product.sl_no : '',
            machine: product ? product.machine.id : '',
            isInstalled: product?.isInstalled || false,
        },
        validationSchema: Yup.object({
            customer: Yup.string().required('Customer is required'),
            sl_no: Yup.string().required('Serial number is required'),
            machine: Yup.string().required('Machine type is required'),
        }),
        onSubmit: (values) => {
            if (product) {
                mutate({ id: product._id, body: values });
            } else {
                mutate({ body: values });
            }
        },
    });

    useEffect(() => {
        if (isSuccess) {
            setAlert({ message: 'Successfully saved', color: 'success' });
            setDialog(undefined);
            setTimeout(() => formik.resetForm(), 3000);
        }
    }, [isSuccess]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registered Product</Text>

            {/* Serial Number */}
            <TextInput
                label="Enter Serial Number"
                mode="outlined"
                value={formik.values.sl_no}
                onChangeText={formik.handleChange('sl_no')}
                onBlur={formik.handleBlur('sl_no')}
                error={formik.touched.sl_no && Boolean(formik.errors.sl_no)}
            />
            {formik.touched.sl_no && formik.errors.sl_no && (
                <HelperText type="error">{formik.errors.sl_no}</HelperText>
            )}

            <Picker
                placeholder="Select Customer"
                onValueChange={formik.handleChange('customer')}
                selectedValue={formik.values.customer}
                enabled={true}

                style={{
                    height: 80, // Height of the Picker
                    color: '#333', // Text color
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Picker.Item label="Select Customer" value={undefined} />
                {customersData && customersData.data.map((item, index) => {
                    return (
                        <Picker.Item key={index + 1} label={String(item.label.toUpperCase())} value={item.id} />
                    );
                })}
            </Picker>

            {
                formik.touched.customer && formik.errors.customer && (
                    <HelperText type="error">{formik.errors.customer}</HelperText>
                )
            }

            <Picker
                placeholder="Select Machine"
                onValueChange={formik.handleChange('machine')}
                selectedValue={formik.values.machine}
                enabled={true}

                style={{
                    height: 80, // Height of the Picker
                    color: '#333', // Text color
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Picker.Item label="Select Machine" value={undefined} />
                {machinesData && machinesData.data.map((item, index) => {
                    return (
                        <Picker.Item key={index + 1} label={String(item.label.toUpperCase())} value={item.id} />
                    );
                })}
            </Picker>

            {
                formik.touched.machine && formik.errors.machine && (
                    <HelperText type="error">{formik.errors.machine}</HelperText>
                )
            }
            {/* Is Installed Checkbox */}
            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={formik.values.isInstalled ? 'checked' : 'unchecked'}
                    onPress={() => formik.setFieldValue('isInstalled', !formik.values.isInstalled)}
                />
                <Text>Is Installed?</Text>
            </View>

            <Divider style={styles.divider} />

            {/* Submit Button */}
            <Button
                mode="contained"
                buttonColor="red"
                style={styles.submitButton}
                onPress={() => formik.handleSubmit()}
                loading={isLoading}
                disabled={isLoading}
            >
                Submit
            </Button>
        </View >
    );
}

export default CreateOrEditRegisteredProductForm;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 10, gap: 2 },
    title: { fontSize: 30, textAlign: 'center', padding: 20, fontWeight: 'bold' },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    divider: { marginVertical: 10 },
    submitButton: { padding: 5, borderRadius: 10 },
});

const pickerSelectStyles = {
    inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 4, color: 'black', marginVertical: 10 },
    inputAndroid: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 4, color: 'black', marginVertical: 10 },
};
