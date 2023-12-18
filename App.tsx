import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stopwatch } from 'react-native-stopwatch-timer';

const calculateTemperatureDrop = (durationInSeconds, waterTemperature, weight) => {
  const waterDensity = 1000;
  const bodySpecificHeat = 3500;

  const weightInKg = parseFloat(weight);

  const temperatureDrop = (waterTemperature - 37) * Math.exp(-(durationInSeconds / (60 * bodySpecificHeat * weightInKg / waterDensity)));

  return temperatureDrop.toFixed(2);
};

const StartPage = () => {
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [results, setResults] = useState({
    timeInWater: 0,
    temperatureDrop: 0,
  });
  const stopwatchRef = useRef();

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleStopwatchTime = (time) => {
    setElapsedTime(time);
  };

  const startStopwatch = () => {
    stopwatchRef.current.start();
  };

  const stopStopwatch = () => {
    stopwatchRef.current.stop();
    const durationInSeconds = elapsedTime;
    const temperatureDrop = calculateTemperatureDrop(durationInSeconds, temperature, weight);

    console.log(`Time in water: ${durationInSeconds} seconds`);
    console.log(`Temperature drop: ${temperatureDrop} °C`);

    setResults(prevResults => ({
      ...prevResults,
      timeInWater: durationInSeconds,
      temperatureDrop: parseFloat(temperatureDrop),
    }));
  };

  const resetStopwatch = () => {
    stopwatchRef.current.reset();
    setElapsedTime(0);
  };

  return (
    <View>
      <Text>Enter your data:</Text>
      <TextInput
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
      />
      <TextInput
        placeholder="Water Temperature (°C)"
        keyboardType="numeric"
        value={temperature}
        onChangeText={(text) => setTemperature(text)}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text>Select Date and Time</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Stopwatch
        laps
        start={false}
        options={options}
        getTime={(time) => handleStopwatchTime(time)}
        ref={stopwatchRef}
      />
      <TouchableOpacity onPress={startStopwatch}>
        <Text>Start Stopwatch</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopStopwatch}>
        <Text>Stop Stopwatch</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetStopwatch}>
        <Text>Reset Stopwatch</Text>
      </TouchableOpacity>
      <View>
        <Text>Time in Water: {results.timeInWater} seconds</Text>
        <Text>Temperature Drop: {results.temperatureDrop} °C</Text>
      </View>
    </View>
  );
};

const options = {
  container: {
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: 30,
    color: '#000',
    marginLeft: 7,
  },
};

export default StartPage;
