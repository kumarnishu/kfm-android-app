import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { GetServiceRequestDetailedDto } from '../../dto/ServiceRequestDto';
import { BackendError } from '../../..';
import { GetServiceRequest } from '../../services/ServiceRequestService';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Video from 'react-native-video';

type Props = StackScreenProps<AuthenticatedStackParamList, 'ServiceRequestDetailsScreen'>;

const ServiceRequestDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [request, setRequest] = useState<GetServiceRequestDetailedDto>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetServiceRequestDetailedDto>, BackendError>(["request-detailed"], async () => GetServiceRequest({ id: id }))


  useEffect(() => {
    if (isSuccess && data)
      setRequest(data.data)
  }, [isSuccess])

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Request...</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load requests. Please try again later.</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }
  console.log(request?.customer)
  return (
    <>

      {request && <ScrollView style={styles.container}>
        <Text style={styles.title}>{request?.request_id}</Text>
        <Text>Problems</Text>
        {request.problem.photos && request.problem.photos.map((p) => {
          return (
            <Image source={{ uri: p }} height={300} width={200} />
          )
        })}
        {request.problem.videos && request.problem.videos.map((p) => {
          return (
            <Video
              key={p}
              source={{ uri: p }}
              style={{ width: '100%', height: 300 }} // Apply dynamic width and height
              resizeMode="cover" // Ensures the video covers the screen while maintaining aspect ratio
              controls={true}
            />
          )
        })}
      </ScrollView>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ServiceRequestDetailsScreen;
