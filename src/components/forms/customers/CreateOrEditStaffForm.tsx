// import React, { useEffect, useContext } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useMutation } from 'react-query';
// import { AlertContext } from '../../../contexts/alertContext';
// import { CreateOrEditCustomer } from '../../../services/CustomerService';

// export type GetUserDto = {
//   _id?: string;
//   username: string;
//   mobile: string;
//   email: string;
//   dp: string;
//   is_active: boolean;
//   customer: string;
//   role: string; // 'admin', 'engineer', 'owner', 'staff'
//   mobile_verified: boolean;
//   email_verified: boolean;
//   created_at?: string;
//   updated_at?: string;
//   created_by?: string;
//   updated_by?: string;
// };

// type Props = {
//   user?: GetUserDto;
//   setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
// };

// function CreateOrEditUserForm({ user, setDialog }: Props) {
//   const { mutate, isLoading, isSuccess, error } = useMutation<
//     any,
//     any,
//     { id?: string; body: GetUserDto }
//   >(CreateOrEditCustomer, {
//     onSuccess: () => {
//       queryClient.invalidateQueries('users');
//     },
//   });

//   const { setAlert } = useContext(AlertContext);

//   const formik = useFormik({
//     initialValues: {
//       username: user?.username || '',
//       mobile: user?.mobile || '',
//       email: user?.email || '',
//       dp: user?.dp || '',
//       is_active: user?.is_active || false,
//       customer: user?.customer || '',
//       role: user?.role || '',
//       mobile_verified: user?.mobile_verified || false,
//       email_verified: user?.email_verified || false,
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required('Username is required'),
//       mobile: Yup.string().required('Mobile number is required'),
//       email: Yup.string().email('Invalid email').required('Email is required'),
//       role: Yup.string().required('Role is required'),
//       customer: Yup.string().required('Customer is required'),
//     }),
//     onSubmit: (values) => {
//       if (user && user._id) mutate({ id: user._id, body: values });
//       else mutate({ body: values });
//     },
//   });

//   useEffect(() => {
//     if (user) {
//       formik.setValues({
//         username: user.username,
//         mobile: user.mobile,
//         email: user.email,
//         dp: user.dp,
//         is_active: user.is_active,
//         customer: user.customer,
//         role: user.role,
//         mobile_verified: user.mobile_verified,
//         email_verified: user.email_verified,
//       });
//     } else {
//       formik.resetForm();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (isSuccess) {
//       setDialog(undefined);
//       setAlert({
//         message: user ? 'Updated user successfully' : 'Created new user successfully',
//         color: 'info',
//       });
//     }
//     if (error) {
//       setAlert({
//         message: error.response.data.message || 'An error occurred',
//         color: 'error',
//       });
//     }
//   }, [isSuccess, error]);

//   return (
//     <View style={styles.container}>
//       <TextInput
//         label="Username"
//         mode="outlined"
//         error={!!(formik.touched.username && formik.errors.username)}
//         onChangeText={formik.handleChange('username')}
//         onBlur={formik.handleBlur('username')}
//         value={formik.values.username}
//       />
   

//       <TextInput
//         label="Mobile"
//         mode="outlined"
//         error={!!(formik.touched.mobile && formik.errors.mobile)}
//         onChangeText={formik.handleChange('mobile')}
//         onBlur={formik.handleBlur('mobile')}
//         value={formik.values.mobile}
//         style={styles.spacing}
//       />
    

//       <TextInput
//         label="Email"
//         mode="outlined"
//         error={!!(formik.touched.email && formik.errors.email)}
//         onChangeText={formik.handleChange('email')}
//         onBlur={formik.handleBlur('email')}
//         value={formik.values.email}
//         style={styles.spacing}
//       />
      

//       <TextInput
//         label="Role"
//         mode="outlined"
//         error={!!(formik.touched.role && formik.errors.role)}
//         onChangeText={formik.handleChange('role')}
//         onBlur={formik.handleBlur('role')}
//         value={formik.values.role}
//         style={styles.spacing}
//       />
     

//       <TextInput
//         label="Customer"
//         mode="outlined"
//         error={!!(formik.touched.customer && formik.errors.customer)}
//         onChangeText={formik.handleChange('customer')}
//         onBlur={formik.handleBlur('customer')}
//         value={formik.values.customer}
//         style={styles.spacing}
//       />
     

//       <Button
//         mode="contained"
//         onPress={()=>formik.handleSubmit}
//         loading={isLoading}
//         disabled={isLoading}
//         style={styles.spacing}
//       >
//         Submit
//       </Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   spacing: {
//     marginTop: 16,
//   },
// });

// export default CreateOrEditUserForm;
