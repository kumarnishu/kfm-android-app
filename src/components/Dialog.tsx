import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dialog as RNDialog, useTheme } from 'react-native-paper';
import DialogContent from 'react-native-paper/lib/typescript/components/Dialog/DialogContent';

type Props = {
  visible: boolean;
  handleClose: () => void;
  fullScreen?: boolean;
  children?: React.ReactNode;
};

const Dialog = ({ visible, handleClose, fullScreen = false, children }: Props) => {
  const [isFullScreen, setIsFullScreen] = useState(fullScreen);
  const theme = useTheme();

  useEffect(() => {
    setIsFullScreen(fullScreen);
  }, [fullScreen]);

  return (
    <RNDialog
      visible={visible}
      onDismiss={handleClose}
      style={[
        styles.default,
        isFullScreen && styles.fullScreen,
      ]}
    >
      <View style={isFullScreen ? styles.fullScreenContent : undefined}>
        {children}
      </View>
    </RNDialog>
  );
};

const styles = StyleSheet.create({
  default: {
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    margin: 0, // Remove any default margins
    padding: 0,
    borderRadius: 0, // No rounded corners for fullscreen
  },
  fullScreenContent: {
    flex: 1,
    padding: 16,
  },
});

export default Dialog;
