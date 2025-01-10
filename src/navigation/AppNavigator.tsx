import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { setupInterceptors } from '../services/utils/axiosIterceptor';
import RegisterScreen from '../screens/RegisterScreen';
import OtpVerifyScreen from '../screens/OtpVerifyScreen';
import VideoLoader from '../components/VideoLoader';
import CustomerDetailsScreen from '../screens/CustomerDetailsScreen';
import CustomersScreen from '../screens/CustomersScreen';
import Navbar from '../components/NavBar';

export type AuthenticatedStackParamList = {
  HomeScreen: undefined;
  CustomerDetailsScreen: { id: number }; // Example parameter
  CustomersScreen: undefined
};

export type PublicStackParamList = {
  LoginScreen: undefined,
  OtpVerifyScreen: { mobile: string },
  RegisterScreen: undefined
};

export const navigationRef = createNavigationContainerRef();

export const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    //@ts-ignore
    navigationRef.navigate(name, params);
  }
};

const AuthenticatedStack = createStackNavigator<AuthenticatedStackParamList>();
const PublicStack = createStackNavigator<PublicStackParamList>();

const AuthenticatedNavigator = () => (
  <AuthenticatedStack.Navigator initialRouteName="HomeScreen" screenOptions={{ animation: 'fade', headerShown: false }}>
    <AuthenticatedStack.Screen name="HomeScreen" component={HomeScreen} />
    <AuthenticatedStack.Screen name="CustomersScreen" component={CustomersScreen} />
    <AuthenticatedStack.Screen name="CustomerDetailsScreen" component={CustomerDetailsScreen} />
  </AuthenticatedStack.Navigator>
);

const PublicNavigator = () => (
  <PublicStack.Navigator initialRouteName="LoginScreen" screenOptions={{ animation: 'fade', headerShown: false }}>
    <PublicStack.Screen name="LoginScreen" component={LoginScreen} />
    <PublicStack.Screen name="OtpVerifyScreen" component={OtpVerifyScreen} />
    <PublicStack.Screen name="RegisterScreen" component={RegisterScreen} />
  </PublicStack.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useContext(UserContext);

  useEffect(() => {
    setupInterceptors(navigate);
  }, []);

  if (isLoading)
    return (
      <NavigationContainer>
        <VideoLoader videoUrl='https://www.w3schools.com/html/mov_bbb.mp4' />
      </NavigationContainer>
    )

  return (
    <NavigationContainer ref={navigationRef}>

      {user ? <>
        <Navbar />
        <AuthenticatedNavigator />
      </> : <PublicNavigator />}
    </NavigationContainer>
  );

};

export default AppNavigator;
