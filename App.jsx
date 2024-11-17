import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  Clipboard,
  Image,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [image, setImage] = useState('');
  const [text, setText] = useState('');

  // Function to pick image from library
  const pickImage = async () => {
    let result = await launchImageLibrary({mediaType: 'photo'});
    if (result?.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to open camera and take a picture
  const openCamera = async () => {
    let result = await launchCamera({mediaType: 'photo'});
    if (result?.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to recognize text from the selected image
  const recognizeText = async () => {
    if (image) {
      const result = await TextRecognition.recognize(image);
      if (result?.text) {
        setText(result.text);
      }
    }
  };

  // UseEffect to recognize text when image is updated
  useEffect(() => {
    recognizeText();
  }, [image]);

  // Function to copy text to clipboard
  const copyTextToClipboard = () => {
    if (text) {
      Clipboard.setString(text);
      Alert.alert(
        'Text Copied',
        'The recognized text has been copied to clipboard!',
      );
    }
  };

  // Function to clear the image and text
  const clearContent = () => {
    setImage('');
    setText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          {/* Display Logo */}
          <Image
            source={require('./imgs/titleJeReKe.png')}
            style={styles.logo}
          />

          {/* Scanned Text Result Box */}
          <View style={styles.textBox}>
            <ScrollView>
              <Text style={styles.text}>
                {text || 'No text recognized yet.'}
              </Text>
            </ScrollView>
          </View>

          {/* "Choose Image" and "Scan Image" Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.roundedButton, styles.chooseImageButton]}
              onPress={pickImage}>
              <Text style={styles.buttonText}>PICK IMAGE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roundedButton, styles.scanImageButton]}
              onPress={openCamera}>
              <Text style={styles.buttonText}>SCAN IMAGE</Text>
            </TouchableOpacity>
          </View>

          {/* "Copy Text" and "Clear" Buttons (Conditional Visibility) */}
          {text && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.roundedButton, styles.copyTextButton]}
                onPress={copyTextToClipboard}>
                <Text style={styles.buttonText}>Copy Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roundedButton, styles.clearButton]}
                onPress={clearContent}>
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 64,
    paddingHorizontal: 16,
  },
  logo: {
    width: 300, // Increased by 50% (was 200)
    height: 150, // Increased by 50% (was 60)
    resizeMode: 'contain',
    marginTop: -30,
    marginBottom: 20,
  },
  textBox: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderColor: '#1A1A19',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    maxHeight: 200, // Prevents the box from getting too large
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  roundedButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10, // for rounded edges
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150, // Ensures uniform width
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  chooseImageButton: {
    backgroundColor: '#508D4E', // Adjust color here
  },
  scanImageButton: {
    backgroundColor: '#2196F3', // Adjust color here
  },
  copyTextButton: {
    backgroundColor: '#243642', // Adjust color here
  },
  clearButton: {
    backgroundColor: '#F44336', // Adjust color here
  },
  actionButtons: {
    marginTop: 5,
    flexDirection: 'row',
    gap: 10,
  },
});

export default App;
