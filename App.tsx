import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

const calculateTemperatureDrop = (duration, waterTemperature, bodyWeight) => {
  const specificHeatCapacity = 3.5; // kJ/kg/°C
  const bodySurfaceArea = 0.20247 * Math.pow(bodyWeight, 0.425) * Math.pow(170, 0.725); // m²
  const waterDensity = 1000; // kg/m³
  const waterVolume = bodyWeight * 0.6; // L
  const temperatureDrop = (specificHeatCapacity * bodyWeight * bodySurfaceArea * duration) / (waterVolume * waterDensity * (waterTemperature - 0.1));
  return temperatureDrop.toFixed(2);
};

export default function App() {
  const [bodyWeight, setBodyWeight] = useState('');
  const [waterTemperature, setWaterTemperature] = useState('');
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');

  function startStopwatch() {
    setStopwatchRunning(true);
    setStartTime(Date.now());
  }

  const stopStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(stopwatchTime + Date.now() - startTime);
    const duration = stopwatchTime + Date.now() - startTime;
    const temperatureDrop = calculateTemperatureDrop(duration, waterTemperature, bodyWeight);
    Alert.alert(
      'Eisbad abgeschlossen',
      `Sie waren ${duration / 1000} Sekunden im Wasser und Ihre Körpertemperatur ist um ${temperatureDrop} Grad Celsius gesunken.`,
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Körpergewicht (kg)</Text>
      <TextInput
        style={styles.input}
        onChangeText={setBodyWeight}
        value={bodyWeight}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Wassertemperatur (°C)</Text>
      <TextInput
        style={styles.input}
        onChangeText={setWaterTemperature}
        value={waterTemperature}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={stopwatchRunning ? stopStopwatch : startStopwatch}
      >
        <Text style={styles.buttonText}>
          {stopwatchRunning ? 'Stop' : 'Start'} 
        </Text>
      </TouchableOpacity>
      {stopwatchTime > 0 && (
        <Text style={styles.duration}>
          Dauer des Eisbads: {stopwatchTime / 1000} Sekunden
        </Text>
      )}
      <Calendar
        style={styles.calendar}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    width: '80%',
    marginBottom: 20,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 16,
    marginTop: 20,
  },
  calendar: {
    marginTop: 20,
    marginBottom: 20,
  },
});
