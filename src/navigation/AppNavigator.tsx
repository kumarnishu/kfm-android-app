import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DetailsScreen from '../screens/DetailScreen';
import { setupInterceptors } from '../services/utils/axiosIterceptor';
import RegisterScreen from '../screens/RegisterScreen';
import OtpVerifyScreen from '../screens/OtpVerifyScreen';
import VideoLoader from '../components/VideoLoader';

export type AuthenticatedStackParamList = {
  Home: undefined;
  Details: { itemId: number }; // Example parameter
};

export type PublicStackParamList = {
  Login: undefined,
  OtpVerify: { mobile: string },
  Register: undefined
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
  <AuthenticatedStack.Navigator initialRouteName="Home" screenOptions={{ animation: 'fade', headerShown: false }}>
    <AuthenticatedStack.Screen name="Home" component={HomeScreen} />
    <AuthenticatedStack.Screen name="Details" component={DetailsScreen} />
  </AuthenticatedStack.Navigator>
);

const PublicNavigator = () => (
  <PublicStack.Navigator initialRouteName="Login" screenOptions={{ animation: 'fade', headerShown: false }}>
    <PublicStack.Screen name="Login" component={LoginScreen} />
    <PublicStack.Screen name="OtpVerify" component={OtpVerifyScreen} />
    <PublicStack.Screen name="Register" component={RegisterScreen} />
  </PublicStack.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useContext(UserContext);

  useEffect(() => {
    setupInterceptors(navigate);
  }, []);
  if (isLoading)
    return <VideoLoader videoUrl='https://www.w3schools.com/html/mov_bbb.mp4' />

  if (!isLoading && user)
    return (
      <NavigationContainer ref={navigationRef}>
        <AuthenticatedNavigator /> 
      </NavigationContainer>
    );
  if (!isLoading && !user)
    return (
      <NavigationContainer ref={navigationRef}>
       <PublicNavigator />
      </NavigationContainer>
    );
};

export default AppNavigator;
